/**
 * @fileoverview CORS proxy utility with multiple fallback proxies.
 */

import type { FetchError } from '@/types/seo';

/** Available CORS proxy configurations */
export const CORS_PROXIES = [
  {
    name: 'allorigins',
    buildUrl: (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'corsproxy.io',
    buildUrl: (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  },
  {
    name: 'codetabs',
    buildUrl: (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  },
] as const;

/** Default timeout in milliseconds */
export const DEFAULT_TIMEOUT = 15000;

/** Shorter timeout for resource fetching */
export const RESOURCE_FETCH_TIMEOUT = 10000;

/**
 * Fetches a resource using CORS proxies (for robots.txt, sitemap, etc.).
 */
export async function fetchResource(
  url: string,
  options?: { timeout?: number },
): Promise<{ ok: boolean; content: string | null }> {
  const timeout = options?.timeout ?? RESOURCE_FETCH_TIMEOUT;

  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy.buildUrl(url);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(proxyUrl, {
        signal: controller.signal,
        headers: { Accept: 'text/plain,text/xml,application/xml,*/*' },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const content = await response.text();
        return { ok: true, content };
      }
    } catch {
      continue;
    }
  }
  return { ok: false, content: null };
}

/** Result of a successful fetch */
export interface FetchSuccess {
  ok: true;
  html: string;
  duration: number;
  proxyUsed: string;
}

/** Result of a failed fetch */
export interface FetchFailure {
  ok: false;
  error: FetchError;
}

/** Fetch result union type */
export type FetchResult = FetchSuccess | FetchFailure;

/**
 * Validates if a string is a valid URL.
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Normalizes a URL by adding protocol if missing.
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

/**
 * Fetches HTML content from a URL using CORS proxies with fallback.
 */
export async function fetchWithProxy(
  url: string,
  options?: { timeout?: number },
): Promise<FetchResult> {
  const normalizedUrl = normalizeUrl(url);

  if (!isValidUrl(normalizedUrl)) {
    return {
      ok: false,
      error: {
        type: 'invalid-url',
        message: 'Invalid URL format',
      },
    };
  }

  const timeout = options?.timeout ?? DEFAULT_TIMEOUT;
  const startTime = performance.now();
  const errors: string[] = [];

  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy.buildUrl(normalizedUrl);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(proxyUrl, {
        signal: controller.signal,
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const html = await response.text();
        const duration = performance.now() - startTime;

        return {
          ok: true,
          html,
          duration,
          proxyUsed: proxy.name,
        };
      }

      errors.push(`${proxy.name}: HTTP ${response.status}`);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errors.push(`${proxy.name}: Timeout`);
        } else {
          errors.push(`${proxy.name}: ${err.message}`);
        }
      }
    }
  }

  return {
    ok: false,
    error: {
      type: 'cors',
      message: `All proxies failed: ${errors.join('; ')}`,
    },
  };
}

/**
 * Extracts the domain from a URL.
 */
export function extractDomain(url: string): string {
  try {
    const parsed = new URL(normalizeUrl(url));
    return parsed.hostname;
  } catch {
    return '';
  }
}

/**
 * Checks if a link is internal relative to the base URL.
 */
export function isInternalLink(href: string, baseUrl: string): boolean {
  if (
    !href ||
    href.startsWith('#') ||
    href.startsWith('javascript:') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return false;
  }

  try {
    const baseDomain = extractDomain(baseUrl);

    if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
      return true;
    }

    if (href.startsWith('http://') || href.startsWith('https://')) {
      const linkDomain = extractDomain(href);
      return linkDomain === baseDomain;
    }

    return true;
  } catch {
    return false;
  }
}
