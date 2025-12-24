/**
 * @fileoverview Landmark elements accessibility checks.
 */

import type { AccessibilityIssue, AccessibilityCheck, LandmarkAnalysis } from './types';

/** Result of landmark analysis */
export interface LandmarkCheckResult {
  landmarks: LandmarkAnalysis;
  issues: AccessibilityIssue[];
  passed: AccessibilityCheck[];
  scoreDelta: number;
}

/**
 * Analyzes landmark elements for accessibility.
 */
export function checkLandmarks(doc: Document): LandmarkCheckResult {
  const issues: AccessibilityIssue[] = [];
  const passed: AccessibilityCheck[] = [];
  let scoreDelta = 0;

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
    scoreDelta -= 5;
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
    scoreDelta -= 2;
  }

  return { landmarks, issues, passed, scoreDelta };
}
