/**
 * @fileoverview SEO analysis types and interfaces.
 */

/** Status of an SEO check item */
export type SeoStatus = 'good' | 'warning' | 'error' | 'info';

/** Base interface for all analysis results */
export interface AnalysisItem {
  status: SeoStatus;
  label: string;
  value: string | number | null;
  details?: string;
}

/** Meta tags extracted from HTML */
export interface MetaTags {
  title: string | null;
  description: string | null;
  keywords: string | null;
  robots: string | null;
  viewport: string | null;
  charset: string | null;
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogType: string | null;
  ogUrl: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  author: string | null;
  language: string | null;
}

/** Meta analysis result with scoring */
export interface MetaAnalysis {
  title: AnalysisItem & { length: number };
  description: AnalysisItem & { length: number };
  keywords: AnalysisItem;
  robots: AnalysisItem;
  viewport: AnalysisItem;
  canonical: AnalysisItem;
  openGraph: {
    status: SeoStatus;
    items: AnalysisItem[];
  };
  twitterCard: {
    status: SeoStatus;
    items: AnalysisItem[];
  };
}

/** Single heading item */
export interface HeadingItem {
  tag: string;
  level: number;
  text: string;
  issues: string[];
}

/** Headings analysis result */
export interface HeadingsAnalysis {
  items: HeadingItem[];
  h1Count: number;
  hasProperHierarchy: boolean;
  issues: string[];
  status: SeoStatus;
}

/** Image item for analysis */
export interface ImageItem {
  src: string;
  alt: string | null;
  hasLazyLoading: boolean;
  format: string;
  issues: string[];
}

/** Images analysis result */
export interface ImagesAnalysis {
  total: number;
  withoutAlt: number;
  withLazyLoading: number;
  formats: Record<string, number>;
  items: ImageItem[];
  status: SeoStatus;
}

/** Link item for analysis */
export interface LinkItem {
  href: string;
  text: string;
  isInternal: boolean;
  isNofollow: boolean;
  opensNewTab: boolean;
  issues: string[];
}

/** Links analysis result */
export interface LinksAnalysis {
  total: number;
  internal: number;
  external: number;
  nofollow: number;
  items: LinkItem[];
  status: SeoStatus;
}

/** Content analysis metrics */
export interface ContentAnalysis {
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  readingTimeMinutes: number;
  textToHtmlRatio: number;
  status: SeoStatus;
}

/** Keyword with frequency */
export interface KeywordItem {
  word: string;
  count: number;
  density: number;
}

/** Keywords analysis result */
export interface KeywordsAnalysis {
  topKeywords: KeywordItem[];
  totalWords: number;
  uniqueWords: number;
  consistency: {
    inTitle: string[];
    inDescription: string[];
    inH1: string[];
    inContent: string[];
  };
  status: SeoStatus;
}

/** Performance indicators */
export interface PerformanceAnalysis {
  htmlSize: number;
  domElements: number;
  domDepth: number;
  scriptsCount: number;
  stylesheetsCount: number;
  inlineScripts: number;
  inlineStyles: number;
  blockingResources: number;
  status: SeoStatus;
}

/** Technical SEO checks */
export interface TechnicalAnalysis {
  hasDoctype: boolean;
  hasCharset: boolean;
  hasViewport: boolean;
  hasCanonical: boolean;
  hasHreflang: boolean;
  hasFavicon: boolean;
  isHttps: boolean;
  hasLanguage: boolean;
  urlLength: number;
  status: SeoStatus;
}

/** Schema.org structured data */
export interface SchemaData {
  type: string;
  raw: unknown;
}

/** Structured data analysis */
export interface StructuredDataAnalysis {
  jsonLd: SchemaData[];
  microdata: string[];
  hasSchema: boolean;
  status: SeoStatus;
}

/** Resource hints analysis */
export interface ResourceHintsAnalysis {
  preload: string[];
  prefetch: string[];
  preconnect: string[];
  dnsPrefetch: string[];
  hasResourceHints: boolean;
  status: SeoStatus;
}

/** Detected analytics/tracking tools */
export interface AnalyticsDetection {
  googleAnalytics: boolean;
  googleTagManager: boolean;
  facebookPixel: boolean;
  hotjar: boolean;
  other: string[];
}

/** Detected JS frameworks */
export interface FrameworkDetection {
  react: boolean;
  vue: boolean;
  angular: boolean;
  svelte: boolean;
  jquery: boolean;
  nextjs: boolean;
  nuxt: boolean;
  other: string[];
}

/** Social & Analytics analysis */
export interface SocialAnalyticsAnalysis {
  analytics: AnalyticsDetection;
  frameworks: FrameworkDetection;
  socialLinks: string[];
  status: SeoStatus;
}

/** Anchor text analysis */
export interface AnchorTextAnalysis {
  total: number;
  generic: number;
  descriptive: number;
  overOptimized: number;
  genericTexts: string[];
  issues: string[];
  status: SeoStatus;
}

/** Mobile responsiveness analysis */
export interface MobileAnalysis {
  hasViewport: boolean;
  viewportContent: string | null;
  hasResponsiveImages: boolean;
  imagesWithSrcset: number;
  pictureElements: number;
  hasMobileFont: boolean;
  smallFontCount: number;
  touchTargetIssues: number;
  mediaQueries: boolean;
  issues: string[];
  status: SeoStatus;
}

/** Resource optimization analysis */
export interface ResourceOptimizationAnalysis {
  scripts: Array<{ url: string; type: string; isMinified: boolean; issues: string[] }>;
  stylesheets: Array<{ url: string; type: string; isMinified: boolean; issues: string[] }>;
  minifiedScripts: number;
  minifiedStylesheets: number;
  totalScripts: number;
  totalStylesheets: number;
  hasPrintStyles: boolean;
  printStylesheets: string[];
  printMediaQueries: number;
  issues: string[];
  status: SeoStatus;
}

/** Rendering type analysis */
export interface RenderingAnalysis {
  renderingType: 'ssr' | 'csr' | 'hybrid' | 'static' | 'unknown';
  confidence: number;
  indicators: Array<{ type: string; indicator: string; weight: number }>;
  hasNoscriptFallback: boolean;
  noscriptContent: string | null;
  appContainerEmpty: boolean;
  hydrationMarkers: string[];
  issues: string[];
  status: SeoStatus;
}

/** Lazy content and infinite scroll analysis */
export interface LazyContentAnalysis {
  hasInfiniteScroll: boolean;
  infiniteScrollPatterns: string[];
  hasLazyImages: boolean;
  lazyImageCount: number;
  hasLazyIframes: boolean;
  lazyIframeCount: number;
  hasIntersectionObserver: boolean;
  hasPagination: boolean;
  paginationLinks: string[];
  issues: string[];
  recommendations: string[];
  status: SeoStatus;
}

/** Social share buttons analysis */
export interface SocialShareAnalysis {
  hasShareButtons: boolean;
  platforms: Array<{ platform: string; detected: boolean; type: string }>;
  shareWidgets: string[];
  nativeShareApi: boolean;
  issues: string[];
  status: SeoStatus;
}

/** Accessibility analysis */
export interface AccessibilityAnalysis {
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    rule: string;
    message: string;
    count: number;
    wcagLevel: 'A' | 'AA' | 'AAA';
    wcagCriteria: string;
  }>;
  passed: Array<{ rule: string; description: string }>;
  landmarks: {
    hasMain: boolean;
    hasNav: boolean;
    hasHeader: boolean;
    hasFooter: boolean;
    hasAside: boolean;
    landmarks: string[];
  };
  aria: {
    ariaLabels: number;
    ariaDescribedby: number;
    ariaHidden: number;
    roles: string[];
    liveRegions: number;
  };
  forms: {
    totalInputs: number;
    inputsWithLabels: number;
    inputsWithPlaceholderOnly: number;
    requiredFields: number;
    requiredWithAriaRequired: number;
  };
  contrast: {
    lightTextOnLight: number;
    potentialIssues: number;
  };
  status: SeoStatus;
}

/** Core Web Vitals estimation */
export interface CoreWebVitalsAnalysis {
  lcp: {
    estimate: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    factors: Array<{ factor: string; impact: string; description: string }>;
    largestElement: string | null;
    issues: string[];
  };
  cls: {
    estimate: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    factors: Array<{ factor: string; impact: string; count: number }>;
    issues: string[];
  };
  fid: {
    estimate: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    factors: string[];
    issues: string[];
  };
  inp: {
    estimate: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    factors: string[];
    issues: string[];
  };
  overallStatus: SeoStatus;
  recommendations: string[];
}

/** Schema.org type info for preview */
export interface SchemaPreview {
  type: string;
  name?: string;
  description?: string;
  image?: string;
  rating?: {
    value: number;
    count: number;
  };
  price?: {
    value: string;
    currency: string;
  };
  author?: string;
  datePublished?: string;
  raw: unknown;
}

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
