/**
 * @fileoverview ARIA attributes analysis.
 */

import type { AriaAnalysis } from './types';

/**
 * Analyzes ARIA attribute usage.
 */
export function checkAria(doc: Document): AriaAnalysis {
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

  return {
    ariaLabels,
    ariaDescribedby,
    ariaHidden,
    roles,
    liveRegions,
  };
}
