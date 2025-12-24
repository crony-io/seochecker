/**
 * @fileoverview Link and button accessibility checks.
 */

import type { AccessibilityIssue, AccessibilityCheck } from './types';

/** Result of link/button accessibility check */
export interface LinkCheckResult {
  issues: AccessibilityIssue[];
  passed: AccessibilityCheck[];
  scoreDelta: number;
}

/**
 * Checks links for accessibility.
 */
export function checkLinks(doc: Document): LinkCheckResult {
  const issues: AccessibilityIssue[] = [];
  const passed: AccessibilityCheck[] = [];
  let scoreDelta = 0;

  const links = doc.querySelectorAll('a[href]');
  const emptyLinks = Array.from(links).filter((link) => {
    const text = link.textContent?.trim() || '';
    const ariaLabel = link.getAttribute('aria-label') || '';
    const title = link.getAttribute('title') || '';
    const hasImage = link.querySelector('img[alt]');
    return !text && !ariaLabel && !title && !hasImage;
  });

  if (emptyLinks.length > 0) {
    issues.push({
      type: 'error',
      rule: 'link-text',
      message: 'Links without accessible text',
      count: emptyLinks.length,
      wcagLevel: 'A',
      wcagCriteria: '2.4.4',
    });
    scoreDelta -= Math.min(15, emptyLinks.length * 3);
  }

  return { issues, passed, scoreDelta };
}

/**
 * Checks buttons for accessibility.
 */
export function checkButtons(doc: Document): LinkCheckResult {
  const issues: AccessibilityIssue[] = [];
  const passed: AccessibilityCheck[] = [];
  let scoreDelta = 0;

  const buttons = doc.querySelectorAll(
    'button, [role="button"], input[type="button"], input[type="submit"]',
  );
  const buttonsWithoutText = Array.from(buttons).filter((btn) => {
    const text = btn.textContent?.trim() || '';
    const ariaLabel = btn.getAttribute('aria-label') || '';
    const value = btn.getAttribute('value') || '';
    const title = btn.getAttribute('title') || '';
    return !text && !ariaLabel && !value && !title;
  });

  if (buttonsWithoutText.length > 0) {
    issues.push({
      type: 'error',
      rule: 'button-text',
      message: 'Buttons without accessible text',
      count: buttonsWithoutText.length,
      wcagLevel: 'A',
      wcagCriteria: '4.1.2',
    });
    scoreDelta -= Math.min(10, buttonsWithoutText.length * 2);
  }

  return { issues, passed, scoreDelta };
}

/**
 * Checks tabindex for accessibility issues.
 */
export function checkTabindex(doc: Document): LinkCheckResult {
  const issues: AccessibilityIssue[] = [];
  const passed: AccessibilityCheck[] = [];
  let scoreDelta = 0;

  const positiveTabindex = doc.querySelectorAll(
    '[tabindex]:not([tabindex="0"]):not([tabindex="-1"])',
  );

  if (positiveTabindex.length > 0) {
    issues.push({
      type: 'warning',
      rule: 'tabindex-positive',
      message: 'Elements with positive tabindex may disrupt navigation',
      count: positiveTabindex.length,
      wcagLevel: 'A',
      wcagCriteria: '2.4.3',
    });
    scoreDelta -= 5;
  }

  return { issues, passed, scoreDelta };
}
