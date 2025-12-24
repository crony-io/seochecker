/**
 * @fileoverview URL structure and readability analysis utilities.
 */

import { MAX_PATH_DEPTH, MAX_SEGMENT_LENGTH, MAX_URL_LENGTH } from '@/constants/seo';
import type { SeoStatus } from '@/types/seo';
import { t } from '@/utils/i18nHelper';

// =============================================================================
// TYPES
// =============================================================================

/** URL structure analysis result */
export interface UrlAnalysis {
  url: string;
  protocol: string;
  hostname: string;
  pathname: string;
  pathSegments: string[];
  queryParams: Map<string, string>;
  hash: string;
  depth: number;
  length: number;
  hasWww: boolean;
  hasTrailingSlash: boolean;
  usesHttps: boolean;
  readability: UrlReadability;
  issues: string[];
  status: SeoStatus;
}

/** URL readability metrics */
export interface UrlReadability {
  hasUnderscores: boolean;
  hasUppercase: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
  hasKeywords: boolean;
  segmentLengths: number[];
  avgSegmentLength: number;
  isHumanReadable: boolean;
  score: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

// URL analysis constants are imported from @/constants/seo

/**
 * Minimal stop words subset for URL analysis.
 * Intentionally smaller than STOP_WORDS_EN in stopWords.ts because URLs should
 * retain more keywords. We only filter the most common grammatical words that
 * add no SEO value to URL segments.
 * @see {@link @/utils/stopWords.ts} for comprehensive content analysis stop words.
 */
const URL_STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'as',
  'is',
  'was',
  'are',
  'were',
  'been',
  'be',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'must',
  'shall',
  'can',
  'need',
  'that',
  'this',
  'these',
  'those',
  'it',
  'its',
]);

/** Characters that make URLs less readable */
const SPECIAL_URL_CHARS = /[!@#$%^&*()+=\[\]{}|\\:;"'<>,?]/;

// =============================================================================
// ANALYSIS FUNCTIONS
// =============================================================================

/**
 * Analyzes URL structure and readability.
 */
export function analyzeUrl(url: string): UrlAnalysis {
  let urlObj: URL;

  try {
    urlObj = new URL(url);
  } catch {
    return createErrorResult(url, t('seo.urlAnalysis.analyzers.invalidUrl'));
  }

  const pathname = urlObj.pathname;
  const pathSegments = pathname.split('/').filter((s) => s.length > 0);

  const queryParams = new Map<string, string>();
  urlObj.searchParams.forEach((value, key) => {
    queryParams.set(key, value);
  });

  const readability = analyzeReadability(pathname, pathSegments);
  const issues: string[] = [];

  // Check URL length
  if (url.length > MAX_URL_LENGTH) {
    issues.push(t('seo.urlAnalysis.analyzers.tooLong', { length: url.length, max: MAX_URL_LENGTH }));
  }

  // Check path depth
  if (pathSegments.length > MAX_PATH_DEPTH) {
    issues.push(t('seo.urlAnalysis.analyzers.tooDeep', { depth: pathSegments.length, max: MAX_PATH_DEPTH }));
  }

  // Check for underscores
  if (readability.hasUnderscores) {
    issues.push(t('seo.urlAnalysis.analyzers.hasUnderscores'));
  }

  // Check for uppercase
  if (readability.hasUppercase) {
    issues.push(t('seo.urlAnalysis.analyzers.hasUppercase'));
  }

  // Check for special characters
  if (readability.hasSpecialChars) {
    issues.push(t('seo.urlAnalysis.analyzers.hasSpecialChars'));
  }

  // Check segment lengths
  const longSegments = readability.segmentLengths.filter((l) => l > MAX_SEGMENT_LENGTH);
  if (longSegments.length > 0) {
    issues.push(t('seo.urlAnalysis.analyzers.longSegments', { count: longSegments.length, max: MAX_SEGMENT_LENGTH }));
  }

  // Check for query parameters
  if (queryParams.size > 3) {
    issues.push(t('seo.urlAnalysis.analyzers.manyParams', { count: queryParams.size }));
  }

  // Note: Trailing slash consistency (pathname !== '/' && !pathname.endsWith('/'))
  // is not flagged as an issue since both patterns are valid for SEO

  // Determine status
  let status: SeoStatus = 'good';
  if (issues.length >= 3 || !readability.isHumanReadable) {
    status = 'error';
  } else if (issues.length > 0) {
    status = 'warning';
  }

  return {
    url,
    protocol: urlObj.protocol,
    hostname: urlObj.hostname,
    pathname,
    pathSegments,
    queryParams,
    hash: urlObj.hash,
    depth: pathSegments.length,
    length: url.length,
    hasWww: urlObj.hostname.startsWith('www.'),
    hasTrailingSlash: pathname.endsWith('/') && pathname !== '/',
    usesHttps: urlObj.protocol === 'https:',
    readability,
    issues,
    status,
  };
}

/**
 * Analyzes URL readability metrics.
 */
function analyzeReadability(pathname: string, segments: string[]): UrlReadability {
  const hasUnderscores = pathname.includes('_');
  const hasUppercase = /[A-Z]/.test(pathname);
  const hasNumbers = /\d/.test(pathname);
  const hasSpecialChars = SPECIAL_URL_CHARS.test(pathname);

  const segmentLengths = segments.map((s) => s.length);
  const avgSegmentLength =
    segmentLengths.length > 0
      ? Math.round(segmentLengths.reduce((a, b) => a + b, 0) / segmentLengths.length)
      : 0;

  // Check if segments contain meaningful words
  const meaningfulSegments = segments.filter((s) => {
    const words = s
      .split(/[-_]/)
      .filter((w) => w.length > 2 && !URL_STOP_WORDS.has(w.toLowerCase()));
    return words.length > 0;
  });

  const hasKeywords = meaningfulSegments.length > 0;

  // Calculate readability score (0-100)
  let score = 100;

  if (hasUnderscores) {
    score -= 15;
  }
  if (hasUppercase) {
    score -= 10;
  }
  if (hasSpecialChars) {
    score -= 20;
  }
  if (avgSegmentLength > MAX_SEGMENT_LENGTH) {
    score -= 15;
  }
  if (!hasKeywords && segments.length > 0) {
    score -= 10;
  }
  if (segments.length > MAX_PATH_DEPTH) {
    score -= 10;
  }

  // Bonus for clean, hyphenated URLs
  const hasHyphens = pathname.includes('-');
  if (hasHyphens && !hasUnderscores) {
    score += 5;
  }

  score = Math.max(0, Math.min(100, score));

  const isHumanReadable = score >= 60 && !hasSpecialChars && !hasUppercase;

  return {
    hasUnderscores,
    hasUppercase,
    hasNumbers,
    hasSpecialChars,
    hasKeywords,
    segmentLengths,
    avgSegmentLength,
    isHumanReadable,
    score,
  };
}

/**
 * Creates an error result for invalid URLs.
 */
function createErrorResult(url: string, errorMessage: string): UrlAnalysis {
  return {
    url,
    protocol: '',
    hostname: '',
    pathname: '',
    pathSegments: [],
    queryParams: new Map(),
    hash: '',
    depth: 0,
    length: url.length,
    hasWww: false,
    hasTrailingSlash: false,
    usesHttps: false,
    readability: {
      hasUnderscores: false,
      hasUppercase: false,
      hasNumbers: false,
      hasSpecialChars: false,
      hasKeywords: false,
      segmentLengths: [],
      avgSegmentLength: 0,
      isHumanReadable: false,
      score: 0,
    },
    issues: [errorMessage],
    status: 'error',
  };
}

/**
 * Extracts potential keywords from URL path.
 */
export function extractUrlKeywords(url: string): string[] {
  try {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split('/').filter((s) => s.length > 0);

    const keywords: string[] = [];

    segments.forEach((segment) => {
      // Split by hyphens and underscores
      const words = segment.split(/[-_]/);

      words.forEach((word) => {
        const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
        if (cleaned.length > 2 && !URL_STOP_WORDS.has(cleaned)) {
          keywords.push(cleaned);
        }
      });
    });

    return [...new Set(keywords)];
  } catch {
    return [];
  }
}
