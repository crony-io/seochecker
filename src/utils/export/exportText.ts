/**
 * @fileoverview Text export functionality.
 */

import type { SeoAnalysisResult, KeywordItem, SocialPlatformShare } from '@/types/seo';
import { t } from '@/utils/i18nHelper';

import { downloadBlob, getDomainSlug } from '@/utils/export/helpers';

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
  result.keywords.topKeywords.slice(0, 10).forEach((kw: KeywordItem, index: number) => {
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
  const platforms = result.socialShare.platforms
    .filter((p: SocialPlatformShare) => p.detected)
    .map((p: SocialPlatformShare) => p.platform);
  lines.push(`${f('platforms')}: ${platforms.length > 0 ? platforms.join(', ') : r('none')}`);
  lines.push('');

  lines.push(s('accessibility'));
  lines.push('-'.repeat(30));
  lines.push(`${f('score')}: ${result.accessibility.score}/100`);
  lines.push(
    `${f('errors')}: ${result.accessibility.issues.filter((i: { type: string }) => i.type === 'error').length}`,
  );
  lines.push(
    `${f('warnings')}: ${result.accessibility.issues.filter((i: { type: string }) => i.type === 'warning').length}`,
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
    result.coreWebVitals.recommendations.forEach((rec: string, i: number) => {
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
