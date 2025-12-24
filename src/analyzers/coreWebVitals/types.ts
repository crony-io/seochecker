/**
 * @fileoverview Core Web Vitals type definitions.
 */

import type { SeoStatus } from '@/types/seo';

/** Estimate rating for Core Web Vitals metrics */
export type CwvEstimateRating = 'good' | 'needs-improvement' | 'poor' | 'unknown';

/** Impact type for factors affecting metrics */
export type FactorImpact = 'positive' | 'negative' | 'neutral';

/** Full Core Web Vitals analysis result */
export interface CoreWebVitalsAnalysis {
  lcp: LcpEstimate;
  cls: ClsEstimate;
  fid: FidEstimate;
  inp: InpEstimate;
  overallStatus: SeoStatus;
  recommendations: string[];
}

/** LCP (Largest Contentful Paint) estimate */
export interface LcpEstimate {
  estimate: CwvEstimateRating;
  factors: LcpFactor[];
  largestElement: string | null;
  issues: string[];
}

/** Factor affecting LCP */
export interface LcpFactor {
  factor: string;
  impact: FactorImpact;
  description: string;
}

/** CLS (Cumulative Layout Shift) estimate */
export interface ClsEstimate {
  estimate: CwvEstimateRating;
  factors: ClsFactor[];
  issues: string[];
}

/** Factor affecting CLS */
export interface ClsFactor {
  factor: string;
  impact: FactorImpact;
  count: number;
}

/** FID (First Input Delay) estimate */
export interface FidEstimate {
  estimate: CwvEstimateRating;
  factors: string[];
  issues: string[];
}

/** INP (Interaction to Next Paint) estimate */
export interface InpEstimate {
  estimate: CwvEstimateRating;
  factors: string[];
  issues: string[];
}
