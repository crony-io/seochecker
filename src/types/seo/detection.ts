/**
 * @fileoverview Detection types - analytics, frameworks, structured data.
 */

import type { SeoStatus } from '@/types/seo/base';

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
