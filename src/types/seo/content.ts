/**
 * @fileoverview Content analysis types - headings, images, links, keywords.
 */

import type { SeoStatus } from '@/types/seo/base';

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
