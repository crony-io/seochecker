/**
 * @fileoverview Social share button detection.
 */

import type { SeoStatus } from '@/types/seo';
import { t } from '@/utils/i18nHelper';

export interface SocialShareAnalysis {
  hasShareButtons: boolean;
  platforms: SocialPlatformShare[];
  shareWidgets: string[];
  nativeShareApi: boolean;
  issues: string[];
  status: SeoStatus;
}

export interface SocialPlatformShare {
  platform: string;
  detected: boolean;
  type: 'button' | 'widget' | 'link' | 'sdk';
}

const SOCIAL_SHARE_PATTERNS: Array<{
  platform: string;
  patterns: RegExp[];
  type: SocialPlatformShare['type'];
}> = [
  {
    platform: 'Facebook',
    patterns: [
      /facebook\.com\/sharer/i,
      /fb-share/i,
      /share.*facebook/i,
      /facebook-share/i,
      /data-share.*facebook/i,
    ],
    type: 'button',
  },
  {
    platform: 'Twitter/X',
    patterns: [
      /twitter\.com\/intent\/tweet/i,
      /twitter\.com\/share/i,
      /x\.com\/intent\/tweet/i,
      /tweet-button/i,
      /twitter-share/i,
      /data-share.*twitter/i,
    ],
    type: 'button',
  },
  {
    platform: 'LinkedIn',
    patterns: [
      /linkedin\.com\/sharing/i,
      /linkedin\.com\/shareArticle/i,
      /linkedin-share/i,
      /share.*linkedin/i,
    ],
    type: 'button',
  },
  {
    platform: 'Pinterest',
    patterns: [/pinterest\.com\/pin\/create/i, /pin-it/i, /pinterest-share/i, /pinit\.js/i],
    type: 'button',
  },
  {
    platform: 'WhatsApp',
    patterns: [/whatsapp:\/\//i, /api\.whatsapp\.com\/send/i, /wa\.me\//i, /whatsapp-share/i],
    type: 'button',
  },
  {
    platform: 'Telegram',
    patterns: [/t\.me\/share/i, /telegram\.me\/share/i, /telegram-share/i],
    type: 'button',
  },
  {
    platform: 'Reddit',
    patterns: [/reddit\.com\/submit/i, /reddit-share/i],
    type: 'button',
  },
  {
    platform: 'Email',
    patterns: [/mailto:.*subject=/i, /email-share/i, /share.*email/i],
    type: 'button',
  },
];

const SHARE_WIDGET_PATTERNS = [
  { pattern: /addthis/i, name: 'AddThis' },
  { pattern: /sharethis/i, name: 'ShareThis' },
  { pattern: /addtoany/i, name: 'AddToAny' },
  { pattern: /social-share/i, name: 'Social Share Widget' },
  { pattern: /share-buttons/i, name: 'Share Buttons' },
  { pattern: /ssba/i, name: 'Simple Share Buttons' },
  { pattern: /sumo\.com/i, name: 'Sumo Share' },
];

/**
 * Analyzes social share button presence.
 */
export function analyzeSocialShare(doc: Document, html: string): SocialShareAnalysis {
  const platforms: SocialPlatformShare[] = [];
  const shareWidgets: string[] = [];
  const issues: string[] = [];

  // Check for each social platform
  SOCIAL_SHARE_PATTERNS.forEach(({ platform, patterns, type }) => {
    const detected = patterns.some((pattern) => pattern.test(html));
    platforms.push({
      platform,
      detected,
      type,
    });
  });

  // Check for share widgets/libraries
  SHARE_WIDGET_PATTERNS.forEach(({ pattern, name }) => {
    if (pattern.test(html)) {
      shareWidgets.push(name);
    }
  });

  // Check for Web Share API usage
  const nativeShareApi = /navigator\.share/i.test(html);

  // Check for share-related elements
  const shareElements = doc.querySelectorAll(
    '[class*="share"], [id*="share"], [data-share], .social-buttons, .share-buttons',
  );

  const hasShareButtons =
    platforms.some((p) => p.detected) ||
    shareWidgets.length > 0 ||
    nativeShareApi ||
    shareElements.length > 0;

  // Generate issues/recommendations
  if (!hasShareButtons) {
    issues.push(t('seo.socialShare.analyzers.noShareButtons'));
  }

  const detectedPlatforms = platforms.filter((p) => p.detected);
  if (detectedPlatforms.length > 0 && detectedPlatforms.length < 3) {
    issues.push(t('seo.socialShare.analyzers.fewShareOptions'));
  }

  // Check if Facebook and Twitter are present (most important)
  const hasFacebook = platforms.find((p) => p.platform === 'Facebook')?.detected;
  const hasTwitter = platforms.find((p) => p.platform === 'Twitter/X')?.detected;

  if (hasShareButtons && !hasFacebook && !hasTwitter) {
    issues.push(t('seo.socialShare.analyzers.missingMainPlatforms'));
  }

  // Determine status
  let status: SeoStatus = 'good';
  if (!hasShareButtons) {
    status = 'info';
  } else if (detectedPlatforms.length < 2) {
    status = 'warning';
  }

  return {
    hasShareButtons,
    platforms,
    shareWidgets,
    nativeShareApi,
    issues,
    status,
  };
}
