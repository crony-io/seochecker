/**
 * @fileoverview Export utilities for SEO analysis reports.
 */

import { getScoreColorHex } from '@/constants/seo';
import type { SeoAnalysisResult } from '@/types/seo';
import { t } from '@/utils/i18nHelper';

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

  // Shorthand for translation keys
  const r = (key: string) => t(`seo.export.report.${key}`);
  const f = (key: string) => t(`seo.export.report.fields.${key}`);
  const c = (key: string) => t(`seo.export.report.csv.${key}`);
  const yesNo = (val: boolean) => (val ? r('yes') : r('no'));

  // Header
  rows.push([c('category'), c('metric'), c('value'), c('status')]);

  // General info
  rows.push([c('general'), r('url'), result.url, '']);
  rows.push([c('general'), c('analyzedAt'), result.analyzedAt, '']);
  rows.push([c('general'), r('overallScore'), String(result.overallScore), '']);

  // Section names
  const meta = t('seo.meta.title');
  const headings = t('seo.headings.title');
  const content = t('seo.content.title');
  const images = t('seo.images.title');
  const links = t('seo.links.title');
  const technical = t('seo.technical.title');
  const keywords = t('seo.keywords.title');
  const mobile = t('seo.mobile.title');
  const anchorText = t('seo.anchorText.title');
  const resources = t('seo.resourceOptimization.title');
  const rendering = t('seo.rendering.title');
  const lazyContent = t('seo.lazyContent.title');
  const socialShare = t('seo.socialShare.title');
  const accessibility = t('seo.accessibility.title');
  const cwv = t('seo.coreWebVitals.title');

  // Meta
  rows.push([
    meta,
    f('title'),
    String(result.meta.title.value ?? r('missing')),
    result.meta.title.status,
  ]);
  rows.push([meta, f('titleLength'), String(result.meta.title.length), '']);
  rows.push([
    meta,
    f('description'),
    String(result.meta.description.value ?? r('missing')),
    result.meta.description.status,
  ]);
  rows.push([meta, f('descriptionLength'), String(result.meta.description.length), '']);
  rows.push([
    meta,
    f('canonical'),
    String(result.meta.canonical.value ?? r('notSet')),
    result.meta.canonical.status,
  ]);

  // Headings
  rows.push([headings, f('h1Count'), String(result.headings.h1Count), result.headings.status]);
  rows.push([headings, f('totalHeadings'), String(result.headings.items.length), '']);
  rows.push([headings, f('properHierarchy'), yesNo(result.headings.hasProperHierarchy), '']);

  // Content
  rows.push([content, f('wordCount'), String(result.content.wordCount), result.content.status]);
  rows.push([content, f('readingTime'), String(result.content.readingTimeMinutes), '']);
  rows.push([content, f('textHtmlRatio'), `${result.content.textToHtmlRatio}%`, '']);

  // Images
  rows.push([images, f('total'), String(result.images.total), result.images.status]);
  rows.push([images, f('missingAlt'), String(result.images.withoutAlt), '']);
  rows.push([images, f('lazyLoading'), String(result.images.withLazyLoading), '']);

  // Links
  rows.push([links, f('total'), String(result.links.total), result.links.status]);
  rows.push([links, f('internal'), String(result.links.internal), '']);
  rows.push([links, f('external'), String(result.links.external), '']);
  rows.push([links, f('nofollow'), String(result.links.nofollow), '']);

  // Technical
  rows.push([technical, f('https'), yesNo(result.technical.isHttps), result.technical.status]);
  rows.push([technical, f('doctype'), yesNo(result.technical.hasDoctype), '']);
  rows.push([technical, f('charset'), yesNo(result.technical.hasCharset), '']);
  rows.push([technical, f('viewport'), yesNo(result.technical.hasViewport), '']);

  // Performance
  rows.push([
    t('seo.performance.title'),
    f('htmlSize'),
    String(result.performance.htmlSize),
    result.performance.status,
  ]);
  rows.push([
    t('seo.performance.title'),
    f('domElements'),
    String(result.performance.domElements),
    '',
  ]);
  rows.push([t('seo.performance.title'), f('domDepth'), String(result.performance.domDepth), '']);

  // Keywords
  rows.push([
    keywords,
    t('seo.keywords.totalWords'),
    String(result.keywords.totalWords),
    result.keywords.status,
  ]);
  rows.push([keywords, t('seo.keywords.uniqueWords'), String(result.keywords.uniqueWords), '']);

  // Top keywords
  result.keywords.topKeywords.slice(0, 10).forEach((kw, index) => {
    rows.push([keywords, `Top ${index + 1}`, `${kw.word} (${kw.count}x, ${kw.density}%)`, '']);
  });

  // Mobile
  rows.push([mobile, f('viewport'), yesNo(result.mobile.hasViewport), result.mobile.status]);
  rows.push([mobile, f('responsiveImages'), yesNo(result.mobile.hasResponsiveImages), '']);
  rows.push([mobile, f('mediaQueries'), yesNo(result.mobile.mediaQueries), '']);

  // Anchor Text
  rows.push([anchorText, f('total'), String(result.anchorText.total), result.anchorText.status]);
  rows.push([anchorText, f('descriptive'), String(result.anchorText.descriptive), '']);
  rows.push([anchorText, f('generic'), String(result.anchorText.generic), '']);

  // Resource Optimization
  rows.push([
    resources,
    f('scriptsMinified'),
    `${result.resourceOptimization.minifiedScripts}/${result.resourceOptimization.totalScripts}`,
    result.resourceOptimization.status,
  ]);
  rows.push([
    resources,
    f('stylesheetsMinified'),
    `${result.resourceOptimization.minifiedStylesheets}/${result.resourceOptimization.totalStylesheets}`,
    '',
  ]);
  rows.push([resources, f('printStyles'), yesNo(result.resourceOptimization.hasPrintStyles), '']);

  // Rendering
  rows.push([rendering, f('type'), result.rendering.renderingType, result.rendering.status]);
  rows.push([rendering, f('confidence'), `${result.rendering.confidence}%`, '']);
  rows.push([rendering, f('noscriptFallback'), yesNo(result.rendering.hasNoscriptFallback), '']);

  // Lazy Content
  rows.push([
    lazyContent,
    f('infiniteScroll'),
    yesNo(result.lazyContent.hasInfiniteScroll),
    result.lazyContent.status,
  ]);
  rows.push([lazyContent, f('lazyImages'), String(result.lazyContent.lazyImageCount), '']);
  rows.push([lazyContent, f('pagination'), yesNo(result.lazyContent.hasPagination), '']);

  // Social Share
  rows.push([
    socialShare,
    f('shareButtons'),
    yesNo(result.socialShare.hasShareButtons),
    result.socialShare.status,
  ]);
  const detectedPlatforms = result.socialShare.platforms
    .filter((p) => p.detected)
    .map((p) => p.platform)
    .join(', ');
  rows.push([socialShare, f('platforms'), detectedPlatforms || r('none'), '']);

  // Accessibility
  rows.push([
    accessibility,
    f('score'),
    String(result.accessibility.score),
    result.accessibility.status,
  ]);
  rows.push([
    accessibility,
    f('errors'),
    String(result.accessibility.issues.filter((i) => i.type === 'error').length),
    '',
  ]);
  rows.push([
    accessibility,
    f('warnings'),
    String(result.accessibility.issues.filter((i) => i.type === 'warning').length),
    '',
  ]);

  // Core Web Vitals
  rows.push([cwv, f('lcp'), result.coreWebVitals.lcp.estimate, result.coreWebVitals.overallStatus]);
  rows.push([cwv, f('cls'), result.coreWebVitals.cls.estimate, '']);
  rows.push([cwv, f('fid'), result.coreWebVitals.fid.estimate, '']);
  rows.push([cwv, f('inp'), result.coreWebVitals.inp.estimate, '']);

  const csvContent = rows.map((row) => row.map(escapeCSV).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `seo-report-${getDomainSlug(result.url)}.csv`);
}

/**
 * Generates a plain text report for PDF generation.
 */
export function generateTextReport(result: SeoAnalysisResult): string {
  const lines: string[] = [];

  // Shorthand helpers
  const r = (key: string) => t(`seo.export.report.${key}`);
  const f = (key: string) => t(`seo.export.report.fields.${key}`);
  const s = (key: string) => t(`seo.export.report.sections.${key}`);
  const yesNo = (val: boolean) => (val ? r('yes') : r('no'));

  lines.push(r('title'));
  lines.push('='.repeat(50));
  lines.push('');
  lines.push(`${r('url')}: ${result.url}`);
  lines.push(`${r('analyzed')}: ${new Date(result.analyzedAt).toLocaleString()}`);
  lines.push(`${r('overallScore')}: ${result.overallScore}/100`);
  lines.push('');

  lines.push(s('metaTags'));
  lines.push('-'.repeat(30));
  lines.push(
    `${f('title')}: ${result.meta.title.value ?? r('missing')} (${result.meta.title.length} ${r('chars')})`,
  );
  lines.push(
    `${f('description')}: ${result.meta.description.value ?? r('missing')} (${result.meta.description.length} ${r('chars')})`,
  );
  lines.push(`${f('canonical')}: ${result.meta.canonical.value ?? r('notSet')}`);
  lines.push('');

  lines.push(s('headings'));
  lines.push('-'.repeat(30));
  lines.push(`${f('h1Count')}: ${result.headings.h1Count}`);
  lines.push(`${f('totalHeadings')}: ${result.headings.items.length}`);
  lines.push(`${f('properHierarchy')}: ${yesNo(result.headings.hasProperHierarchy)}`);
  lines.push('');

  lines.push(s('content'));
  lines.push('-'.repeat(30));
  lines.push(`${f('wordCount')}: ${result.content.wordCount}`);
  lines.push(`${f('readingTime')}: ${result.content.readingTimeMinutes} min`);
  lines.push(`${f('textHtmlRatio')}: ${result.content.textToHtmlRatio}%`);
  lines.push('');

  lines.push(s('images'));
  lines.push('-'.repeat(30));
  lines.push(`${f('total')}: ${result.images.total}`);
  lines.push(`${f('missingAlt')}: ${result.images.withoutAlt}`);
  lines.push(`${f('lazyLoading')}: ${result.images.withLazyLoading}`);
  lines.push('');

  lines.push(s('links'));
  lines.push('-'.repeat(30));
  lines.push(`${f('total')}: ${result.links.total}`);
  lines.push(`${f('internal')}: ${result.links.internal}`);
  lines.push(`${f('external')}: ${result.links.external}`);
  lines.push('');

  lines.push(s('technical'));
  lines.push('-'.repeat(30));
  lines.push(`${f('https')}: ${yesNo(result.technical.isHttps)}`);
  lines.push(`${f('doctype')}: ${yesNo(result.technical.hasDoctype)}`);
  lines.push(`${f('viewport')}: ${yesNo(result.technical.hasViewport)}`);
  lines.push('');

  lines.push(s('topKeywords'));
  lines.push('-'.repeat(30));
  result.keywords.topKeywords.slice(0, 10).forEach((kw, index) => {
    lines.push(`${index + 1}. ${kw.word} - ${kw.count}x (${kw.density}%)`);
  });
  lines.push('');

  lines.push(s('mobile'));
  lines.push('-'.repeat(30));
  lines.push(`${f('viewport')}: ${yesNo(result.mobile.hasViewport)}`);
  lines.push(`${f('responsiveImages')}: ${yesNo(result.mobile.hasResponsiveImages)}`);
  lines.push(`${f('mediaQueries')}: ${yesNo(result.mobile.mediaQueries)}`);
  lines.push('');

  lines.push(s('anchorText'));
  lines.push('-'.repeat(30));
  lines.push(`${f('total')}: ${result.anchorText.total}`);
  lines.push(`${f('descriptive')}: ${result.anchorText.descriptive}`);
  lines.push(`${f('generic')}: ${result.anchorText.generic}`);
  lines.push('');

  lines.push(s('resourceOptimization'));
  lines.push('-'.repeat(30));
  lines.push(
    `${f('scriptsMinified')}: ${result.resourceOptimization.minifiedScripts}/${result.resourceOptimization.totalScripts}`,
  );
  lines.push(
    `${f('stylesheetsMinified')}: ${result.resourceOptimization.minifiedStylesheets}/${result.resourceOptimization.totalStylesheets}`,
  );
  lines.push(`${f('printStyles')}: ${yesNo(result.resourceOptimization.hasPrintStyles)}`);
  lines.push('');

  lines.push(s('rendering'));
  lines.push('-'.repeat(30));
  lines.push(`${f('type')}: ${result.rendering.renderingType}`);
  lines.push(`${f('confidence')}: ${result.rendering.confidence}%`);
  lines.push(`${f('noscriptFallback')}: ${yesNo(result.rendering.hasNoscriptFallback)}`);
  lines.push('');

  lines.push(s('lazyContent'));
  lines.push('-'.repeat(30));
  lines.push(`${f('infiniteScroll')}: ${yesNo(result.lazyContent.hasInfiniteScroll)}`);
  lines.push(`${f('lazyImages')}: ${result.lazyContent.lazyImageCount}`);
  lines.push(`${f('pagination')}: ${yesNo(result.lazyContent.hasPagination)}`);
  lines.push('');

  lines.push(s('socialShare'));
  lines.push('-'.repeat(30));
  lines.push(`${f('shareButtons')}: ${yesNo(result.socialShare.hasShareButtons)}`);
  const platforms = result.socialShare.platforms.filter((p) => p.detected).map((p) => p.platform);
  lines.push(`${f('platforms')}: ${platforms.length > 0 ? platforms.join(', ') : r('none')}`);
  lines.push('');

  lines.push(s('accessibility'));
  lines.push('-'.repeat(30));
  lines.push(`${f('score')}: ${result.accessibility.score}/100`);
  lines.push(
    `${f('errors')}: ${result.accessibility.issues.filter((i) => i.type === 'error').length}`,
  );
  lines.push(
    `${f('warnings')}: ${result.accessibility.issues.filter((i) => i.type === 'warning').length}`,
  );
  lines.push(`${f('hasMainLandmark')}: ${yesNo(result.accessibility.landmarks.hasMain)}`);
  lines.push('');

  lines.push(s('coreWebVitals'));
  lines.push('-'.repeat(30));
  lines.push(`${f('lcp')}: ${result.coreWebVitals.lcp.estimate}`);
  lines.push(`${f('cls')}: ${result.coreWebVitals.cls.estimate}`);
  lines.push(`${f('fid')}: ${result.coreWebVitals.fid.estimate}`);
  lines.push(`${f('inp')}: ${result.coreWebVitals.inp.estimate}`);
  lines.push('');

  if (result.coreWebVitals.recommendations.length > 0) {
    lines.push(s('recommendations'));
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
  const scoreColor = getScoreColorHex(result.overallScore);
  const platforms = result.socialShare.platforms.filter((p) => p.detected).map((p) => p.platform);

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
      .map((kw) => `<span class="tag">${escapeHtml(kw.word)} (${kw.count}x)</span>`)
      .join('')}
  </div>

  ${
    result.coreWebVitals.recommendations.length > 0
      ? `
  <div class="section">
    <h2>Recommendations</h2>
    <ul style="padding-left: 20px;">
      ${result.coreWebVitals.recommendations.map((rec) => `<li style="margin-bottom: 8px;">${escapeHtml(rec)}</li>`).join('')}
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
 * Escapes HTML entities to prevent XSS.
 */
function escapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEntities[char] ?? char);
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
