/**
 * @fileoverview Export utilities for SEO analysis reports.
 */

import type { SeoAnalysisResult } from '@/types/seo';

/**
 * Exports the analysis result as a JSON file.
 */
export function exportAsJson(result: SeoAnalysisResult): void {
  const data = JSON.stringify(result, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  downloadBlob(blob, `seo-report-${getDomainSlug(result.url)}.json`);
}

/**
 * Exports the analysis result as a CSV file.
 */
export function exportAsCsv(result: SeoAnalysisResult): void {
  const rows: string[][] = [];

  // Header
  rows.push(['Category', 'Metric', 'Value', 'Status']);

  // General info
  rows.push(['General', 'URL', result.url, '']);
  rows.push(['General', 'Analyzed At', result.analyzedAt, '']);
  rows.push(['General', 'Overall Score', String(result.overallScore), '']);

  // Meta
  rows.push([
    'Meta',
    'Title',
    String(result.meta.title.value ?? 'Missing'),
    result.meta.title.status,
  ]);
  rows.push(['Meta', 'Title Length', String(result.meta.title.length), '']);
  rows.push([
    'Meta',
    'Description',
    String(result.meta.description.value ?? 'Missing'),
    result.meta.description.status,
  ]);
  rows.push(['Meta', 'Description Length', String(result.meta.description.length), '']);
  rows.push([
    'Meta',
    'Canonical',
    String(result.meta.canonical.value ?? 'Not set'),
    result.meta.canonical.status,
  ]);

  // Headings
  rows.push(['Headings', 'H1 Count', String(result.headings.h1Count), result.headings.status]);
  rows.push(['Headings', 'Total Headings', String(result.headings.items.length), '']);
  rows.push([
    'Headings',
    'Proper Hierarchy',
    result.headings.hasProperHierarchy ? 'Yes' : 'No',
    '',
  ]);

  // Content
  rows.push(['Content', 'Word Count', String(result.content.wordCount), result.content.status]);
  rows.push(['Content', 'Reading Time (min)', String(result.content.readingTimeMinutes), '']);
  rows.push(['Content', 'Text/HTML Ratio', `${result.content.textToHtmlRatio}%`, '']);

  // Images
  rows.push(['Images', 'Total Images', String(result.images.total), result.images.status]);
  rows.push(['Images', 'Missing Alt', String(result.images.withoutAlt), '']);
  rows.push(['Images', 'With Lazy Loading', String(result.images.withLazyLoading), '']);

  // Links
  rows.push(['Links', 'Total Links', String(result.links.total), result.links.status]);
  rows.push(['Links', 'Internal', String(result.links.internal), '']);
  rows.push(['Links', 'External', String(result.links.external), '']);
  rows.push(['Links', 'Nofollow', String(result.links.nofollow), '']);

  // Technical
  rows.push([
    'Technical',
    'HTTPS',
    result.technical.isHttps ? 'Yes' : 'No',
    result.technical.status,
  ]);
  rows.push(['Technical', 'Has Doctype', result.technical.hasDoctype ? 'Yes' : 'No', '']);
  rows.push(['Technical', 'Has Charset', result.technical.hasCharset ? 'Yes' : 'No', '']);
  rows.push(['Technical', 'Has Viewport', result.technical.hasViewport ? 'Yes' : 'No', '']);

  // Performance
  rows.push([
    'Performance',
    'HTML Size (bytes)',
    String(result.performance.htmlSize),
    result.performance.status,
  ]);
  rows.push(['Performance', 'DOM Elements', String(result.performance.domElements), '']);
  rows.push(['Performance', 'DOM Depth', String(result.performance.domDepth), '']);

  // Keywords
  rows.push([
    'Keywords',
    'Total Words',
    String(result.keywords.totalWords),
    result.keywords.status,
  ]);
  rows.push(['Keywords', 'Unique Words', String(result.keywords.uniqueWords), '']);

  // Top keywords
  result.keywords.topKeywords.slice(0, 10).forEach((kw, index) => {
    rows.push(['Keywords', `Top ${index + 1}`, `${kw.word} (${kw.count}x, ${kw.density}%)`, '']);
  });

  // Mobile
  rows.push([
    'Mobile',
    'Has Viewport',
    result.mobile.hasViewport ? 'Yes' : 'No',
    result.mobile.status,
  ]);
  rows.push(['Mobile', 'Responsive Images', result.mobile.hasResponsiveImages ? 'Yes' : 'No', '']);
  rows.push(['Mobile', 'Media Queries', result.mobile.mediaQueries ? 'Yes' : 'No', '']);

  // Anchor Text
  rows.push(['Anchor Text', 'Total', String(result.anchorText.total), result.anchorText.status]);
  rows.push(['Anchor Text', 'Descriptive', String(result.anchorText.descriptive), '']);
  rows.push(['Anchor Text', 'Generic', String(result.anchorText.generic), '']);

  // Resource Optimization
  rows.push([
    'Resources',
    'Scripts Minified',
    `${result.resourceOptimization.minifiedScripts}/${result.resourceOptimization.totalScripts}`,
    result.resourceOptimization.status,
  ]);
  rows.push([
    'Resources',
    'Stylesheets Minified',
    `${result.resourceOptimization.minifiedStylesheets}/${result.resourceOptimization.totalStylesheets}`,
    '',
  ]);
  rows.push([
    'Resources',
    'Has Print Styles',
    result.resourceOptimization.hasPrintStyles ? 'Yes' : 'No',
    '',
  ]);

  // Rendering
  rows.push(['Rendering', 'Type', result.rendering.renderingType, result.rendering.status]);
  rows.push(['Rendering', 'Confidence', `${result.rendering.confidence}%`, '']);
  rows.push([
    'Rendering',
    'Noscript Fallback',
    result.rendering.hasNoscriptFallback ? 'Yes' : 'No',
    '',
  ]);

  // Lazy Content
  rows.push([
    'Lazy Content',
    'Infinite Scroll',
    result.lazyContent.hasInfiniteScroll ? 'Yes' : 'No',
    result.lazyContent.status,
  ]);
  rows.push(['Lazy Content', 'Lazy Images', String(result.lazyContent.lazyImageCount), '']);
  rows.push([
    'Lazy Content',
    'Has Pagination',
    result.lazyContent.hasPagination ? 'Yes' : 'No',
    '',
  ]);

  // Social Share
  rows.push([
    'Social Share',
    'Has Share Buttons',
    result.socialShare.hasShareButtons ? 'Yes' : 'No',
    result.socialShare.status,
  ]);
  const detectedPlatforms = result.socialShare.platforms
    .filter((p) => p.detected)
    .map((p) => p.platform)
    .join(', ');
  rows.push(['Social Share', 'Platforms', detectedPlatforms || 'None', '']);

  // Accessibility
  rows.push([
    'Accessibility',
    'Score',
    String(result.accessibility.score),
    result.accessibility.status,
  ]);
  rows.push([
    'Accessibility',
    'Errors',
    String(result.accessibility.issues.filter((i) => i.type === 'error').length),
    '',
  ]);
  rows.push([
    'Accessibility',
    'Warnings',
    String(result.accessibility.issues.filter((i) => i.type === 'warning').length),
    '',
  ]);

  // Core Web Vitals
  rows.push([
    'Core Web Vitals',
    'LCP Estimate',
    result.coreWebVitals.lcp.estimate,
    result.coreWebVitals.overallStatus,
  ]);
  rows.push(['Core Web Vitals', 'CLS Estimate', result.coreWebVitals.cls.estimate, '']);
  rows.push(['Core Web Vitals', 'FID Estimate', result.coreWebVitals.fid.estimate, '']);
  rows.push(['Core Web Vitals', 'INP Estimate', result.coreWebVitals.inp.estimate, '']);

  const csvContent = rows.map((row) => row.map(escapeCSV).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `seo-report-${getDomainSlug(result.url)}.csv`);
}

/**
 * Generates a plain text report for PDF generation.
 */
export function generateTextReport(result: SeoAnalysisResult): string {
  const lines: string[] = [];

  lines.push('SEO ANALYSIS REPORT');
  lines.push('='.repeat(50));
  lines.push('');
  lines.push(`URL: ${result.url}`);
  lines.push(`Analyzed: ${new Date(result.analyzedAt).toLocaleString()}`);
  lines.push(`Overall Score: ${result.overallScore}/100`);
  lines.push('');

  lines.push('META TAGS');
  lines.push('-'.repeat(30));
  lines.push(`Title: ${result.meta.title.value ?? 'Missing'} (${result.meta.title.length} chars)`);
  lines.push(
    `Description: ${result.meta.description.value ?? 'Missing'} (${result.meta.description.length} chars)`,
  );
  lines.push(`Canonical: ${result.meta.canonical.value ?? 'Not set'}`);
  lines.push('');

  lines.push('HEADINGS');
  lines.push('-'.repeat(30));
  lines.push(`H1 Count: ${result.headings.h1Count}`);
  lines.push(`Total Headings: ${result.headings.items.length}`);
  lines.push(`Proper Hierarchy: ${result.headings.hasProperHierarchy ? 'Yes' : 'No'}`);
  lines.push('');

  lines.push('CONTENT');
  lines.push('-'.repeat(30));
  lines.push(`Word Count: ${result.content.wordCount}`);
  lines.push(`Reading Time: ${result.content.readingTimeMinutes} min`);
  lines.push(`Text/HTML Ratio: ${result.content.textToHtmlRatio}%`);
  lines.push('');

  lines.push('IMAGES');
  lines.push('-'.repeat(30));
  lines.push(`Total: ${result.images.total}`);
  lines.push(`Missing Alt: ${result.images.withoutAlt}`);
  lines.push(`Lazy Loading: ${result.images.withLazyLoading}`);
  lines.push('');

  lines.push('LINKS');
  lines.push('-'.repeat(30));
  lines.push(`Total: ${result.links.total}`);
  lines.push(`Internal: ${result.links.internal}`);
  lines.push(`External: ${result.links.external}`);
  lines.push('');

  lines.push('TECHNICAL');
  lines.push('-'.repeat(30));
  lines.push(`HTTPS: ${result.technical.isHttps ? 'Yes' : 'No'}`);
  lines.push(`Doctype: ${result.technical.hasDoctype ? 'Yes' : 'No'}`);
  lines.push(`Viewport: ${result.technical.hasViewport ? 'Yes' : 'No'}`);
  lines.push('');

  lines.push('TOP KEYWORDS');
  lines.push('-'.repeat(30));
  result.keywords.topKeywords.slice(0, 10).forEach((kw, index) => {
    lines.push(`${index + 1}. ${kw.word} - ${kw.count}x (${kw.density}%)`);
  });
  lines.push('');

  lines.push('MOBILE');
  lines.push('-'.repeat(30));
  lines.push(`Viewport: ${result.mobile.hasViewport ? 'Yes' : 'No'}`);
  lines.push(`Responsive Images: ${result.mobile.hasResponsiveImages ? 'Yes' : 'No'}`);
  lines.push(`Media Queries: ${result.mobile.mediaQueries ? 'Yes' : 'No'}`);
  lines.push('');

  lines.push('ANCHOR TEXT');
  lines.push('-'.repeat(30));
  lines.push(`Total: ${result.anchorText.total}`);
  lines.push(`Descriptive: ${result.anchorText.descriptive}`);
  lines.push(`Generic: ${result.anchorText.generic}`);
  lines.push('');

  lines.push('RESOURCE OPTIMIZATION');
  lines.push('-'.repeat(30));
  lines.push(
    `Scripts Minified: ${result.resourceOptimization.minifiedScripts}/${result.resourceOptimization.totalScripts}`,
  );
  lines.push(
    `Stylesheets Minified: ${result.resourceOptimization.minifiedStylesheets}/${result.resourceOptimization.totalStylesheets}`,
  );
  lines.push(`Print Styles: ${result.resourceOptimization.hasPrintStyles ? 'Yes' : 'No'}`);
  lines.push('');

  lines.push('RENDERING');
  lines.push('-'.repeat(30));
  lines.push(`Type: ${result.rendering.renderingType}`);
  lines.push(`Confidence: ${result.rendering.confidence}%`);
  lines.push(`Noscript Fallback: ${result.rendering.hasNoscriptFallback ? 'Yes' : 'No'}`);
  lines.push('');

  lines.push('LAZY CONTENT');
  lines.push('-'.repeat(30));
  lines.push(`Infinite Scroll: ${result.lazyContent.hasInfiniteScroll ? 'Yes' : 'No'}`);
  lines.push(`Lazy Images: ${result.lazyContent.lazyImageCount}`);
  lines.push(`Pagination: ${result.lazyContent.hasPagination ? 'Yes' : 'No'}`);
  lines.push('');

  lines.push('SOCIAL SHARE');
  lines.push('-'.repeat(30));
  lines.push(`Share Buttons: ${result.socialShare.hasShareButtons ? 'Yes' : 'No'}`);
  const platforms = result.socialShare.platforms.filter((p) => p.detected).map((p) => p.platform);
  lines.push(`Platforms: ${platforms.length > 0 ? platforms.join(', ') : 'None'}`);
  lines.push('');

  lines.push('ACCESSIBILITY');
  lines.push('-'.repeat(30));
  lines.push(`Score: ${result.accessibility.score}/100`);
  lines.push(`Errors: ${result.accessibility.issues.filter((i) => i.type === 'error').length}`);
  lines.push(`Warnings: ${result.accessibility.issues.filter((i) => i.type === 'warning').length}`);
  lines.push(`Has Main Landmark: ${result.accessibility.landmarks.hasMain ? 'Yes' : 'No'}`);
  lines.push('');

  lines.push('CORE WEB VITALS (Estimated)');
  lines.push('-'.repeat(30));
  lines.push(`LCP: ${result.coreWebVitals.lcp.estimate}`);
  lines.push(`CLS: ${result.coreWebVitals.cls.estimate}`);
  lines.push(`FID: ${result.coreWebVitals.fid.estimate}`);
  lines.push(`INP: ${result.coreWebVitals.inp.estimate}`);
  lines.push('');

  if (result.coreWebVitals.recommendations.length > 0) {
    lines.push('RECOMMENDATIONS');
    lines.push('-'.repeat(30));
    result.coreWebVitals.recommendations.forEach((rec, i) => {
      lines.push(`${i + 1}. ${rec}`);
    });
  }

  return lines.join('\n');
}

/**
 * Exports as a simple text file.
 */
export function exportAsText(result: SeoAnalysisResult): void {
  const text = generateTextReport(result);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
  downloadBlob(blob, `seo-report-${getDomainSlug(result.url)}.txt`);
}

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
  const scoreColor =
    result.overallScore >= 80 ? '#22c55e' : result.overallScore >= 50 ? '#f59e0b' : '#ef4444';
  const platforms = result.socialShare.platforms.filter((p) => p.detected).map((p) => p.platform);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SEO Report - ${result.url}</title>
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
    <p class="url">${result.url}</p>
    <p class="date">Generated: ${new Date(result.analyzedAt).toLocaleString()}</p>
    <div class="score-box">
      <div class="score">${result.overallScore}</div>
      <div class="score-label">Overall Score</div>
    </div>
  </div>

  <div class="section">
    <h2>Meta Tags</h2>
    <div class="item"><span class="item-label">Title</span><span class="item-value">${result.meta.title.value || 'Missing'}</span></div>
    <div class="item"><span class="item-label">Title Length</span><span class="item-value">${result.meta.title.length} characters</span></div>
    <div class="item"><span class="item-label">Description</span><span class="item-value">${result.meta.description.value ? String(result.meta.description.value).slice(0, 80) + '...' : 'Missing'}</span></div>
    <div class="item"><span class="item-label">Description Length</span><span class="item-value">${result.meta.description.length} characters</span></div>
    <div class="item"><span class="item-label">Canonical</span><span class="item-value">${result.meta.canonical.value || 'Not set'}</span></div>
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
      <div class="item"><span class="item-label">Errors</span><span class="item-value ${result.accessibility.issues.filter((i) => i.type === 'error').length > 0 ? 'status-error' : ''}">${result.accessibility.issues.filter((i) => i.type === 'error').length}</span></div>
      <div class="item"><span class="item-label">Warnings</span><span class="item-value">${result.accessibility.issues.filter((i) => i.type === 'warning').length}</span></div>
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
      .map((kw) => `<span class="tag">${kw.word} (${kw.count}x)</span>`)
      .join('')}
  </div>

  ${
    result.coreWebVitals.recommendations.length > 0
      ? `
  <div class="section">
    <h2>Recommendations</h2>
    <ul style="padding-left: 20px;">
      ${result.coreWebVitals.recommendations.map((rec) => `<li style="margin-bottom: 8px;">${rec}</li>`).join('')}
    </ul>
  </div>
  `
      : ''
  }

</body>
</html>`;
}

/**
 * Helper to download a blob.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Extracts domain slug from URL for filename.
 */
function getDomainSlug(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/\./g, '-');
  } catch {
    return 'unknown';
  }
}

/**
 * Escapes a value for CSV.
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
