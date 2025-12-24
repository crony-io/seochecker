/**
 * @fileoverview FID/INP (First Input Delay / Interaction to Next Paint) estimation.
 */

import { EXTERNAL_SCRIPTS_MAX, INLINE_SCRIPT_SIZE_MAX } from '@/constants/seo';

import type { FidEstimate, InpEstimate } from './types';

/** Combined result for interactivity metrics */
export interface InteractivityEstimate {
  fid: FidEstimate;
  inp: InpEstimate;
}

/**
 * Estimates FID/INP risk from HTML structure.
 */
export function estimateInteractivity(doc: Document, html: string): InteractivityEstimate {
  const fidFactors: string[] = [];
  const fidIssues: string[] = [];
  const inpFactors: string[] = [];
  const inpIssues: string[] = [];
  let fidScore = 100;
  let inpScore = 100;

  // Check for heavy JavaScript
  const scripts = doc.querySelectorAll('script[src]');
  const inlineScripts = doc.querySelectorAll('script:not([src])');

  let totalInlineScriptSize = 0;
  inlineScripts.forEach((script) => {
    totalInlineScriptSize += (script.textContent || '').length;
  });

  if (scripts.length > EXTERNAL_SCRIPTS_MAX) {
    fidFactors.push(`${scripts.length} external scripts`);
    fidIssues.push('Consider reducing number of external scripts');
    fidScore -= 15;
  }

  if (totalInlineScriptSize > INLINE_SCRIPT_SIZE_MAX) {
    fidFactors.push('Large inline JavaScript');
    fidIssues.push('Consider moving inline scripts to external files');
    fidScore -= 10;
  }

  // Check for async/defer usage
  const asyncScripts = doc.querySelectorAll('script[async]');
  const deferScripts = doc.querySelectorAll('script[defer]');

  if (asyncScripts.length > 0 || deferScripts.length > 0) {
    fidFactors.push('Using async/defer scripts');
    fidScore += 10;
  }

  // Check for heavy event listeners patterns
  if (/addEventListener\s*\([^)]*scroll/gi.test(html)) {
    inpFactors.push('Scroll event listeners detected');
    inpIssues.push('Ensure scroll handlers are debounced/throttled');
    inpScore -= 5;
  }

  // Check for long tasks indicators
  const heavyLibraries = [
    { pattern: /moment\.js/i, name: 'Moment.js (consider lighter alternative)' },
    { pattern: /lodash\.js/i, name: 'Full Lodash (consider modular imports)' },
    { pattern: /jquery.*\.js/i, name: 'jQuery' },
  ];

  heavyLibraries.forEach(({ pattern, name }) => {
    if (pattern.test(html)) {
      inpFactors.push(name);
      inpScore -= 5;
    }
  });

  // Check for Web Workers usage (positive)
  if (/new Worker\(/i.test(html)) {
    fidFactors.push('Web Workers detected (good for offloading work)');
    fidScore += 10;
  }

  // Determine estimates
  const fidEstimate: FidEstimate['estimate'] =
    fidScore >= 80 ? 'good' : fidScore >= 50 ? 'needs-improvement' : 'poor';

  const inpEstimate: InpEstimate['estimate'] =
    inpScore >= 80 ? 'good' : inpScore >= 50 ? 'needs-improvement' : 'poor';

  return {
    fid: {
      estimate: fidEstimate,
      factors: fidFactors,
      issues: fidIssues,
    },
    inp: {
      estimate: inpEstimate,
      factors: inpFactors,
      issues: inpIssues,
    },
  };
}
