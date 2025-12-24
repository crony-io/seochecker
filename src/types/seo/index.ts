/**
 * @fileoverview SEO types barrel export.
 * Re-exports all SEO-related types from domain-specific modules.
 */

// Base types
export type { SeoStatus, AnalysisItem } from '@/types/seo/base';

// Meta types
export type { MetaTags, MetaAnalysis } from '@/types/seo/meta';

// Content types
export type {
  HeadingItem,
  HeadingsAnalysis,
  ImageItem,
  ImagesAnalysis,
  LinkItem,
  LinksAnalysis,
  ContentAnalysis,
  KeywordItem,
  KeywordsAnalysis,
  AnchorTextAnalysis,
} from '@/types/seo/content';

// Technical types
export type {
  PerformanceAnalysis,
  TechnicalAnalysis,
  ResourceHintsAnalysis,
  ResourceInfo,
  ResourceOptimizationAnalysis,
  MobileAnalysis,
} from '@/types/seo/technical';

// Detection types
export type {
  SchemaData,
  StructuredDataAnalysis,
  AnalyticsDetection,
  FrameworkDetection,
  SocialAnalyticsAnalysis,
  SchemaPreview,
} from '@/types/seo/detection';

// Advanced analysis types
export type {
  RenderingIndicator,
  RenderingAnalysis,
  LazyContentAnalysis,
  SocialPlatformShare,
  SocialShareAnalysis,
  AccessibilityAnalysis,
  CoreWebVitalsAnalysis,
} from '@/types/seo/advanced';

// Result types
export type {
  SeoAnalysisResult,
  SeoAnalysisResultWithDoc,
  AnalysisState,
  FetchError,
  ScoreWeights,
} from '@/types/seo/result';

// Re-export the constant
export { DEFAULT_SCORE_WEIGHTS } from '@/types/seo/result';
