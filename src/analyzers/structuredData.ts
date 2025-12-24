/**
 * @fileoverview Structured data analysis module.
 */

import type { SchemaData, SchemaPreview, SeoStatus, StructuredDataAnalysis } from '@/types/seo';

/**
 * Analyzes structured data (JSON-LD) on the page.
 */
export function analyzeStructuredData(jsonLdData: unknown[]): StructuredDataAnalysis {
  const jsonLd: SchemaData[] = [];

  jsonLdData.forEach((data) => {
    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const type =
        typeof obj['@type'] === 'string'
          ? obj['@type']
          : Array.isArray(obj['@type'])
            ? obj['@type'].join(', ')
            : 'Unknown';

      jsonLd.push({ type, raw: data });
    }
  });

  const hasSchema = jsonLd.length > 0;
  const status: SeoStatus = hasSchema ? 'good' : 'info';

  return {
    jsonLd,
    microdata: [],
    hasSchema,
    status,
  };
}

/**
 * Extracts schema.org previews from JSON-LD data.
 */
export function extractSchemaPreviews(jsonLdData: SchemaData[]): SchemaPreview[] {
  const previews: SchemaPreview[] = [];

  jsonLdData.forEach((schema) => {
    const raw = schema.raw as Record<string, unknown>;
    if (!raw) {
      return;
    }

    const preview: SchemaPreview = {
      type: schema.type,
      raw: schema.raw,
    };

    // Extract common properties
    if (typeof raw.name === 'string') {
      preview.name = raw.name;
    }
    if (typeof raw.headline === 'string') {
      preview.name = raw.headline;
    }
    if (typeof raw.description === 'string') {
      preview.description = raw.description;
    }

    // Image
    if (typeof raw.image === 'string') {
      preview.image = raw.image;
    } else if (Array.isArray(raw.image) && typeof raw.image[0] === 'string') {
      preview.image = raw.image[0];
    } else if (raw.image && typeof (raw.image as Record<string, unknown>).url === 'string') {
      preview.image = (raw.image as Record<string, unknown>).url as string;
    }

    // Rating
    if (raw.aggregateRating) {
      const rating = raw.aggregateRating as Record<string, unknown>;
      if (rating.ratingValue !== undefined && rating.reviewCount !== undefined) {
        preview.rating = {
          value: parseFloat(String(rating.ratingValue)),
          count: parseInt(String(rating.reviewCount), 10),
        };
      }
    }

    // Price (Product schema)
    if (raw.offers) {
      const offers = raw.offers as Record<string, unknown>;
      if (offers.price !== undefined) {
        preview.price = {
          value: String(offers.price),
          currency: String(offers.priceCurrency || 'USD'),
        };
      }
    }

    // Author
    if (typeof raw.author === 'string') {
      preview.author = raw.author;
    } else if (raw.author && typeof (raw.author as Record<string, unknown>).name === 'string') {
      preview.author = (raw.author as Record<string, unknown>).name as string;
    }

    // Date
    if (typeof raw.datePublished === 'string') {
      preview.datePublished = raw.datePublished;
    }

    previews.push(preview);
  });

  return previews;
}
