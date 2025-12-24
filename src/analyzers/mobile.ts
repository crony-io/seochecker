/**
 * @fileoverview Mobile responsiveness analysis module.
 */

import type { MobileAnalysis, SeoStatus } from '@/types/seo';
import {
  MOBILE_ISSUES_ERROR_THRESHOLD,
  MOBILE_MIN_FONT_SIZE,
  TOUCH_TARGET_MIN_SIZE,
} from '@/constants/seo';
import { t } from '@/utils/i18nHelper';

/**
 * Analyzes mobile responsiveness.
 */
export function analyzeMobile(doc: Document, html: string): MobileAnalysis {
  const viewport = doc.querySelector('meta[name="viewport"]');
  const hasViewport = !!viewport;
  const viewportContent = viewport?.getAttribute('content') || null;

  const images = Array.from(doc.querySelectorAll('img'));
  const imagesWithSrcset = images.filter((img) => img.hasAttribute('srcset')).length;
  const pictureElements = doc.querySelectorAll('picture').length;
  const hasResponsiveImages = imagesWithSrcset > 0 || pictureElements > 0;

  // Check for small fonts (simplified check via inline styles)
  const elementsWithSmallFont = doc.querySelectorAll('[style*="font-size"]');
  let smallFontCount = 0;
  elementsWithSmallFont.forEach((el) => {
    const style = el.getAttribute('style') || '';
    const match = style.match(/font-size:\s*(\d+)/);
    if (match?.[1] && parseInt(match[1], 10) < MOBILE_MIN_FONT_SIZE) {
      smallFontCount++;
    }
  });

  // Check for media queries in style tags
  const styleContent = Array.from(doc.querySelectorAll('style'))
    .map((s) => s.textContent || '')
    .join('');
  const mediaQueries = styleContent.includes('@media') || html.includes('@media');

  // Check for small touch targets (buttons/links smaller than 44px - simplified)
  const interactiveElements = doc.querySelectorAll('a, button, input, select, textarea');
  let touchTargetIssues = 0;
  interactiveElements.forEach((el) => {
    const style = el.getAttribute('style') || '';
    if (style.includes('width') || style.includes('height')) {
      const widthMatch = style.match(/width:\s*(\d+)px/);
      const heightMatch = style.match(/height:\s*(\d+)px/);
      if (
        (widthMatch?.[1] && parseInt(widthMatch[1], 10) < TOUCH_TARGET_MIN_SIZE) ||
        (heightMatch?.[1] && parseInt(heightMatch[1], 10) < TOUCH_TARGET_MIN_SIZE)
      ) {
        touchTargetIssues++;
      }
    }
  });

  const hasMobileFont = smallFontCount === 0;
  const issues: string[] = [];

  if (!hasViewport) {
    issues.push(t('seo.analyzers.mobile.missingViewport'));
  }
  if (!hasResponsiveImages && images.length > 0) {
    issues.push(t('seo.analyzers.mobile.noResponsiveImages'));
  }
  if (smallFontCount > 0) {
    issues.push(t('seo.analyzers.mobile.smallFonts', { count: smallFontCount }));
  }
  if (touchTargetIssues > 0) {
    issues.push(t('seo.analyzers.mobile.smallTouchTargets', { count: touchTargetIssues }));
  }
  if (!mediaQueries) {
    issues.push(t('seo.analyzers.mobile.noMediaQueries'));
  }

  let status: SeoStatus = 'good';
  if (issues.length > 0) {
    status = 'warning';
  }
  if (!hasViewport || issues.length > MOBILE_ISSUES_ERROR_THRESHOLD) {
    status = 'error';
  }

  return {
    hasViewport,
    viewportContent,
    hasResponsiveImages,
    imagesWithSrcset,
    pictureElements,
    hasMobileFont,
    smallFontCount,
    touchTargetIssues,
    mediaQueries,
    issues,
    status,
  };
}
