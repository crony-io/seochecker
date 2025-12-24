/**
 * @fileoverview PDF export functionality.
 */

import { getScoreColorHex } from '@/constants/seo';
import type { SeoAnalysisResult, SocialPlatformShare, KeywordItem } from '@/types/seo';

import { escapeHtml } from '@/utils/export/helpers';

/**
 * Exports as PDF using browser print dialog.
 */
export function exportAsPdf(result: SeoAnalysisResult): void {
  const html = generatePdfHtml(result);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Generates styled HTML for PDF export.
 */
function generatePdfHtml(result: SeoAnalysisResult): string {
  const scoreColor = getScoreColorHex(result.overallScore);
  const platforms = result.socialShare.platforms
    .filter((p: SocialPlatformShare) => p.detected)
    .map((p: SocialPlatformShare) => p.platform);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SEO Report - ${escapeHtml(result.url)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; line-height: 1.5; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    h2 { font-size: 18px; margin: 24px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
    h3 { font-size: 14px; margin: 16px 0 8px; color: #6b7280; }
    .header { margin-bottom: 32px; }
    .url { color: #6b7280; font-size: 14px; word-break: break-all; }
    .date { color: #9ca3af; font-size: 12px; margin-top: 4px; }
    .score-box { display: inline-block; padding: 16px 24px; border-radius: 8px; background: ${scoreColor}20; margin: 16px 0; }
    .score { font-size: 48px; font-weight: bold; color: ${scoreColor}; }
    .score-label { font-size: 12px; color: #6b7280; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
    .item-label { color: #6b7280; }
    .item-value { font-weight: 500; }
    .status-good { color: #22c55e; }
    .status-warning { color: #f59e0b; }
    .status-error { color: #ef4444; }
    .section { margin-bottom: 24px; page-break-inside: avoid; }
    .tag { display: inline-block; padding: 2px 8px; background: #f3f4f6; border-radius: 4px; font-size: 12px; margin: 2px; }
    @media print { body { padding: 20px; } .score-box { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>SEO Analysis Report</h1>
    <p class="url">${escapeHtml(result.url)}</p>
    <p class="date">Generated: ${new Date(result.analyzedAt).toLocaleString()}</p>
    <div class="score-box">
      <div class="score">${result.overallScore}</div>
      <div class="score-label">Overall Score</div>
    </div>
  </div>

  <div class="section">
    <h2>Meta Tags</h2>
    <div class="item"><span class="item-label">Title</span><span class="item-value">${escapeHtml(String(result.meta.title.value || 'Missing'))}</span></div>
    <div class="item"><span class="item-label">Title Length</span><span class="item-value">${result.meta.title.length} characters</span></div>
    <div class="item"><span class="item-label">Description</span><span class="item-value">${escapeHtml(result.meta.description.value ? String(result.meta.description.value).slice(0, 80) + '...' : 'Missing')}</span></div>
    <div class="item"><span class="item-label">Description Length</span><span class="item-value">${result.meta.description.length} characters</span></div>
    <div class="item"><span class="item-label">Canonical</span><span class="item-value">${escapeHtml(String(result.meta.canonical.value || 'Not set'))}</span></div>
  </div>

  <div class="section">
    <h2>Content Analysis</h2>
    <div class="grid">
      <div class="item"><span class="item-label">Word Count</span><span class="item-value">${result.content.wordCount}</span></div>
      <div class="item"><span class="item-label">Reading Time</span><span class="item-value">${result.content.readingTimeMinutes} min</span></div>
      <div class="item"><span class="item-label">Text/HTML Ratio</span><span class="item-value">${result.content.textToHtmlRatio}%</span></div>
      <div class="item"><span class="item-label">Paragraphs</span><span class="item-value">${result.content.paragraphCount}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Headings</h2>
    <div class="grid">
      <div class="item"><span class="item-label">H1 Count</span><span class="item-value">${result.headings.h1Count}</span></div>
      <div class="item"><span class="item-label">Total Headings</span><span class="item-value">${result.headings.items.length}</span></div>
      <div class="item"><span class="item-label">Proper Hierarchy</span><span class="item-value">${result.headings.hasProperHierarchy ? 'Yes' : 'No'}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Images</h2>
    <div class="grid">
      <div class="item"><span class="item-label">Total Images</span><span class="item-value">${result.images.total}</span></div>
      <div class="item"><span class="item-label">Missing Alt</span><span class="item-value ${result.images.withoutAlt > 0 ? 'status-error' : ''}">${result.images.withoutAlt}</span></div>
      <div class="item"><span class="item-label">Lazy Loading</span><span class="item-value">${result.images.withLazyLoading}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Links</h2>
    <div class="grid">
      <div class="item"><span class="item-label">Total Links</span><span class="item-value">${result.links.total}</span></div>
      <div class="item"><span class="item-label">Internal</span><span class="item-value">${result.links.internal}</span></div>
      <div class="item"><span class="item-label">External</span><span class="item-value">${result.links.external}</span></div>
      <div class="item"><span class="item-label">Nofollow</span><span class="item-value">${result.links.nofollow}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Technical</h2>
    <div class="grid">
      <div class="item"><span class="item-label">HTTPS</span><span class="item-value ${result.technical.isHttps ? 'status-good' : 'status-error'}">${result.technical.isHttps ? 'Yes' : 'No'}</span></div>
      <div class="item"><span class="item-label">Doctype</span><span class="item-value">${result.technical.hasDoctype ? 'Yes' : 'No'}</span></div>
      <div class="item"><span class="item-label">Viewport</span><span class="item-value">${result.technical.hasViewport ? 'Yes' : 'No'}</span></div>
      <div class="item"><span class="item-label">Charset</span><span class="item-value">${result.technical.hasCharset ? 'Yes' : 'No'}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Performance</h2>
    <div class="grid">
      <div class="item"><span class="item-label">HTML Size</span><span class="item-value">${(result.performance.htmlSize / 1024).toFixed(1)} KB</span></div>
      <div class="item"><span class="item-label">DOM Elements</span><span class="item-value">${result.performance.domElements}</span></div>
      <div class="item"><span class="item-label">DOM Depth</span><span class="item-value">${result.performance.domDepth}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Resource Optimization</h2>
    <div class="grid">
      <div class="item"><span class="item-label">Scripts Minified</span><span class="item-value">${result.resourceOptimization.minifiedScripts}/${result.resourceOptimization.totalScripts}</span></div>
      <div class="item"><span class="item-label">Stylesheets Minified</span><span class="item-value">${result.resourceOptimization.minifiedStylesheets}/${result.resourceOptimization.totalStylesheets}</span></div>
      <div class="item"><span class="item-label">Print Styles</span><span class="item-value">${result.resourceOptimization.hasPrintStyles ? 'Yes' : 'No'}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Rendering</h2>
    <div class="grid">
      <div class="item"><span class="item-label">Type</span><span class="item-value">${result.rendering.renderingType.toUpperCase()}</span></div>
      <div class="item"><span class="item-label">Confidence</span><span class="item-value">${result.rendering.confidence}%</span></div>
      <div class="item"><span class="item-label">Noscript Fallback</span><span class="item-value">${result.rendering.hasNoscriptFallback ? 'Yes' : 'No'}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Accessibility</h2>
    <div class="grid">
      <div class="item"><span class="item-label">Score</span><span class="item-value">${result.accessibility.score}/100</span></div>
      <div class="item"><span class="item-label">Errors</span><span class="item-value ${result.accessibility.issues.filter((i: { type: string }) => i.type === 'error').length > 0 ? 'status-error' : ''}">${result.accessibility.issues.filter((i: { type: string }) => i.type === 'error').length}</span></div>
      <div class="item"><span class="item-label">Warnings</span><span class="item-value">${result.accessibility.issues.filter((i: { type: string }) => i.type === 'warning').length}</span></div>
    </div>
    <h3>Landmarks</h3>
    <div class="grid">
      <div class="item"><span class="item-label">Main</span><span class="item-value">${result.accessibility.landmarks.hasMain ? '✓' : '✗'}</span></div>
      <div class="item"><span class="item-label">Nav</span><span class="item-value">${result.accessibility.landmarks.hasNav ? '✓' : '✗'}</span></div>
      <div class="item"><span class="item-label">Header</span><span class="item-value">${result.accessibility.landmarks.hasHeader ? '✓' : '✗'}</span></div>
      <div class="item"><span class="item-label">Footer</span><span class="item-value">${result.accessibility.landmarks.hasFooter ? '✓' : '✗'}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Core Web Vitals (Estimated)</h2>
    <div class="grid">
      <div class="item"><span class="item-label">LCP</span><span class="item-value status-${result.coreWebVitals.lcp.estimate === 'good' ? 'good' : result.coreWebVitals.lcp.estimate === 'poor' ? 'error' : 'warning'}">${result.coreWebVitals.lcp.estimate}</span></div>
      <div class="item"><span class="item-label">CLS</span><span class="item-value status-${result.coreWebVitals.cls.estimate === 'good' ? 'good' : result.coreWebVitals.cls.estimate === 'poor' ? 'error' : 'warning'}">${result.coreWebVitals.cls.estimate}</span></div>
      <div class="item"><span class="item-label">FID</span><span class="item-value status-${result.coreWebVitals.fid.estimate === 'good' ? 'good' : result.coreWebVitals.fid.estimate === 'poor' ? 'error' : 'warning'}">${result.coreWebVitals.fid.estimate}</span></div>
      <div class="item"><span class="item-label">INP</span><span class="item-value status-${result.coreWebVitals.inp.estimate === 'good' ? 'good' : result.coreWebVitals.inp.estimate === 'poor' ? 'error' : 'warning'}">${result.coreWebVitals.inp.estimate}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Social Share</h2>
    <div class="item"><span class="item-label">Share Buttons</span><span class="item-value">${result.socialShare.hasShareButtons ? 'Yes' : 'No'}</span></div>
    <div class="item"><span class="item-label">Platforms</span><span class="item-value">${platforms.length > 0 ? platforms.join(', ') : 'None detected'}</span></div>
  </div>

  <div class="section">
    <h2>Top Keywords</h2>
    ${result.keywords.topKeywords
      .slice(0, 10)
      .map((kw: KeywordItem) => `<span class="tag">${escapeHtml(kw.word)} (${kw.count}x)</span>`)
      .join('')}
  </div>

  ${
    result.coreWebVitals.recommendations.length > 0
      ? `
  <div class="section">
    <h2>Recommendations</h2>
    <ul style="padding-left: 20px;">
      ${result.coreWebVitals.recommendations.map((rec: string) => `<li style="margin-bottom: 8px;">${escapeHtml(rec)}</li>`).join('')}
    </ul>
  </div>
  `
      : ''
  }

</body>
</html>`;
}
