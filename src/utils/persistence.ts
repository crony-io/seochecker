import type { ZodType } from 'zod';

import { safeGetItem, safeRemoveItem, safeSetItem } from '@/utils/storage';

export const STORAGE_NAMESPACE = 'seocheck';

export function makeStorageKey(...parts: readonly string[]): string {
  return [STORAGE_NAMESPACE, ...parts].join('.');
}

type ReadResult = { raw: string; sourceKey: string };

function readRaw(key: string, legacyKeys?: readonly string[]): ReadResult | null {
  const value = safeGetItem(key);
  if (value != null) {
    return { raw: value, sourceKey: key };
  }

  for (const legacyKey of legacyKeys ?? []) {
    const legacyValue = safeGetItem(legacyKey);
    if (legacyValue != null) {
      return { raw: legacyValue, sourceKey: legacyKey };
    }
  }

  return null;
}

function parseRaw(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

function extractSchemaVersion(value: unknown): number | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const schemaVersion = (value as { schemaVersion?: unknown }).schemaVersion;
  return typeof schemaVersion === 'number' && Number.isInteger(schemaVersion)
    ? schemaVersion
    : null;
}

type CoerceFn = (input: unknown) => unknown | undefined;

type MigrationFn = (value: unknown) => unknown;

type VersionedSchemas = Readonly<Record<number, ZodType>>;

type VersionedMigrations = Readonly<Record<number, MigrationFn>>;

export function createVersionedLocalStorage<TLatest extends { schemaVersion: number }>(options: {
  key: string;
  latestVersion: number;
  schemas: VersionedSchemas;
  migrations?: VersionedMigrations;
  legacyKeys?: readonly string[];
  coerce?: CoerceFn;
}) {
  const { key, latestVersion, schemas, migrations, legacyKeys, coerce } = options;

  const latestSchemaCandidate = schemas[latestVersion];
  if (!latestSchemaCandidate) {
    throw new Error(`Missing schema for version ${latestVersion}.`);
  }

  const latestSchema: ZodType = latestSchemaCandidate;

  function read(): TLatest | null {
    const found = readRaw(key, legacyKeys);
    if (!found) {
      return null;
    }

    const parsed = parseRaw(found.raw);
    const candidate = coerce ? (coerce(parsed) ?? parsed) : parsed;

    let version = extractSchemaVersion(candidate);
    if (version == null || version > latestVersion) {
      return null;
    }

    let current: unknown = candidate;
    let migrated = false;

    while (version !== latestVersion) {
      const schema = schemas[version];
      const migration = migrations?.[version];

      if (!schema || !migration) {
        return null;
      }

      const validated = schema.safeParse(current);
      if (!validated.success) {
        return null;
      }

      const next = migration(validated.data);
      const nextVersion = extractSchemaVersion(next);

      if (nextVersion == null || nextVersion <= version) {
        return null;
      }

      current = next;
      version = nextVersion;
      migrated = true;

      if (version > latestVersion) {
        return null;
      }
    }

    const latestParsed = latestSchema.safeParse(current);
    if (!latestParsed.success) {
      return null;
    }

    if (migrated || found.sourceKey !== key) {
      safeSetItem(key, JSON.stringify(latestParsed.data));
    }

    return latestParsed.data as TLatest;
  }

  function write(value: TLatest): void {
    const validated = latestSchema.safeParse(value);
    if (!validated.success) {
      return;
    }

    safeSetItem(key, JSON.stringify(validated.data));
  }

  function remove(): void {
    safeRemoveItem(key);
  }

  return { read, write, remove };
}
