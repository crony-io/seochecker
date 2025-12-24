/**
 * @fileoverview JSON export functionality.
 */

import type { SeoAnalysisResult } from '@/types/seo';

import { downloadBlob, getDomainSlug } from '@/utils/export/helpers';

/**
 * Exports the analysis result as a JSON file.
 */
export function exportAsJson(result: SeoAnalysisResult): void {
  const data = JSON.stringify(result, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  downloadBlob(blob, `seo-report-${getDomainSlug(result.url)}.json`);
}
