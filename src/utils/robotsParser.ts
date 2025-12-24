/**
 * @fileoverview Robots.txt parser and sitemap detection utilities.
 */

import type { SeoStatus } from '@/types/seo';
import { normalizeUrl, fetchResource } from '@/utils/corsProxy';
import { t } from '@/utils/i18nHelper';

/** A single robots.txt directive */
export interface RobotsDirective {
  type: 'allow' | 'disallow' | 'crawl-delay' | 'sitemap' | 'user-agent' | 'other';
  value: string;
  userAgent?: string;
}

/** Parsed robots.txt result */
export interface RobotsTxtAnalysis {
  found: boolean;
  content: string | null;
  directives: RobotsDirective[];
  userAgents: string[];
  sitemaps: string[];
  allowedPaths: string[];
  disallowedPaths: string[];
  crawlDelay: number | null;
  issues: string[];
  status: SeoStatus;
}

/** Sitemap detection result */
export interface SitemapAnalysis {
  found: boolean;
  sitemaps: SitemapInfo[];
  fromRobotsTxt: string[];
  issues: string[];
  status: SeoStatus;
}

/** Individual sitemap info */
export interface SitemapInfo {
  url: string;
  found: boolean;
  type: 'xml' | 'index' | 'unknown';
  source: 'robots.txt' | 'default' | 'html';
}

/**
 * Parses robots.txt content into structured data.
 */
export function parseRobotsTxt(content: string): Omit<RobotsTxtAnalysis, 'found' | 'status'> {
  const lines = content.split('\n').map((line) => line.trim());
  const directives: RobotsDirective[] = [];
  const userAgents = new Set<string>();
  const sitemaps: string[] = [];
  const allowedPaths: string[] = [];
  const disallowedPaths: string[] = [];
  const issues: string[] = [];
  let currentUserAgent = '*';
  let crawlDelay: number | null = null;

  for (const line of lines) {
    if (!line || line.startsWith('#')) {
      continue;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      continue;
    }

    const directive = line.substring(0, colonIndex).trim().toLowerCase();
    const value = line.substring(colonIndex + 1).trim();

    switch (directive) {
      case 'user-agent':
        currentUserAgent = value;
        userAgents.add(value);
        directives.push({ type: 'user-agent', value });
        break;

      case 'allow':
        allowedPaths.push(value);
        directives.push({ type: 'allow', value, userAgent: currentUserAgent });
        break;

      case 'disallow':
        if (value) {
          disallowedPaths.push(value);
          directives.push({ type: 'disallow', value, userAgent: currentUserAgent });
        }
        break;

      case 'crawl-delay':
        const delay = parseFloat(value);
        if (!isNaN(delay)) {
          crawlDelay = delay;
          directives.push({ type: 'crawl-delay', value, userAgent: currentUserAgent });
        }
        break;

      case 'sitemap':
        sitemaps.push(value);
        directives.push({ type: 'sitemap', value });
        break;

      default:
        directives.push({ type: 'other', value: `${directive}: ${value}` });
    }
  }

  // Check for common issues
  if (disallowedPaths.includes('/')) {
    issues.push(t('seo.robotsTxt.analyzers.blockingAll'));
  }

  // Note: Blocking admin paths (wp-admin, admin) is a common and recommended practice

  if (sitemaps.length === 0) {
    issues.push(t('seo.robotsTxt.analyzers.noSitemap'));
  }

  if (!userAgents.has('*') && userAgents.size > 0) {
    issues.push(t('seo.robotsTxt.analyzers.noGenericAgent'));
  }

  return {
    content,
    directives,
    userAgents: Array.from(userAgents),
    sitemaps,
    allowedPaths,
    disallowedPaths,
    crawlDelay,
    issues,
  };
}

/**
 * Fetches and analyzes robots.txt for a URL.
 */
export async function analyzeRobotsTxt(url: string): Promise<RobotsTxtAnalysis> {
  const normalizedUrl = normalizeUrl(url);
  let baseUrl: string;

  try {
    const parsed = new URL(normalizedUrl);
    baseUrl = `${parsed.protocol}//${parsed.host}`;
  } catch {
    return {
      found: false,
      content: null,
      directives: [],
      userAgents: [],
      sitemaps: [],
      allowedPaths: [],
      disallowedPaths: [],
      crawlDelay: null,
      issues: [t('seo.robotsTxt.analyzers.invalidUrl')],
      status: 'error',
    };
  }

  const robotsUrl = `${baseUrl}/robots.txt`;
  const result = await fetchResource(robotsUrl);

  if (!result.ok || !result.content) {
    return {
      found: false,
      content: null,
      directives: [],
      userAgents: [],
      sitemaps: [],
      allowedPaths: [],
      disallowedPaths: [],
      crawlDelay: null,
      issues: [t('seo.robotsTxt.analyzers.notAccessible')],
      status: 'warning',
    };
  }

  // Check if it's actually robots.txt content (not HTML error page)
  const content = result.content.trim();
  if (content.startsWith('<!DOCTYPE') || content.startsWith('<html')) {
    return {
      found: false,
      content: null,
      directives: [],
      userAgents: [],
      sitemaps: [],
      allowedPaths: [],
      disallowedPaths: [],
      crawlDelay: null,
      issues: [t('seo.robotsTxt.analyzers.returnsHtml')],
      status: 'warning',
    };
  }

  const parsed = parseRobotsTxt(content);
  const hasBlockingIssues = parsed.issues.some((i) => i.includes('blocking all'));

  return {
    found: true,
    ...parsed,
    status: hasBlockingIssues ? 'error' : parsed.issues.length > 0 ? 'warning' : 'good',
  };
}

/**
 * Detects and analyzes sitemaps for a URL.
 */
export async function analyzeSitemaps(
  url: string,
  robotsSitemaps: string[] = [],
): Promise<SitemapAnalysis> {
  const normalizedUrl = normalizeUrl(url);
  let baseUrl: string;

  try {
    const parsed = new URL(normalizedUrl);
    baseUrl = `${parsed.protocol}//${parsed.host}`;
  } catch {
    return {
      found: false,
      sitemaps: [],
      fromRobotsTxt: [],
      issues: [t('seo.robotsTxt.analyzers.invalidUrl')],
      status: 'error',
    };
  }

  const sitemapsToCheck: Array<{ url: string; source: 'robots.txt' | 'default' }> = [];
  const issues: string[] = [];

  // Add sitemaps from robots.txt
  for (const sitemap of robotsSitemaps) {
    sitemapsToCheck.push({ url: sitemap, source: 'robots.txt' });
  }

  // Add default sitemap location if not already included
  const defaultSitemap = `${baseUrl}/sitemap.xml`;
  if (!robotsSitemaps.some((s) => s.toLowerCase() === defaultSitemap.toLowerCase())) {
    sitemapsToCheck.push({ url: defaultSitemap, source: 'default' });
  }

  const sitemaps: SitemapInfo[] = [];

  for (const { url: sitemapUrl, source } of sitemapsToCheck) {
    const result = await fetchResource(sitemapUrl);

    if (result.ok && result.content) {
      const content = result.content.trim();
      const isXml =
        content.startsWith('<?xml') ||
        content.startsWith('<urlset') ||
        content.startsWith('<sitemapindex');

      if (isXml) {
        const isIndex = content.includes('<sitemapindex');
        sitemaps.push({
          url: sitemapUrl,
          found: true,
          type: isIndex ? 'index' : 'xml',
          source,
        });
      } else {
        sitemaps.push({
          url: sitemapUrl,
          found: false,
          type: 'unknown',
          source,
        });
        if (source === 'robots.txt') {
          issues.push(t('seo.robotsTxt.analyzers.sitemapInvalidXml', { url: sitemapUrl }));
        }
      }
    } else {
      sitemaps.push({
        url: sitemapUrl,
        found: false,
        type: 'unknown',
        source,
      });
      if (source === 'robots.txt') {
        issues.push(t('seo.robotsTxt.analyzers.sitemapNotAccessible', { url: sitemapUrl }));
      }
    }
  }

  const foundSitemaps = sitemaps.filter((s) => s.found);

  if (foundSitemaps.length === 0) {
    issues.push(t('seo.robotsTxt.analyzers.noSitemapFound'));
  }

  return {
    found: foundSitemaps.length > 0,
    sitemaps,
    fromRobotsTxt: robotsSitemaps,
    issues,
    status: foundSitemaps.length > 0 ? 'good' : 'warning',
  };
}
