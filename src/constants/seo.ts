/**
 * @fileoverview SEO analysis constants and thresholds.
 * Centralized configuration for all magic numbers used in SEO analysis.
 */

// =============================================================================
// META TAGS
// =============================================================================

/** Minimum recommended title length for SEO */
export const TITLE_MIN_LENGTH = 30;

/** Maximum recommended title length for SEO */
export const TITLE_MAX_LENGTH = 60;

/** Minimum recommended meta description length */
export const DESCRIPTION_MIN_LENGTH = 120;

/** Maximum recommended meta description length */
export const DESCRIPTION_MAX_LENGTH = 160;

// =============================================================================
// CONTENT ANALYSIS
// =============================================================================

/** Words per minute for reading time calculation */
export const WORDS_PER_MINUTE = 200;

/** Minimum word count for good content status */
export const CONTENT_MIN_WORDS_GOOD = 300;

/** Minimum word count for warning status (below is error) */
export const CONTENT_MIN_WORDS_WARNING = 100;

/** Minimum text-to-HTML ratio percentage for good status */
export const TEXT_HTML_RATIO_MIN = 25;

// =============================================================================
// IMAGES
// =============================================================================

/** Threshold for image alt ratio - above this is warning, below is good */
export const IMAGE_ALT_WARNING_THRESHOLD = 0.2;

// =============================================================================
// KEYWORDS
// =============================================================================

/** Minimum word length to consider for keyword analysis */
export const KEYWORD_MIN_WORD_LENGTH = 3;

/** Number of top keywords to extract */
export const TOP_KEYWORDS_COUNT = 20;

/** Number of top keywords to check for consistency */
export const KEYWORD_CONSISTENCY_CHECK_COUNT = 10;

/** Minimum consistency score for good status */
export const KEYWORD_CONSISTENCY_GOOD = 5;

/** Minimum consistency score for warning status (below is error) */
export const KEYWORD_CONSISTENCY_WARNING = 2;

// =============================================================================
// PERFORMANCE
// =============================================================================

/** Maximum DOM elements for good status */
export const DOM_ELEMENTS_GOOD = 1500;

/** Maximum DOM elements for warning status (above is error) */
export const DOM_ELEMENTS_WARNING = 3000;

/** Maximum HTML size in bytes for good status */
export const HTML_SIZE_GOOD = 500000;

/** Maximum HTML size in bytes for warning status */
export const HTML_SIZE_WARNING = 1000000;

/** Maximum blocking resources for good status */
export const BLOCKING_RESOURCES_MAX = 3;

// =============================================================================
// TECHNICAL SEO
// =============================================================================

/** Minimum passed technical checks for good status */
export const TECHNICAL_CHECKS_GOOD = 5;

/** Minimum passed technical checks for warning status (below is error) */
export const TECHNICAL_CHECKS_WARNING = 3;

// =============================================================================
// ANCHOR TEXT
// =============================================================================

/** Maximum anchor text length before considered over-optimized */
export const ANCHOR_TEXT_MAX_LENGTH = 60;

/** Minimum anchor text length to analyze */
export const ANCHOR_TEXT_MIN_LENGTH = 2;

/** Generic anchor ratio threshold for warning */
export const GENERIC_ANCHOR_WARNING_THRESHOLD = 0.3;

/** Over-optimized anchor ratio threshold for warning */
export const OVER_OPTIMIZED_ANCHOR_WARNING_THRESHOLD = 0.2;

/** Generic anchor ratio threshold for error status */
export const GENERIC_ANCHOR_ERROR_THRESHOLD = 0.5;

/** Maximum generic texts to display */
export const GENERIC_TEXTS_DISPLAY_LIMIT = 10;

/** List of generic anchor text phrases to detect */
export const GENERIC_ANCHOR_PHRASES = [
  'click here',
  'read more',
  'learn more',
  'here',
  'more',
  'link',
  'this',
  'click',
  'go',
  'see more',
  'view more',
  'continue reading',
] as const;

/** Non-descriptive anchor texts for link analysis */
export const NON_DESCRIPTIVE_ANCHORS = ['click here', 'read more', 'here', 'link', 'more'] as const;

// =============================================================================
// MOBILE RESPONSIVENESS
// =============================================================================

/** Minimum font size in pixels for mobile readability */
export const MOBILE_MIN_FONT_SIZE = 14;

/** Minimum touch target size in pixels */
export const TOUCH_TARGET_MIN_SIZE = 44;

/** Maximum mobile issues before error status */
export const MOBILE_ISSUES_ERROR_THRESHOLD = 2;

// =============================================================================
// RESOURCE OPTIMIZATION
// =============================================================================

/** Minification rate threshold for warning status */
export const MINIFICATION_RATE_WARNING = 0.8;

/** Minification rate threshold for error status */
export const MINIFICATION_RATE_ERROR = 0.5;

/** Minimum inline script size to check for minification */
export const INLINE_SCRIPT_MIN_SIZE = 200;

/** Minimum inline style size to check for minification */
export const INLINE_STYLE_MIN_SIZE = 500;

// =============================================================================
// RENDERING ANALYSIS
// =============================================================================

/** Minimum body text length to consider substantial content */
export const SUBSTANTIAL_CONTENT_LENGTH = 200;

/** Minimum noscript content length to be meaningful */
export const NOSCRIPT_MIN_LENGTH = 50;

// =============================================================================
// ACCESSIBILITY
// =============================================================================

/** Accessibility score threshold for good status */
export const ACCESSIBILITY_SCORE_GOOD = 80;

/** Accessibility score threshold for warning status */
export const ACCESSIBILITY_SCORE_WARNING = 50;

/** Maximum accessibility errors before error status */
export const ACCESSIBILITY_ERRORS_MAX = 3;

/** Maximum accessibility warnings before warning status */
export const ACCESSIBILITY_WARNINGS_MAX = 3;

// =============================================================================
// CORE WEB VITALS
// =============================================================================

/** Score threshold for good CWV estimate */
export const CWV_SCORE_GOOD = 80;

/** Score threshold for needs-improvement CWV estimate */
export const CWV_SCORE_NEEDS_IMPROVEMENT = 50;

/** Maximum blocking stylesheets before flagging */
export const BLOCKING_STYLESHEETS_MAX = 3;

/** Maximum blocking scripts before flagging */
export const BLOCKING_SCRIPTS_MAX = 2;

/** Maximum external scripts before FID warning */
export const EXTERNAL_SCRIPTS_MAX = 10;

/** Maximum inline script size before FID warning */
export const INLINE_SCRIPT_SIZE_MAX = 50000;

/** Large HTML size threshold */
export const HTML_SIZE_LARGE = 100000;

// =============================================================================
// URL ANALYSIS
// =============================================================================

/** Maximum recommended URL length */
export const MAX_URL_LENGTH = 100;

/** Maximum recommended path depth */
export const MAX_PATH_DEPTH = 4;

/** Maximum recommended URL segment length */
export const MAX_SEGMENT_LENGTH = 30;

// =============================================================================
// TIMEOUTS
// =============================================================================

/** Default toast notification duration in milliseconds */
export const TOAST_DEFAULT_DURATION = 3500;

/** Fetch timeout for security analysis in milliseconds */
export const SECURITY_FETCH_TIMEOUT = 5000;

// =============================================================================
// SCORE DISPLAY
// =============================================================================

/** Score threshold for good status (green) */
export const SCORE_THRESHOLD_GOOD = 80;

/** Score threshold for warning status (yellow) */
export const SCORE_THRESHOLD_WARNING = 60;

/** Score threshold for poor status (orange) */
export const SCORE_THRESHOLD_POOR = 40;

/** Score color type for Tailwind CSS classes */
export type ScoreColorClass =
  | 'text-green-500'
  | 'text-yellow-500'
  | 'text-orange-500'
  | 'text-red-500';

/** Score color type for hex values */
export type ScoreColorHex = '#22c55e' | '#f59e0b' | '#f97316' | '#ef4444';

/**
 * Gets the Tailwind CSS color class for a score.
 */
export function getScoreColorClass(score: number): ScoreColorClass {
  if (score >= SCORE_THRESHOLD_GOOD) {
    return 'text-green-500';
  }
  if (score >= SCORE_THRESHOLD_WARNING) {
    return 'text-yellow-500';
  }
  if (score >= SCORE_THRESHOLD_POOR) {
    return 'text-orange-500';
  }
  return 'text-red-500';
}

/**
 * Gets the hex color for a score (for use in inline styles/PDF).
 */
export function getScoreColorHex(score: number): ScoreColorHex {
  if (score >= SCORE_THRESHOLD_GOOD) {
    return '#22c55e';
  }
  if (score >= SCORE_THRESHOLD_WARNING) {
    return '#f59e0b';
  }
  if (score >= SCORE_THRESHOLD_POOR) {
    return '#f97316';
  }
  return '#ef4444';
}
