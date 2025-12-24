/**
 * @fileoverview Embedded content analysis for iframes, videos, and audio elements.
 */

import type { SeoStatus } from '@/types/seo';
import { t } from '@/utils/i18nHelper';

// =============================================================================
// TYPES
// =============================================================================

/** Iframe analysis item */
export interface IframeItem {
  src: string;
  title: string | null;
  width: string | null;
  height: string | null;
  sandbox: string | null;
  loading: string | null;
  isResponsive: boolean;
  issues: string[];
}

/** Video analysis item */
export interface VideoItem {
  src: string | null;
  sources: string[];
  poster: string | null;
  hasControls: boolean;
  hasAutoplay: boolean;
  isMuted: boolean;
  hasLoop: boolean;
  preload: string | null;
  hasCaptions: boolean;
  issues: string[];
}

/** Audio analysis item */
export interface AudioItem {
  src: string | null;
  sources: string[];
  hasControls: boolean;
  hasAutoplay: boolean;
  isMuted: boolean;
  hasLoop: boolean;
  preload: string | null;
  issues: string[];
}

/** Complete embedded content analysis */
export interface EmbeddedContentAnalysis {
  iframes: {
    total: number;
    items: IframeItem[];
    issues: string[];
    status: SeoStatus;
  };
  videos: {
    total: number;
    items: VideoItem[];
    issues: string[];
    status: SeoStatus;
  };
  audios: {
    total: number;
    items: AudioItem[];
    issues: string[];
    status: SeoStatus;
  };
  overallStatus: SeoStatus;
}

// =============================================================================
// ANALYSIS FUNCTIONS
// =============================================================================

/**
 * Analyzes all embedded content on the page.
 */
export function analyzeEmbeddedContent(doc: Document): EmbeddedContentAnalysis {
  const iframes = analyzeIframes(doc);
  const videos = analyzeVideos(doc);
  const audios = analyzeAudios(doc);

  // Determine overall status
  let overallStatus: SeoStatus = 'good';
  if (iframes.status === 'error' || videos.status === 'error' || audios.status === 'error') {
    overallStatus = 'error';
  } else if (
    iframes.status === 'warning' ||
    videos.status === 'warning' ||
    audios.status === 'warning'
  ) {
    overallStatus = 'warning';
  } else if (iframes.total === 0 && videos.total === 0 && audios.total === 0) {
    overallStatus = 'info';
  }

  return {
    iframes,
    videos,
    audios,
    overallStatus,
  };
}

/**
 * Analyzes iframe elements.
 */
function analyzeIframes(doc: Document): EmbeddedContentAnalysis['iframes'] {
  const iframeElements = Array.from(doc.querySelectorAll('iframe'));
  const items: IframeItem[] = [];
  const globalIssues: string[] = [];

  let withoutTitle = 0;
  let withoutLazyLoading = 0;

  iframeElements.forEach((iframe) => {
    const src = iframe.getAttribute('src') || iframe.getAttribute('data-src') || '';
    const title = iframe.getAttribute('title');
    const width = iframe.getAttribute('width');
    const height = iframe.getAttribute('height');
    const sandbox = iframe.getAttribute('sandbox');
    const loading = iframe.getAttribute('loading');

    const issues: string[] = [];

    // Check for title (accessibility)
    if (!title) {
      issues.push(t('seo.embeddedContent.analyzers.iframeMissingTitle'));
      withoutTitle++;
    }

    // Check for lazy loading
    if (loading !== 'lazy') {
      withoutLazyLoading++;
    }

    // Check for sandbox attribute (security)
    if (!sandbox && src.startsWith('http')) {
      issues.push(t('seo.embeddedContent.analyzers.iframeMissingSandbox'));
    }

    // Check if responsive
    const style = iframe.getAttribute('style') || '';
    const isResponsive =
      style.includes('100%') ||
      width === '100%' ||
      iframe.classList.contains('responsive') ||
      iframe.parentElement?.classList.contains('responsive');

    items.push({
      src,
      title,
      width,
      height,
      sandbox,
      loading,
      isResponsive: isResponsive || false,
      issues,
    });
  });

  // Global issues
  if (withoutTitle > 0) {
    globalIssues.push(t('seo.embeddedContent.analyzers.iframesMissingTitle', { count: withoutTitle }));
  }
  if (withoutLazyLoading > 0) {
    globalIssues.push(t('seo.embeddedContent.analyzers.iframesNoLazyLoading', { count: withoutLazyLoading }));
  }

  // Determine status
  let status: SeoStatus = 'good';
  if (iframeElements.length === 0) {
    status = 'info';
  } else if (withoutTitle > iframeElements.length / 2) {
    status = 'error';
  } else if (globalIssues.length > 0) {
    status = 'warning';
  }

  return {
    total: iframeElements.length,
    items: items.slice(0, 10), // Limit to first 10
    issues: globalIssues,
    status,
  };
}

/**
 * Analyzes video elements.
 */
function analyzeVideos(doc: Document): EmbeddedContentAnalysis['videos'] {
  const videoElements = Array.from(doc.querySelectorAll('video'));
  const items: VideoItem[] = [];
  const globalIssues: string[] = [];

  let withoutControls = 0;
  let withAutoplay = 0;
  let withoutCaptions = 0;

  videoElements.forEach((video) => {
    const src = video.getAttribute('src');
    const sources = Array.from(video.querySelectorAll('source')).map(
      (s) => s.getAttribute('src') || '',
    );
    const poster = video.getAttribute('poster');
    const hasControls = video.hasAttribute('controls');
    const hasAutoplay = video.hasAttribute('autoplay');
    const isMuted = video.hasAttribute('muted');
    const hasLoop = video.hasAttribute('loop');
    const preload = video.getAttribute('preload');

    // Check for captions/subtitles
    const tracks = video.querySelectorAll('track[kind="captions"], track[kind="subtitles"]');
    const hasCaptions = tracks.length > 0;

    const issues: string[] = [];

    // Check for controls
    if (!hasControls) {
      issues.push(t('seo.embeddedContent.analyzers.videoMissingControls'));
      withoutControls++;
    }

    // Check for autoplay without mute
    if (hasAutoplay && !isMuted) {
      issues.push(t('seo.embeddedContent.analyzers.videoAutoplayNoMute'));
      withAutoplay++;
    }

    // Check for captions (accessibility)
    if (!hasCaptions) {
      issues.push(t('seo.embeddedContent.analyzers.videoNoCaptions'));
      withoutCaptions++;
    }

    // Check for poster image
    if (!poster) {
      issues.push(t('seo.embeddedContent.analyzers.videoNoPoster'));
    }

    items.push({
      src,
      sources,
      poster,
      hasControls,
      hasAutoplay,
      isMuted,
      hasLoop,
      preload,
      hasCaptions,
      issues,
    });
  });

  // Global issues
  if (withoutControls > 0) {
    globalIssues.push(t('seo.embeddedContent.analyzers.videosNoControls', { count: withoutControls }));
  }
  if (withAutoplay > 0) {
    globalIssues.push(t('seo.embeddedContent.analyzers.videosAutoplay', { count: withAutoplay }));
  }
  if (withoutCaptions > 0) {
    globalIssues.push(t('seo.embeddedContent.analyzers.videosNoCaptions', { count: withoutCaptions }));
  }

  // Determine status
  let status: SeoStatus = 'good';
  if (videoElements.length === 0) {
    status = 'info';
  } else if (withoutCaptions > videoElements.length / 2) {
    status = 'error';
  } else if (globalIssues.length > 0) {
    status = 'warning';
  }

  return {
    total: videoElements.length,
    items: items.slice(0, 10),
    issues: globalIssues,
    status,
  };
}

/**
 * Analyzes audio elements.
 */
function analyzeAudios(doc: Document): EmbeddedContentAnalysis['audios'] {
  const audioElements = Array.from(doc.querySelectorAll('audio'));
  const items: AudioItem[] = [];
  const globalIssues: string[] = [];

  let withoutControls = 0;
  let withAutoplay = 0;

  audioElements.forEach((audio) => {
    const src = audio.getAttribute('src');
    const sources = Array.from(audio.querySelectorAll('source')).map(
      (s) => s.getAttribute('src') || '',
    );
    const hasControls = audio.hasAttribute('controls');
    const hasAutoplay = audio.hasAttribute('autoplay');
    const isMuted = audio.hasAttribute('muted');
    const hasLoop = audio.hasAttribute('loop');
    const preload = audio.getAttribute('preload');

    const issues: string[] = [];

    // Check for controls
    if (!hasControls) {
      issues.push(t('seo.embeddedContent.analyzers.audioMissingControls'));
      withoutControls++;
    }

    // Check for autoplay
    if (hasAutoplay) {
      issues.push(t('seo.embeddedContent.analyzers.audioAutoplay'));
      withAutoplay++;
    }

    items.push({
      src,
      sources,
      hasControls,
      hasAutoplay,
      isMuted,
      hasLoop,
      preload,
      issues,
    });
  });

  // Global issues
  if (withoutControls > 0) {
    globalIssues.push(t('seo.embeddedContent.analyzers.audiosNoControls', { count: withoutControls }));
  }
  if (withAutoplay > 0) {
    globalIssues.push(t('seo.embeddedContent.analyzers.audiosAutoplay', { count: withAutoplay }));
  }

  // Determine status
  let status: SeoStatus = 'good';
  if (audioElements.length === 0) {
    status = 'info';
  } else if (withoutControls > audioElements.length / 2) {
    status = 'error';
  } else if (globalIssues.length > 0) {
    status = 'warning';
  }

  return {
    total: audioElements.length,
    items: items.slice(0, 10),
    issues: globalIssues,
    status,
  };
}
