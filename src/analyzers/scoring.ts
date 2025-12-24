/**
 * @fileoverview Overall SEO score calculation module.
 */

import { DEFAULT_SCORE_WEIGHTS, type SeoAnalysisResult } from '@/types/seo';

/**
 * Calculates the overall SEO score based on all analysis results.
 */
export function calculateOverallScore(analysis: Omit<SeoAnalysisResult, 'overallScore'>): number {
  const scores = {
    meta:
      (analysis.meta.title.status === 'good'
        ? 25
        : analysis.meta.title.status === 'warning'
          ? 15
          : 0) +
      (analysis.meta.description.status === 'good'
        ? 25
        : analysis.meta.description.status === 'warning'
          ? 15
          : 0) +
      (analysis.meta.openGraph.status === 'good' ? 25 : 10) +
      (analysis.meta.canonical.status === 'good' ? 25 : 10),
    headings:
      analysis.headings.status === 'good' ? 100 : analysis.headings.status === 'warning' ? 60 : 20,
    images:
      analysis.images.status === 'good' ? 100 : analysis.images.status === 'warning' ? 60 : 30,
    links: analysis.links.status === 'good' ? 100 : analysis.links.status === 'warning' ? 70 : 40,
    content:
      analysis.content.status === 'good' ? 100 : analysis.content.status === 'warning' ? 60 : 20,
    keywords:
      analysis.keywords.status === 'good' ? 100 : analysis.keywords.status === 'warning' ? 60 : 30,
    performance:
      analysis.performance.status === 'good'
        ? 100
        : analysis.performance.status === 'warning'
          ? 60
          : 30,
    technical:
      analysis.technical.status === 'good'
        ? 100
        : analysis.technical.status === 'warning'
          ? 60
          : 30,
  };

  const weights = DEFAULT_SCORE_WEIGHTS;

  let totalScore = 0;
  Object.entries(scores).forEach(([key, score]) => {
    totalScore += score * weights[key as keyof typeof weights];
  });

  return Math.round(totalScore);
}
