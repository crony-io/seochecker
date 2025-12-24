/**
 * @fileoverview Composable and helpers for persisting and applying the app theme.
 */

import { onMounted, ref } from 'vue';
import { z } from 'zod';

import { createVersionedLocalStorage, makeStorageKey } from '@/utils/persistence';

import type { Appearance, UseAppearanceReturn } from '@/types/appearance';

const persistedAppearanceV1Schema = z.object({
  schemaVersion: z.literal(1),
  appearance: z.enum(['light', 'dark', 'system']),
});

type PersistedAppearanceV1 = z.infer<typeof persistedAppearanceV1Schema>;

const appearanceStorage = createVersionedLocalStorage<PersistedAppearanceV1>({
  key: makeStorageKey('ui', 'appearance'),
  latestVersion: 1,
  schemas: {
    1: persistedAppearanceV1Schema,
  },
  legacyKeys: ['appearance'],
  coerce: (input) => {
    if (typeof input !== 'string') {
      return undefined;
    }

    const parsed = parseStoredAppearance(input);
    if (parsed == null) {
      return undefined;
    }

    return { schemaVersion: 1, appearance: parsed };
  },
});

/**
 * Updates the document theme based on the specified appearance.
 *
 * @param value The appearance setting to apply.
 */
export function updateTheme(value: Appearance): void {
  if (value === 'system') {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    const systemTheme = mediaQueryList.matches ? 'dark' : 'light';

    document.documentElement.classList.toggle('dark', systemTheme === 'dark');
  } else {
    document.documentElement.classList.toggle('dark', value === 'dark');
  }
}

/** Returns the media query for detecting system dark mode preference. */
function getMediaQuery(): MediaQueryList {
  return window.matchMedia('(prefers-color-scheme: dark)');
}

/**
 * Parses a stored appearance string into a valid Appearance value.
 *
 * @param value The raw localStorage value.
 * @returns The parsed Appearance value, or null if invalid or missing.
 */
function parseStoredAppearance(value: string | null): Appearance | null {
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }
  return null;
}

/**
 * Retrieves the stored appearance preference from localStorage.
 *
 * @returns The stored appearance value, or null if not set.
 */
function getStoredAppearance(): Appearance | null {
  const stored = appearanceStorage.read();
  return stored ? stored.appearance : null;
}

/** Handles system theme changes by updating the document theme. */
function handleSystemThemeChange(): void {
  const currentAppearance = getStoredAppearance();
  updateTheme(currentAppearance ?? 'system');
}

let themeListenerAttached = false;

/** Initializes the theme from localStorage and sets up system theme change listener. */
export function initializeTheme(): void {
  const savedAppearance = getStoredAppearance();
  updateTheme(savedAppearance ?? 'system');

  // Only attach listener once to prevent duplicates during HMR
  if (!themeListenerAttached) {
    getMediaQuery().addEventListener('change', handleSystemThemeChange);
    themeListenerAttached = true;
  }
}

/** Removes the system theme change listener. Call on app unmount if needed. */
export function cleanupTheme(): void {
  if (themeListenerAttached) {
    getMediaQuery().removeEventListener('change', handleSystemThemeChange);
    themeListenerAttached = false;
  }
}

const appearance = ref<Appearance>('system');

/**
 * Composable for managing application theme appearance.
 *
 * @returns Reactive appearance state and update function.
 */
export function useAppearance(): UseAppearanceReturn {
  onMounted(() => {
    const savedAppearance = getStoredAppearance();
    if (savedAppearance != null) {
      appearance.value = savedAppearance;
    }
  });

  /**
   * Updates the appearance setting and persists it to localStorage.
   *
   * @param value The new appearance value to apply.
   */
  function updateAppearance(value: Appearance): void {
    appearance.value = value;
    appearanceStorage.write({ schemaVersion: 1, appearance: value });
    updateTheme(value);
  }

  return {
    appearance,
    updateAppearance,
  };
}
