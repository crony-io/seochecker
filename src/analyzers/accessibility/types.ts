/**
 * @fileoverview Accessibility analysis type definitions.
 */

import type { SeoStatus } from '@/types/seo';

/** Full accessibility analysis result */
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

/** Accessibility issue found during analysis */
export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
  count: number;
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriteria: string;
}

/** Passed accessibility check */
export interface AccessibilityCheck {
  rule: string;
  description: string;
}

/** Landmark elements analysis */
export interface LandmarkAnalysis {
  hasMain: boolean;
  hasNav: boolean;
  hasHeader: boolean;
  hasFooter: boolean;
  hasAside: boolean;
  landmarks: string[];
}

/** ARIA attributes analysis */
export interface AriaAnalysis {
  ariaLabels: number;
  ariaDescribedby: number;
  ariaHidden: number;
  roles: string[];
  liveRegions: number;
}

/** Form accessibility analysis */
export interface FormAccessibility {
  totalInputs: number;
  inputsWithLabels: number;
  inputsWithPlaceholderOnly: number;
  requiredFields: number;
  requiredWithAriaRequired: number;
}

/** Contrast analysis hints */
export interface ContrastHints {
  lightTextOnLight: number;
  potentialIssues: number;
}

/** Result from individual check functions */
export interface CheckResult {
  issues: AccessibilityIssue[];
  passed: AccessibilityCheck[];
  scoreDelta: number;
}
