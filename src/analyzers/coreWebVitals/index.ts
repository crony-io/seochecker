/**
 * @fileoverview Core Web Vitals estimation from HTML analysis.
 * Note: These are estimates based on HTML patterns, not actual measurements.
 */

import type { SeoStatus } from '@/types/seo';

import { estimateCls } from './estimateCls';
import { estimateInteractivity } from './estimateInteractivity';
import { estimateLcp } from './estimateLcp';
import type { CoreWebVitalsAnalysis } from './types';

// Re-export types for external use
export type {
  ClsEstimate,
  ClsFactor,
  CoreWebVitalsAnalysis,
  CwvEstimateRating,
  FidEstimate,
  InpEstimate,
  LcpEstimate,
  LcpFactor,
} from './types';

/**
 * Analyzes Core Web Vitals estimates.
 */
export function analyzeCoreWebVitals(doc: Document, html: string): CoreWebVitalsAnalysis {
  const lcp = estimateLcp(doc, html);
  const cls = estimateCls(doc);
  const { fid, inp } = estimateInteractivity(doc, html);
  const recommendations: string[] = [];

  // Collect all issues as recommendations
  recommendations.push(...lcp.issues);
  recommendations.push(...cls.issues);
  recommendations.push(...fid.issues);
  recommendations.push(...inp.issues);

  // Determine overall status
  const estimates = [lcp.estimate, cls.estimate, fid.estimate, inp.estimate];
  const poorCount = estimates.filter((e) => e === 'poor').length;
  const needsImprovementCount = estimates.filter((e) => e === 'needs-improvement').length;

  let overallStatus: SeoStatus = 'good';
  if (poorCount >= 2) {
    overallStatus = 'error';
  } else if (poorCount >= 1 || needsImprovementCount >= 2) {
    overallStatus = 'warning';
  }

  return {
    lcp,
    cls,
    fid,
    inp,
    overallStatus,
    recommendations: [...new Set(recommendations)],
  };
}
