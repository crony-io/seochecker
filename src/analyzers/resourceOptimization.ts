/**
 * @fileoverview Resource optimization analysis - minification, print styles, etc.
 */

import type { SeoStatus } from '@/types/seo';
import {
  MINIFICATION_RATE_WARNING,
  MINIFICATION_RATE_ERROR,
  INLINE_SCRIPT_MIN_SIZE,
  INLINE_STYLE_MIN_SIZE,
} from '@/constants/seo';

export interface ResourceInfo {
  url: string;
  type: 'script' | 'stylesheet';
  isMinified: boolean;
  size?: number;
  issues: string[];
}

export interface ResourceOptimizationAnalysis {
  scripts: ResourceInfo[];
  stylesheets: ResourceInfo[];
  minifiedScripts: number;
  minifiedStylesheets: number;
  totalScripts: number;
  totalStylesheets: number;
  hasPrintStyles: boolean;
  printStylesheets: string[];
  printMediaQueries: number;
  issues: string[];
  status: SeoStatus;
}

/**
 * Checks if content appears to be minified.
 * Minified code typically has very long lines and minimal whitespace.
 */
function isMinified(content: string): boolean {
  if (!content || content.length < 100) {
    return false;
  }

  const lines = content.split('\n');
  const avgLineLength = content.length / lines.length;

  // Minified files typically have very long lines (>500 chars on average)
  // or very few lines relative to content length
  if (avgLineLength > 500) {
    return true;
  }

  // Check whitespace ratio - minified code has very little whitespace
  const whitespaceCount = (content.match(/\s/g) || []).length;
  const whitespaceRatio = whitespaceCount / content.length;

  // Minified code typically has <10% whitespace
  if (whitespaceRatio < 0.1 && content.length > 500) {
    return true;
  }

  // Check for common minification patterns
  const hasMinPatterns =
    /\}\w/.test(content) || // No space after }
    /;\w/.test(content) || // No space after ;
    /,\w/.test(content); // No space after ,

  return hasMinPatterns && whitespaceRatio < 0.15;
}

/**
 * Checks if a URL suggests the resource is minified.
 */
function urlSuggestsMinified(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return (
    lowerUrl.includes('.min.') ||
    lowerUrl.includes('-min.') ||
    lowerUrl.includes('_min.') ||
    lowerUrl.includes('.bundle.') ||
    lowerUrl.includes('.prod.')
  );
}

/**
 * Detects print stylesheets from link elements.
 */
function detectPrintStylesheets(doc: Document): string[] {
  const printSheets: string[] = [];
  const links = doc.querySelectorAll('link[rel="stylesheet"]');

  links.forEach((link) => {
    const media = link.getAttribute('media');
    const href = link.getAttribute('href');
    if (media?.includes('print') && href) {
      printSheets.push(href);
    }
  });

  return printSheets;
}

/**
 * Counts print media queries in inline styles and style elements.
 */
function countPrintMediaQueries(doc: Document, html: string): number {
  let count = 0;

  // Count @media print in style elements
  const styles = doc.querySelectorAll('style');
  styles.forEach((style) => {
    const content = style.textContent || '';
    const matches = content.match(/@media\s+print/gi);
    if (matches) {
      count += matches.length;
    }
  });

  // Also check inline styles in the HTML
  const htmlMatches = html.match(/@media\s+print/gi);
  if (htmlMatches) {
    count = Math.max(count, htmlMatches.length);
  }

  return count;
}

/**
 * Analyzes resource optimization including minification and print styles.
 */
export function analyzeResourceOptimization(
  doc: Document,
  html: string,
): ResourceOptimizationAnalysis {
  const scripts: ResourceInfo[] = [];
  const stylesheets: ResourceInfo[] = [];
  const issues: string[] = [];

  // Analyze external scripts
  const scriptElements = doc.querySelectorAll('script[src]');
  scriptElements.forEach((script) => {
    const src = script.getAttribute('src');
    if (src && !src.startsWith('data:')) {
      const isMinifiedByUrl = urlSuggestsMinified(src);
      scripts.push({
        url: src,
        type: 'script',
        isMinified: isMinifiedByUrl,
        issues: isMinifiedByUrl ? [] : ['Not minified (based on filename)'],
      });
    }
  });

  // Analyze inline scripts for minification hints
  const inlineScripts = doc.querySelectorAll('script:not([src])');
  inlineScripts.forEach((script) => {
    const content = script.textContent || '';
    if (content.length > INLINE_SCRIPT_MIN_SIZE) {
      const minified = isMinified(content);
      if (!minified) {
        issues.push('Large inline script is not minified');
      }
    }
  });

  // Analyze external stylesheets
  const linkElements = doc.querySelectorAll('link[rel="stylesheet"]');
  linkElements.forEach((link) => {
    const href = link.getAttribute('href');
    const media = link.getAttribute('media');
    if (href && !href.startsWith('data:') && media !== 'print') {
      const isMinifiedByUrl = urlSuggestsMinified(href);
      stylesheets.push({
        url: href,
        type: 'stylesheet',
        isMinified: isMinifiedByUrl,
        issues: isMinifiedByUrl ? [] : ['Not minified (based on filename)'],
      });
    }
  });

  // Analyze inline styles
  const styleElements = doc.querySelectorAll('style');
  styleElements.forEach((style) => {
    const content = style.textContent || '';
    if (content.length > INLINE_STYLE_MIN_SIZE) {
      const minified = isMinified(content);
      if (!minified) {
        issues.push('Large inline style block is not minified');
      }
    }
  });

  // Print styles detection
  const printStylesheets = detectPrintStylesheets(doc);
  const printMediaQueries = countPrintMediaQueries(doc, html);
  const hasPrintStyles = printStylesheets.length > 0 || printMediaQueries > 0;

  // Calculate minification stats
  const minifiedScripts = scripts.filter((s) => s.isMinified).length;
  const minifiedStylesheets = stylesheets.filter((s) => s.isMinified).length;

  // Add issues for non-minified resources
  const nonMinifiedScripts = scripts.length - minifiedScripts;
  const nonMinifiedStyles = stylesheets.length - minifiedStylesheets;

  if (nonMinifiedScripts > 0) {
    issues.push(`${nonMinifiedScripts} script(s) may not be minified`);
  }
  if (nonMinifiedStyles > 0) {
    issues.push(`${nonMinifiedStyles} stylesheet(s) may not be minified`);
  }

  // Determine status
  let status: SeoStatus = 'good';
  const totalResources = scripts.length + stylesheets.length;
  const minifiedTotal = minifiedScripts + minifiedStylesheets;

  if (totalResources > 0) {
    const minificationRate = minifiedTotal / totalResources;
    if (minificationRate < MINIFICATION_RATE_ERROR) {
      status = 'error';
    } else if (minificationRate < MINIFICATION_RATE_WARNING) {
      status = 'warning';
    }
  }

  return {
    scripts,
    stylesheets,
    minifiedScripts,
    minifiedStylesheets,
    totalScripts: scripts.length,
    totalStylesheets: stylesheets.length,
    hasPrintStyles,
    printStylesheets,
    printMediaQueries,
    issues,
    status,
  };
}
