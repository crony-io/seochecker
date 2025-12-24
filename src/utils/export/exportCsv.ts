/**
 * @fileoverview CSV export functionality.
 */

import type { SeoAnalysisResult, KeywordItem, SocialPlatformShare } from '@/types/seo';
import { t } from '@/utils/i18nHelper';

import { downloadBlob, getDomainSlug, escapeCSV } from '@/utils/export/helpers';

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
  result.keywords.topKeywords.slice(0, 10).forEach((kw: KeywordItem, index: number) => {
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
    .filter((p: SocialPlatformShare) => p.detected)
    .map((p: SocialPlatformShare) => p.platform)
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
    String(result.accessibility.issues.filter((i: { type: string }) => i.type === 'error').length),
    '',
  ]);
  rows.push([
    accessibility,
    f('warnings'),
    String(
      result.accessibility.issues.filter((i: { type: string }) => i.type === 'warning').length,
    ),
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
