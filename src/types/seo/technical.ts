/**
 * @fileoverview Technical SEO types - performance, resources, technical checks.
 */

import type { SeoStatus } from '@/types/seo/base';

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

/** Resource hints analysis */
export interface ResourceHintsAnalysis {
  preload: string[];
  prefetch: string[];
  preconnect: string[];
  dnsPrefetch: string[];
  hasResourceHints: boolean;
  status: SeoStatus;
}

/** Resource info for optimization analysis */
export interface ResourceInfo {
  url: string;
  type: 'script' | 'stylesheet';
  isMinified: boolean;
  size?: number;
  issues: string[];
}

/** Resource optimization analysis */
export interface ResourceOptimizationAnalysis {
  scripts: ResourceInfo[];
  stylesheets: ResourceInfo[];
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
