/**
 * @fileoverview Heading structure accessibility checks.
 */

import type { AccessibilityIssue, AccessibilityCheck } from './types';

/** Result of heading accessibility check */
export interface HeadingCheckResult {
  issues: AccessibilityIssue[];
  passed: AccessibilityCheck[];
  scoreDelta: number;
}

/**
 * Checks heading structure for accessibility.
 */
export function checkHeadings(doc: Document): HeadingCheckResult {
  const issues: AccessibilityIssue[] = [];
  const passed: AccessibilityCheck[] = [];
  let scoreDelta = 0;

  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const h1Count = doc.querySelectorAll('h1').length;

  if (h1Count === 0) {
    issues.push({
      type: 'error',
      rule: 'heading-h1',
      message: 'Page lacks an H1 heading',
      count: 1,
      wcagLevel: 'A',
      wcagCriteria: '1.3.1',
    });
    scoreDelta -= 10;
  } else if (h1Count > 1) {
    issues.push({
      type: 'warning',
      rule: 'heading-h1-multiple',
      message: 'Multiple H1 headings found',
      count: h1Count,
      wcagLevel: 'A',
      wcagCriteria: '1.3.1',
    });
    scoreDelta -= 5;
  } else {
    passed.push({ rule: 'heading-h1', description: 'Has single H1 heading' });
  }

  // Check heading order
  const headingLevels = Array.from(headings).map((h) => {
    const levelChar = h.tagName[1];
    return levelChar ? parseInt(levelChar, 10) : 0;
  });

  let hasSkippedLevel = false;
  for (let i = 1; i < headingLevels.length; i++) {
    const current = headingLevels[i];
    const previous = headingLevels[i - 1];
    if (current !== undefined && previous !== undefined && current - previous > 1) {
      hasSkippedLevel = true;
      break;
    }
  }

  if (hasSkippedLevel) {
    issues.push({
      type: 'warning',
      rule: 'heading-order',
      message: 'Heading levels are skipped',
      count: 1,
      wcagLevel: 'A',
      wcagCriteria: '1.3.1',
    });
    scoreDelta -= 5;
  }

  return { issues, passed, scoreDelta };
}

/**
 * Checks for lang attribute on html element.
 */
export function checkLanguage(doc: Document): HeadingCheckResult {
  const issues: AccessibilityIssue[] = [];
  const passed: AccessibilityCheck[] = [];
  let scoreDelta = 0;

  const htmlLang = doc.documentElement.getAttribute('lang');

  if (!htmlLang) {
    issues.push({
      type: 'error',
      rule: 'html-lang',
      message: 'Missing lang attribute on html element',
      count: 1,
      wcagLevel: 'A',
      wcagCriteria: '3.1.1',
    });
    scoreDelta -= 10;
  } else {
    passed.push({ rule: 'html-lang', description: 'HTML has lang attribute' });
  }

  return { issues, passed, scoreDelta };
}
