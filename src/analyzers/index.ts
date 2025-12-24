/**
 * @fileoverview SEO analysis orchestrator - main entry point.
 * Re-exports all analyzer modules and provides the main analyzeSeo function.
 */

import type { SeoAnalysisResult } from '@/types/seo';
import {
  analyzeDom,
  checkTechnicalElements,
  extractBodyText,
  extractHeadings,
  extractImages,
  extractJsonLd,
  extractLinks,
  extractMetaTags,
  extractScripts,
  extractStylesheets,
  parseHtml,
} from '@/composables/useHtmlParser';

// Import all analyzers (also re-exported below)
import { analyzeMeta } from '@/analyzers/meta';
import { analyzeHeadings } from '@/analyzers/headings';
import { analyzeImages } from '@/analyzers/images';
import { analyzeLinks } from '@/analyzers/links';
import { analyzeContent } from '@/analyzers/content';
import { analyzeKeywords } from '@/analyzers/keywords';
import { analyzePerformance } from '@/analyzers/performance';
import { analyzeTechnical } from '@/analyzers/technical';
import { analyzeStructuredData, extractSchemaPreviews } from '@/analyzers/structuredData';
import { analyzeResourceHints } from '@/analyzers/resourceHints';
import { analyzeSocialAnalytics } from '@/analyzers/socialAnalytics';
import { analyzeAnchorText } from '@/analyzers/anchorText';
import { analyzeMobile } from '@/analyzers/mobile';
import { calculateOverallScore } from '@/analyzers/scoring';
import { analyzeResourceOptimization } from '@/analyzers/resourceOptimization';
import { analyzeRendering } from '@/analyzers/rendering';
import { analyzeLazyContent } from '@/analyzers/lazyContent';
import { analyzeSocialShare } from '@/analyzers/socialShare';
import { analyzeAccessibility } from '@/analyzers/accessibility/index';
import { analyzeCoreWebVitals } from '@/analyzers/coreWebVitals/index';

// Re-export all analyzers for external use
export {
  analyzeMeta,
  analyzeHeadings,
  analyzeImages,
  analyzeLinks,
  analyzeContent,
  analyzeKeywords,
  analyzePerformance,
  analyzeTechnical,
  analyzeStructuredData,
  extractSchemaPreviews,
  analyzeResourceHints,
  analyzeSocialAnalytics,
  analyzeAnchorText,
  analyzeMobile,
  calculateOverallScore,
  analyzeResourceOptimization,
  analyzeRendering,
  analyzeLazyContent,
  analyzeSocialShare,
  analyzeAccessibility,
  analyzeCoreWebVitals,
};

/**
 * Performs complete SEO analysis on HTML content.
 */
export function analyzeSeo(html: string, url: string, fetchDuration: number): SeoAnalysisResult {
  const doc = parseHtml(html);
  const meta = extractMetaTags(doc);
  const headings = extractHeadings(doc);
  const images = extractImages(doc);
  const links = extractLinks(doc);
  const bodyText = extractBodyText(doc);
  const jsonLdData = extractJsonLd(doc);
  const domData = analyzeDom(doc);
  const scripts = extractScripts(doc);
  const styles = extractStylesheets(doc);
  const technicalChecks = checkTechnicalElements(doc);

  const h1 = headings.find((h) => h.level === 1);

  const metaAnalysis = analyzeMeta(meta, url);
  const headingsAnalysis = analyzeHeadings(headings);
  const imagesAnalysis = analyzeImages(images);
  const linksAnalysis = analyzeLinks(links, url);
  const contentAnalysis = analyzeContent(bodyText, html.length);
  const keywordsAnalysis = analyzeKeywords(
    bodyText,
    meta.title,
    meta.description,
    h1?.text ?? null,
  );
  const performanceAnalysis = analyzePerformance(html.length, domData, scripts, styles);
  const technicalAnalysis = analyzeTechnical(url, meta, technicalChecks);
  const structuredDataAnalysis = analyzeStructuredData(jsonLdData);
  const resourceHintsAnalysis = analyzeResourceHints(doc);
  const socialAnalyticsAnalysis = analyzeSocialAnalytics(doc, html);
  const anchorTextAnalysis = analyzeAnchorText(linksAnalysis.items);
  const mobileAnalysis = analyzeMobile(doc, html);
  const schemaPreviews = extractSchemaPreviews(structuredDataAnalysis.jsonLd);
  const resourceOptimizationAnalysis = analyzeResourceOptimization(doc, html);
  const renderingAnalysis = analyzeRendering(doc, html);
  const lazyContentAnalysis = analyzeLazyContent(doc, html);
  const socialShareAnalysis = analyzeSocialShare(doc, html);
  const accessibilityAnalysis = analyzeAccessibility(doc);
  const coreWebVitalsAnalysis = analyzeCoreWebVitals(doc, html);

  const partialResult = {
    url,
    analyzedAt: new Date().toISOString(),
    fetchDuration,
    rawHtml: html,
    bodyText,
    meta: metaAnalysis,
    headings: headingsAnalysis,
    images: imagesAnalysis,
    links: linksAnalysis,
    content: contentAnalysis,
    keywords: keywordsAnalysis,
    performance: performanceAnalysis,
    technical: technicalAnalysis,
    structuredData: structuredDataAnalysis,
    resourceHints: resourceHintsAnalysis,
    socialAnalytics: socialAnalyticsAnalysis,
    anchorText: anchorTextAnalysis,
    mobile: mobileAnalysis,
    schemaPreviews,
    resourceOptimization: resourceOptimizationAnalysis,
    rendering: renderingAnalysis,
    lazyContent: lazyContentAnalysis,
    socialShare: socialShareAnalysis,
    accessibility: accessibilityAnalysis,
    coreWebVitals: coreWebVitalsAnalysis,
  };

  return {
    ...partialResult,
    overallScore: calculateOverallScore(partialResult),
  };
}
