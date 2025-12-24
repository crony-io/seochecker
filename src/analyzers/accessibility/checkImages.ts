/**
 * @fileoverview Image accessibility checks.
 */

import type { AccessibilityIssue, AccessibilityCheck } from './types';

/** Result of image accessibility check */
export interface ImageCheckResult {
  issues: AccessibilityIssue[];
  passed: AccessibilityCheck[];
  scoreDelta: number;
}

/**
 * Checks images for alt text accessibility.
 */
export function checkImages(doc: Document): ImageCheckResult {
  const issues: AccessibilityIssue[] = [];
  const passed: AccessibilityCheck[] = [];
  let scoreDelta = 0;

  const images = doc.querySelectorAll('img');
  const imagesWithoutAlt = doc.querySelectorAll('img:not([alt])');

  if (imagesWithoutAlt.length > 0) {
    issues.push({
      type: 'error',
      rule: 'img-alt',
      message: 'Images missing alt attribute',
      count: imagesWithoutAlt.length,
      wcagLevel: 'A',
      wcagCriteria: '1.1.1',
    });
    scoreDelta -= Math.min(20, imagesWithoutAlt.length * 3);
  } else if (images.length > 0) {
    passed.push({ rule: 'img-alt', description: 'All images have alt attributes' });
  }

  return { issues, passed, scoreDelta };
}
