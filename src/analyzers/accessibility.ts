/**
 * @fileoverview Basic accessibility (WCAG) analysis.
 */

import type { SeoStatus } from '@/types/seo';
import {
  ACCESSIBILITY_SCORE_GOOD,
  ACCESSIBILITY_SCORE_WARNING,
  ACCESSIBILITY_ERRORS_MAX,
  ACCESSIBILITY_WARNINGS_MAX,
} from '@/constants/seo';

export interface AccessibilityAnalysis {
  score: number;
  issues: AccessibilityIssue[];
  passed: AccessibilityCheck[];
  landmarks: LandmarkAnalysis;
  aria: AriaAnalysis;
  forms: FormAccessibility;
  contrast: ContrastHints;
  status: SeoStatus;
}

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
  count: number;
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriteria: string;
}

export interface AccessibilityCheck {
  rule: string;
  description: string;
}

export interface LandmarkAnalysis {
  hasMain: boolean;
  hasNav: boolean;
  hasHeader: boolean;
  hasFooter: boolean;
  hasAside: boolean;
  landmarks: string[];
}

export interface AriaAnalysis {
  ariaLabels: number;
  ariaDescribedby: number;
  ariaHidden: number;
  roles: string[];
  liveRegions: number;
}

export interface FormAccessibility {
  totalInputs: number;
  inputsWithLabels: number;
  inputsWithPlaceholderOnly: number;
  requiredFields: number;
  requiredWithAriaRequired: number;
}

export interface ContrastHints {
  lightTextOnLight: number;
  potentialIssues: number;
}

/**
 * Analyzes basic accessibility compliance.
 */
export function analyzeAccessibility(doc: Document): AccessibilityAnalysis {
  const issues: AccessibilityIssue[] = [];
  const passed: AccessibilityCheck[] = [];
  let score = 100;

  // === LANDMARK ANALYSIS ===
  const landmarks: LandmarkAnalysis = {
    hasMain: doc.querySelector('main, [role="main"]') !== null,
    hasNav: doc.querySelector('nav, [role="navigation"]') !== null,
    hasHeader: doc.querySelector('header, [role="banner"]') !== null,
    hasFooter: doc.querySelector('footer, [role="contentinfo"]') !== null,
    hasAside: doc.querySelector('aside, [role="complementary"]') !== null,
    landmarks: [],
  };

  const landmarkElements = doc.querySelectorAll(
    'main, nav, header, footer, aside, [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="search"]',
  );
  landmarks.landmarks = Array.from(
    new Set(Array.from(landmarkElements).map((el) => el.tagName.toLowerCase())),
  );

  if (!landmarks.hasMain) {
    issues.push({
      type: 'warning',
      rule: 'landmark-main',
      message: 'Page lacks a main landmark',
      count: 1,
      wcagLevel: 'A',
      wcagCriteria: '1.3.1',
    });
    score -= 5;
  } else {
    passed.push({ rule: 'landmark-main', description: 'Has main landmark' });
  }

  if (!landmarks.hasNav && doc.querySelectorAll('a').length > 5) {
    issues.push({
      type: 'info',
      rule: 'landmark-nav',
      message: 'Consider adding navigation landmark for better accessibility',
      count: 1,
      wcagLevel: 'A',
      wcagCriteria: '1.3.1',
    });
    score -= 2;
  }

  // === IMAGE ALT TEXT ===
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
    score -= Math.min(20, imagesWithoutAlt.length * 3);
  } else if (images.length > 0) {
    passed.push({ rule: 'img-alt', description: 'All images have alt attributes' });
  }

  // === FORM ACCESSIBILITY ===
  const inputs = doc.querySelectorAll(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select',
  );
  let inputsWithProperLabel = 0;
  inputs.forEach((input) => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    const hasLabel = id ? doc.querySelector(`label[for="${id}"]`) !== null : false;
    const isInLabel = input.closest('label') !== null;

    if (hasLabel || isInLabel || ariaLabel || ariaLabelledby) {
      inputsWithProperLabel++;
    }
  });

  const inputsWithPlaceholderOnly = Array.from(inputs).filter((input) => {
    const hasPlaceholder = input.getAttribute('placeholder');
    const id = input.getAttribute('id');
    const hasLabel = id ? doc.querySelector(`label[for="${id}"]`) !== null : false;
    const isInLabel = input.closest('label') !== null;
    const ariaLabel = input.getAttribute('aria-label');
    return hasPlaceholder && !hasLabel && !isInLabel && !ariaLabel;
  }).length;

  const requiredFields = doc.querySelectorAll('[required]').length;
  const requiredWithAriaRequired = doc.querySelectorAll('[required][aria-required="true"]').length;

  const forms: FormAccessibility = {
    totalInputs: inputs.length,
    inputsWithLabels: inputsWithProperLabel,
    inputsWithPlaceholderOnly,
    requiredFields,
    requiredWithAriaRequired,
  };

  if (inputs.length > 0 && inputsWithProperLabel < inputs.length) {
    const missing = inputs.length - inputsWithProperLabel;
    issues.push({
      type: 'error',
      rule: 'form-labels',
      message: 'Form inputs missing associated labels',
      count: missing,
      wcagLevel: 'A',
      wcagCriteria: '1.3.1',
    });
    score -= Math.min(15, missing * 3);
  } else if (inputs.length > 0) {
    passed.push({ rule: 'form-labels', description: 'All form inputs have labels' });
  }

  if (inputsWithPlaceholderOnly > 0) {
    issues.push({
      type: 'warning',
      rule: 'placeholder-label',
      message: 'Inputs using placeholder as only label',
      count: inputsWithPlaceholderOnly,
      wcagLevel: 'A',
      wcagCriteria: '3.3.2',
    });
    score -= Math.min(10, inputsWithPlaceholderOnly * 2);
  }

  // === ARIA ANALYSIS ===
  const ariaLabels = doc.querySelectorAll('[aria-label]').length;
  const ariaDescribedby = doc.querySelectorAll('[aria-describedby]').length;
  const ariaHidden = doc.querySelectorAll('[aria-hidden="true"]').length;
  const liveRegions = doc.querySelectorAll('[aria-live]').length;

  const roleElements = doc.querySelectorAll('[role]');
  const roles: string[] = [];
  roleElements.forEach((el) => {
    const role = el.getAttribute('role');
    if (role && !roles.includes(role)) {
      roles.push(role);
    }
  });

  const aria: AriaAnalysis = {
    ariaLabels,
    ariaDescribedby,
    ariaHidden,
    roles,
    liveRegions,
  };

  // === LINKS ===
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
    score -= Math.min(15, emptyLinks.length * 3);
  }

  // === HEADING STRUCTURE ===
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
    score -= 10;
  } else if (h1Count > 1) {
    issues.push({
      type: 'warning',
      rule: 'heading-h1-multiple',
      message: 'Multiple H1 headings found',
      count: h1Count,
      wcagLevel: 'A',
      wcagCriteria: '1.3.1',
    });
    score -= 5;
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
    score -= 5;
  }

  // === LANGUAGE ===
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
    score -= 10;
  } else {
    passed.push({ rule: 'html-lang', description: 'HTML has lang attribute' });
  }

  // === BUTTONS ===
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
    score -= Math.min(10, buttonsWithoutText.length * 2);
  }

  // === TABINDEX ===
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
    score -= 5;
  }

  // === CONTRAST HINTS (basic) ===
  const contrast: ContrastHints = {
    lightTextOnLight: 0,
    potentialIssues: 0,
  };

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine status
  let status: SeoStatus = 'good';
  const errorCount = issues.filter((i) => i.type === 'error').length;
  const warningCount = issues.filter((i) => i.type === 'warning').length;

  if (errorCount > ACCESSIBILITY_ERRORS_MAX || score < ACCESSIBILITY_SCORE_WARNING) {
    status = 'error';
  } else if (
    errorCount > 0 ||
    warningCount > ACCESSIBILITY_WARNINGS_MAX ||
    score < ACCESSIBILITY_SCORE_GOOD
  ) {
    status = 'warning';
  }

  return {
    score,
    issues,
    passed,
    landmarks,
    aria,
    forms,
    contrast,
    status,
  };
}
