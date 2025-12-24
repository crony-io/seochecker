/**
 * @fileoverview SEO analysis result types and state.
 */

import type { MetaAnalysis } from '@/types/seo/meta';
import type {
  HeadingsAnalysis,
  ImagesAnalysis,
  LinksAnalysis,
  ContentAnalysis,
  KeywordsAnalysis,
  AnchorTextAnalysis,
} from '@/types/seo/content';
import type {
  PerformanceAnalysis,
  TechnicalAnalysis,
  ResourceHintsAnalysis,
  ResourceOptimizationAnalysis,
  MobileAnalysis,
} from '@/types/seo/technical';
import type {
  StructuredDataAnalysis,
  SocialAnalyticsAnalysis,
  SchemaPreview,
} from '@/types/seo/detection';
import type {
  RenderingAnalysis,
  LazyContentAnalysis,
  SocialShareAnalysis,
  AccessibilityAnalysis,
  CoreWebVitalsAnalysis,
} from '@/types/seo/advanced';

/** Complete SEO analysis result */
export interface SeoAnalysisResult {
  url: string;
  analyzedAt: string;
  fetchDuration: number;
  rawHtml: string;
  bodyText: string;
  meta: MetaAnalysis;
  headings: HeadingsAnalysis;
  images: ImagesAnalysis;
  links: LinksAnalysis;
  content: ContentAnalysis;
  keywords: KeywordsAnalysis;
  performance: PerformanceAnalysis;
  technical: TechnicalAnalysis;
  structuredData: StructuredDataAnalysis;
  resourceHints: ResourceHintsAnalysis;
  socialAnalytics: SocialAnalyticsAnalysis;
  anchorText: AnchorTextAnalysis;
  mobile: MobileAnalysis;
  schemaPreviews: SchemaPreview[];
  resourceOptimization: ResourceOptimizationAnalysis;
  rendering: RenderingAnalysis;
  lazyContent: LazyContentAnalysis;
  socialShare: SocialShareAnalysis;
  accessibility: AccessibilityAnalysis;
  coreWebVitals: CoreWebVitalsAnalysis;
  overallScore: number;
}

/** SEO analysis result with parsed Document for reuse (internal use) */
export interface SeoAnalysisResultWithDoc extends SeoAnalysisResult {
  /** Parsed Document object - for internal reuse, not serialized */
  _doc: Document;
}

/** Analysis state */
export type AnalysisState = 'idle' | 'fetching' | 'parsing' | 'analyzing' | 'complete' | 'error';

/** Fetch error info */
export interface FetchError {
  type: 'cors' | 'network' | 'timeout' | 'invalid-url' | 'unknown';
  message: string;
}

/** Score category weights (percentages as decimals, must sum to 1.0) */
export interface ScoreWeights {
  meta: number;
  headings: number;
  images: number;
  links: number;
  content: number;
  keywords: number;
  performance: number;
  technical: number;
}

/** Default score weights */
export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  meta: 0.25,
  headings: 0.1,
  images: 0.08,
  links: 0.07,
  content: 0.15,
  keywords: 0.1,
  performance: 0.1,
  technical: 0.15,
};
