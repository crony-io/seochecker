/**
 * @fileoverview Core SEO types and base interfaces.
 */

/** Status of an SEO check item */
export type SeoStatus = 'good' | 'warning' | 'error' | 'info';

/** Base interface for all analysis results */
export interface AnalysisItem {
  status: SeoStatus;
  label: string;
  value: string | number | null;
  details?: string;
}
