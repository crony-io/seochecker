/**
 * @fileoverview Social media and analytics detection module.
 */

import type { SeoStatus, SocialAnalyticsAnalysis } from '@/types/seo';

/**
 * Detects analytics and frameworks in the document.
 */
export function analyzeSocialAnalytics(doc: Document, html: string): SocialAnalyticsAnalysis {
  const scriptContent = html.toLowerCase();

  const analytics = {
    googleAnalytics:
      scriptContent.includes('google-analytics.com') ||
      scriptContent.includes('gtag') ||
      scriptContent.includes('ga.js') ||
      scriptContent.includes('analytics.js'),
    googleTagManager:
      scriptContent.includes('googletagmanager.com') || scriptContent.includes('gtm.js'),
    facebookPixel:
      scriptContent.includes('connect.facebook.net') || scriptContent.includes('fbevents.js'),
    hotjar: scriptContent.includes('hotjar.com') || scriptContent.includes('static.hotjar.com'),
    other: [] as string[],
  };

  if (scriptContent.includes('mixpanel.com')) {
    analytics.other.push('Mixpanel');
  }
  if (scriptContent.includes('segment.com') || scriptContent.includes('segment.io')) {
    analytics.other.push('Segment');
  }
  if (scriptContent.includes('clarity.ms')) {
    analytics.other.push('Microsoft Clarity');
  }

  const frameworks = {
    react:
      scriptContent.includes('react') ||
      !!doc.querySelector('[data-reactroot]') ||
      !!doc.getElementById('__next'),
    vue:
      scriptContent.includes('vue.js') ||
      scriptContent.includes('vue.min.js') ||
      !!doc.querySelector('[data-v-]') ||
      !!doc.getElementById('__nuxt'),
    angular:
      scriptContent.includes('angular') ||
      !!doc.querySelector('[ng-app]') ||
      !!doc.querySelector('[ng-controller]'),
    svelte: scriptContent.includes('svelte'),
    jquery: scriptContent.includes('jquery') || scriptContent.includes('jquery.min.js'),
    nextjs: !!doc.getElementById('__next') || scriptContent.includes('_next/static'),
    nuxt: !!doc.getElementById('__nuxt') || scriptContent.includes('_nuxt'),
    other: [] as string[],
  };

  if (scriptContent.includes('backbone')) {
    frameworks.other.push('Backbone.js');
  }
  if (scriptContent.includes('ember')) {
    frameworks.other.push('Ember.js');
  }

  const socialLinks = Array.from(doc.querySelectorAll('a[href]'))
    .map((a) => a.getAttribute('href') || '')
    .filter(
      (href) =>
        href.includes('facebook.com') ||
        href.includes('twitter.com') ||
        href.includes('x.com') ||
        href.includes('linkedin.com') ||
        href.includes('instagram.com') ||
        href.includes('youtube.com') ||
        href.includes('tiktok.com'),
    );

  const hasAnalytics = analytics.googleAnalytics || analytics.googleTagManager;
  const status: SeoStatus = hasAnalytics ? 'good' : 'info';

  return {
    analytics,
    frameworks,
    socialLinks: Array.from(new Set(socialLinks)),
    status,
  };
}
