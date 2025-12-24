/**
 * @fileoverview Meta tags analysis module.
 */

import type { AnalysisItem, MetaAnalysis, MetaTags, SeoStatus } from '@/types/seo';
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from '@/constants/seo';
import { t } from '@/utils/i18nHelper';

/**
 * Analyzes meta tags for SEO optimization.
 */
export function analyzeMeta(meta: MetaTags, url: string): MetaAnalysis {
  const titleLength = meta.title?.length ?? 0;
  const descriptionLength = meta.description?.length ?? 0;

  const titleStatus: SeoStatus =
    titleLength >= TITLE_MIN_LENGTH && titleLength <= TITLE_MAX_LENGTH
      ? 'good'
      : titleLength > 0
        ? 'warning'
        : 'error';

  const descriptionStatus: SeoStatus =
    descriptionLength >= DESCRIPTION_MIN_LENGTH && descriptionLength <= DESCRIPTION_MAX_LENGTH
      ? 'good'
      : descriptionLength > 0
        ? 'warning'
        : 'error';

  const ogItems: AnalysisItem[] = [
    {
      status: meta.ogTitle ? 'good' : 'warning',
      label: 'og:title',
      value: meta.ogTitle,
    },
    {
      status: meta.ogDescription ? 'good' : 'warning',
      label: 'og:description',
      value: meta.ogDescription,
    },
    {
      status: meta.ogImage ? 'good' : 'warning',
      label: 'og:image',
      value: meta.ogImage,
    },
    {
      status: meta.ogType ? 'good' : 'info',
      label: 'og:type',
      value: meta.ogType,
    },
    {
      status: meta.ogUrl ? 'good' : 'info',
      label: 'og:url',
      value: meta.ogUrl,
    },
  ];

  const twitterItems: AnalysisItem[] = [
    {
      status: meta.twitterCard ? 'good' : 'warning',
      label: 'twitter:card',
      value: meta.twitterCard,
    },
    {
      status: meta.twitterTitle ? 'good' : 'info',
      label: 'twitter:title',
      value: meta.twitterTitle,
    },
    {
      status: meta.twitterDescription ? 'good' : 'info',
      label: 'twitter:description',
      value: meta.twitterDescription,
    },
    {
      status: meta.twitterImage ? 'good' : 'info',
      label: 'twitter:image',
      value: meta.twitterImage,
    },
  ];

  const ogStatus: SeoStatus =
    ogItems.filter((i) => i.status === 'good').length >= 3 ? 'good' : 'warning';
  const twitterStatus: SeoStatus = meta.twitterCard ? 'good' : 'warning';

  return {
    title: {
      status: titleStatus,
      label: t('seo.analyzers.meta.titleLabel'),
      value: meta.title,
      length: titleLength,
      details:
        titleStatus === 'good'
          ? t('seo.analyzers.meta.goodLength', { length: titleLength })
          : titleLength === 0
            ? t('seo.analyzers.meta.missingTitle')
            : t('seo.analyzers.meta.lengthWarning', {
                length: titleLength,
                min: TITLE_MIN_LENGTH,
                max: TITLE_MAX_LENGTH,
              }),
    },
    description: {
      status: descriptionStatus,
      label: t('seo.analyzers.meta.descriptionLabel'),
      value: meta.description,
      length: descriptionLength,
      details:
        descriptionStatus === 'good'
          ? t('seo.analyzers.meta.goodLength', { length: descriptionLength })
          : descriptionLength === 0
            ? t('seo.analyzers.meta.missingDescription')
            : t('seo.analyzers.meta.lengthWarning', {
                length: descriptionLength,
                min: DESCRIPTION_MIN_LENGTH,
                max: DESCRIPTION_MAX_LENGTH,
              }),
    },
    keywords: {
      status: 'info',
      label: t('seo.analyzers.meta.keywordsLabel'),
      value: meta.keywords,
      details: meta.keywords
        ? t('seo.analyzers.meta.keywordsDeprecated')
        : t('seo.analyzers.meta.keywordsNotSet'),
    },
    robots: {
      status:
        !meta.robots || meta.robots.includes('index')
          ? 'good'
          : meta.robots.includes('noindex')
            ? 'warning'
            : 'good',
      label: t('seo.analyzers.meta.robotsLabel'),
      value: meta.robots ?? t('seo.analyzers.meta.robotsDefault'),
      details: meta.robots?.includes('noindex') ? t('seo.analyzers.meta.robotsNoindex') : undefined,
    },
    viewport: {
      status: meta.viewport ? 'good' : 'error',
      label: t('seo.analyzers.meta.viewportLabel'),
      value: meta.viewport,
      details: meta.viewport ? undefined : t('seo.analyzers.meta.missingViewport'),
    },
    canonical: {
      status: meta.canonical ? 'good' : 'warning',
      label: t('seo.analyzers.meta.canonicalLabel'),
      value: meta.canonical,
      details: meta.canonical
        ? meta.canonical === url
          ? t('seo.analyzers.meta.canonicalMatches')
          : t('seo.analyzers.meta.canonicalDiffers')
        : t('seo.analyzers.meta.canonicalMissing'),
    },
    openGraph: {
      status: ogStatus,
      items: ogItems,
    },
    twitterCard: {
      status: twitterStatus,
      items: twitterItems,
    },
  };
}
