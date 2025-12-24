/**
 * @fileoverview Form accessibility checks.
 */

import type { AccessibilityIssue, AccessibilityCheck, FormAccessibility } from './types';

/** Result of form accessibility check */
export interface FormCheckResult {
  forms: FormAccessibility;
  issues: AccessibilityIssue[];
  passed: AccessibilityCheck[];
  scoreDelta: number;
}

/**
 * Checks form elements for accessibility.
 */
export function checkForms(doc: Document): FormCheckResult {
  const issues: AccessibilityIssue[] = [];
  const passed: AccessibilityCheck[] = [];
  let scoreDelta = 0;

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
    scoreDelta -= Math.min(15, missing * 3);
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
    scoreDelta -= Math.min(10, inputsWithPlaceholderOnly * 2);
  }

  return { forms, issues, passed, scoreDelta };
}
