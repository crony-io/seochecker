/**
 * @fileoverview Images analysis module.
 */

import type { ImageItem, ImagesAnalysis, SeoStatus } from '@/types/seo';
import { IMAGE_ALT_WARNING_THRESHOLD } from '@/constants/seo';
import { t } from '@/utils/i18nHelper';

/**
 * Analyzes images for SEO optimization.
 */
export function analyzeImages(
  images: Array<{ src: string; alt: string | null; loading: string | null }>,
): ImagesAnalysis {
  const items: ImageItem[] = [];
  const formats: Record<string, number> = {};
  let withoutAlt = 0;
  let withLazyLoading = 0;

  images.forEach((img) => {
    const issues: string[] = [];
    const hasAlt = img.alt !== null && img.alt.trim() !== '';
    const hasLazy = img.loading === 'lazy';

    if (!hasAlt) {
      withoutAlt++;
      issues.push(t('seo.analyzers.images.missingAlt'));
    }

    if (hasLazy) {
      withLazyLoading++;
    }

    const format = img.src.split('.').pop()?.toLowerCase().split('?')[0] ?? 'unknown';
    formats[format] = (formats[format] ?? 0) + 1;

    if (/^img_?\d+|dsc_?\d+|image\d+|photo\d+|screenshot/i.test(img.src)) {
      issues.push(t('seo.analyzers.images.genericFilename'));
    }

    items.push({
      src: img.src,
      alt: img.alt,
      hasLazyLoading: hasLazy,
      format,
      issues,
    });
  });

  const total = images.length;
  const status: SeoStatus =
    total === 0 || withoutAlt === 0
      ? 'good'
      : withoutAlt / total < IMAGE_ALT_WARNING_THRESHOLD
        ? 'warning'
        : 'error';

  return {
    total,
    withoutAlt,
    withLazyLoading,
    formats,
    items,
    status,
  };
}
