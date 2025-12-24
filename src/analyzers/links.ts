/**
 * @fileoverview Links analysis module.
 */

import type { LinkItem, LinksAnalysis, SeoStatus } from '@/types/seo';
import { NON_DESCRIPTIVE_ANCHORS } from '@/constants/seo';
import { isInternalLink } from '@/utils/corsProxy';
import { t } from '@/utils/i18nHelper';

/**
 * Analyzes links for SEO optimization.
 */
export function analyzeLinks(
  links: Array<{ href: string; text: string; rel: string | null; target: string | null }>,
  baseUrl: string,
): LinksAnalysis {
  const items: LinkItem[] = [];
  let internal = 0;
  let external = 0;
  let nofollow = 0;

  links.forEach((link) => {
    const issues: string[] = [];
    const isInternal = isInternalLink(link.href, baseUrl);
    const isNofollow = link.rel?.includes('nofollow') ?? false;
    const opensNewTab = link.target === '_blank';

    if (isInternal) {
      internal++;
    } else if (link.href.startsWith('http')) {
      external++;
    }

    if (isNofollow) {
      nofollow++;
    }

    const lowerText = link.text.toLowerCase();
    if (NON_DESCRIPTIVE_ANCHORS.includes(lowerText as (typeof NON_DESCRIPTIVE_ANCHORS)[number])) {
      issues.push(t('seo.analyzers.links.nonDescriptive'));
    }

    if (!link.text.trim()) {
      issues.push(t('seo.analyzers.links.emptyAnchor'));
    }

    items.push({
      href: link.href,
      text: link.text,
      isInternal,
      isNofollow,
      opensNewTab,
      issues,
    });
  });

  const total = links.length;
  const status: SeoStatus =
    internal > 0 && external >= 0 ? 'good' : internal === 0 ? 'warning' : 'good';

  return {
    total,
    internal,
    external,
    nofollow,
    items,
    status,
  };
}
