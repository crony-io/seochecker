/**
 * @fileoverview Headings structure analysis module.
 */

import type { HeadingItem, HeadingsAnalysis, SeoStatus } from '@/types/seo';
import { t } from '@/utils/i18nHelper';

/**
 * Analyzes heading structure for proper hierarchy.
 */
export function analyzeHeadings(
  headings: Array<{ tag: string; level: number; text: string }>,
): HeadingsAnalysis {
  const items: HeadingItem[] = [];
  const h1Count = headings.filter((h) => h.level === 1).length;
  let hasProperHierarchy = true;
  const issues: string[] = [];
  let previousLevel = 0;

  headings.forEach((heading) => {
    const headingIssues: string[] = [];

    if (heading.level > previousLevel + 1 && previousLevel > 0) {
      hasProperHierarchy = false;
      headingIssues.push(
        t('seo.analyzers.headings.skippedLevel', { prev: previousLevel, next: heading.level }),
      );
    }

    if (!heading.text) {
      headingIssues.push(t('seo.analyzers.headings.emptyHeading'));
    }

    items.push({
      tag: heading.tag,
      level: heading.level,
      text: heading.text,
      issues: headingIssues,
    });

    previousLevel = heading.level;
  });

  if (h1Count === 0) {
    issues.push(t('seo.analyzers.headings.missingH1'));
  } else if (h1Count > 1) {
    issues.push(t('seo.analyzers.headings.multipleH1', { count: h1Count }));
  }

  if (!hasProperHierarchy) {
    issues.push(t('seo.analyzers.headings.hierarchyGaps'));
  }

  const status: SeoStatus =
    h1Count === 1 && hasProperHierarchy ? 'good' : h1Count === 0 ? 'error' : 'warning';

  return {
    items,
    h1Count,
    hasProperHierarchy,
    issues,
    status,
  };
}
