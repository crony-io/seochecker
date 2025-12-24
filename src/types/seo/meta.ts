/**
 * @fileoverview Meta tags types and analysis interfaces.
 */

import type { AnalysisItem, SeoStatus } from '@/types/seo/base';

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
