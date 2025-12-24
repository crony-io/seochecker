/**
 * @fileoverview Basic accessibility (WCAG) analysis.
 */

import type { SeoStatus } from '@/types/seo';
import {
  ACCESSIBILITY_ERRORS_MAX,
  ACCESSIBILITY_SCORE_GOOD,
  ACCESSIBILITY_SCORE_WARNING,
  ACCESSIBILITY_WARNINGS_MAX,
} from '@/constants/seo';

import { checkAria } from './checkAria';
import { checkForms } from './checkForms';
import { checkHeadings, checkLanguage } from './checkHeadings';
import { checkImages } from './checkImages';
import { checkLandmarks } from './checkLandmarks';
import { checkButtons, checkLinks, checkTabindex } from './checkLinks';
import type {
  AccessibilityAnalysis,
  AccessibilityCheck,
  AccessibilityIssue,
  ContrastHints,
} from './types';

// Re-export types for external use
export type {
  AccessibilityAnalysis,
  AccessibilityCheck,
  AccessibilityIssue,
  AriaAnalysis,
  ContrastHints,
  FormAccessibility,
  LandmarkAnalysis,
} from './types';

/**
 * Analyzes basic accessibility compliance.
 */
export function analyzeAccessibility(doc: Document): AccessibilityAnalysis {
  const issues: AccessibilityIssue[] = [];
  const passed: AccessibilityCheck[] = [];
  let score = 100;

  // Run all checks
  const landmarkResult = checkLandmarks(doc);
  issues.push(...landmarkResult.issues);
  passed.push(...landmarkResult.passed);
  score += landmarkResult.scoreDelta;

  const imageResult = checkImages(doc);
  issues.push(...imageResult.issues);
  passed.push(...imageResult.passed);
  score += imageResult.scoreDelta;

  const formResult = checkForms(doc);
  issues.push(...formResult.issues);
  passed.push(...formResult.passed);
  score += formResult.scoreDelta;

  const linkResult = checkLinks(doc);
  issues.push(...linkResult.issues);
  passed.push(...linkResult.passed);
  score += linkResult.scoreDelta;

  const buttonResult = checkButtons(doc);
  issues.push(...buttonResult.issues);
  passed.push(...buttonResult.passed);
  score += buttonResult.scoreDelta;

  const headingResult = checkHeadings(doc);
  issues.push(...headingResult.issues);
  passed.push(...headingResult.passed);
  score += headingResult.scoreDelta;

  const languageResult = checkLanguage(doc);
  issues.push(...languageResult.issues);
  passed.push(...languageResult.passed);
  score += languageResult.scoreDelta;

  const tabindexResult = checkTabindex(doc);
  issues.push(...tabindexResult.issues);
  passed.push(...tabindexResult.passed);
  score += tabindexResult.scoreDelta;

  // Get ARIA analysis
  const aria = checkAria(doc);

  // Contrast hints (basic - placeholder for future enhancement)
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
    landmarks: landmarkResult.landmarks,
    aria,
    forms: formResult.forms,
    contrast,
    status,
  };
}
