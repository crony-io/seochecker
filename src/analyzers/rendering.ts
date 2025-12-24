/**
 * @fileoverview CSR vs SSR detection and rendering analysis.
 */

import type { SeoStatus } from '@/types/seo';
import { SUBSTANTIAL_CONTENT_LENGTH, NOSCRIPT_MIN_LENGTH } from '@/constants/seo';

export interface RenderingAnalysis {
  renderingType: 'ssr' | 'csr' | 'hybrid' | 'static' | 'unknown';
  confidence: number;
  indicators: RenderingIndicator[];
  hasNoscriptFallback: boolean;
  noscriptContent: string | null;
  appContainerEmpty: boolean;
  hydrationMarkers: string[];
  issues: string[];
  status: SeoStatus;
}

export interface RenderingIndicator {
  type: 'ssr' | 'csr';
  indicator: string;
  weight: number;
}

const CSR_FRAMEWORKS = [
  { pattern: /__NEXT_DATA__/i, name: 'Next.js (hydration)', type: 'hybrid' as const },
  { pattern: /__NUXT__/i, name: 'Nuxt.js (hydration)', type: 'hybrid' as const },
  { pattern: /window\.__INITIAL_STATE__/i, name: 'Vuex initial state', type: 'hybrid' as const },
  {
    pattern: /window\.__PRELOADED_STATE__/i,
    name: 'Redux preloaded state',
    type: 'hybrid' as const,
  },
  { pattern: /data-reactroot/i, name: 'React root', type: 'hybrid' as const },
  { pattern: /data-v-[a-f0-9]+/i, name: 'Vue scoped styles', type: 'hybrid' as const },
  { pattern: /ng-version/i, name: 'Angular', type: 'hybrid' as const },
  { pattern: /_sveltekit/i, name: 'SvelteKit', type: 'hybrid' as const },
];

const CSR_ONLY_PATTERNS = [
  { pattern: /<div id="root"><\/div>/i, name: 'Empty React root' },
  { pattern: /<div id="app"><\/div>/i, name: 'Empty Vue app container' },
  { pattern: /<app-root><\/app-root>/i, name: 'Empty Angular root' },
  { pattern: /ReactDOM\.render/i, name: 'ReactDOM.render call' },
  { pattern: /createApp\s*\(\s*App\s*\)/i, name: 'Vue createApp' },
];

const SSR_INDICATORS = [
  { pattern: /data-server-rendered/i, name: 'Vue SSR marker' },
  { pattern: /data-reactid/i, name: 'React SSR marker (legacy)' },
  { pattern: /<!--\s*\/?(?:nuxt|next)/i, name: 'SSR framework comment' },
];

/**
 * Analyzes rendering type (CSR, SSR, hybrid, static).
 */
export function analyzeRendering(doc: Document, html: string): RenderingAnalysis {
  const indicators: RenderingIndicator[] = [];
  const issues: string[] = [];
  const hydrationMarkers: string[] = [];

  let ssrScore = 0;
  let csrScore = 0;

  // Check for meaningful body content (SSR indicator)
  const bodyText = doc.body?.textContent?.trim() || '';
  const hasSubstantialContent = bodyText.length > SUBSTANTIAL_CONTENT_LENGTH;

  if (hasSubstantialContent) {
    ssrScore += 3;
    indicators.push({
      type: 'ssr',
      indicator: 'Substantial text content in HTML',
      weight: 3,
    });
  }

  // Check for empty app containers (CSR indicator)
  const emptyContainers = CSR_ONLY_PATTERNS.some((p) => p.pattern.test(html));
  const appContainerEmpty = emptyContainers && !hasSubstantialContent;

  if (appContainerEmpty) {
    csrScore += 5;
    indicators.push({
      type: 'csr',
      indicator: 'Empty application container detected',
      weight: 5,
    });
    issues.push(
      'Page appears to be client-side rendered - content may not be indexed by search engines',
    );
  }

  // Check for SSR framework markers
  SSR_INDICATORS.forEach(({ pattern, name }) => {
    if (pattern.test(html)) {
      ssrScore += 2;
      hydrationMarkers.push(name);
      indicators.push({
        type: 'ssr',
        indicator: name,
        weight: 2,
      });
    }
  });

  // Check for hydration/hybrid framework patterns
  CSR_FRAMEWORKS.forEach(({ pattern, name }) => {
    if (pattern.test(html)) {
      hydrationMarkers.push(name);
      // Hybrid frameworks contribute to both scores slightly
      ssrScore += 1;
      indicators.push({
        type: 'ssr',
        indicator: `${name} detected (likely SSR with hydration)`,
        weight: 1,
      });
    }
  });

  // Check for CSR-only patterns
  CSR_ONLY_PATTERNS.forEach(({ pattern, name }) => {
    if (pattern.test(html)) {
      csrScore += 2;
      indicators.push({
        type: 'csr',
        indicator: name,
        weight: 2,
      });
    }
  });

  // Check for noscript fallback
  const noscriptElements = doc.querySelectorAll('noscript');
  const hasNoscriptFallback = noscriptElements.length > 0;
  let noscriptContent: string | null = null;

  if (hasNoscriptFallback) {
    const mainNoscript = Array.from(noscriptElements).find(
      (el) => (el.textContent?.length || 0) > NOSCRIPT_MIN_LENGTH,
    );
    noscriptContent = mainNoscript?.textContent?.trim().slice(0, 200) || null;

    if (noscriptContent && noscriptContent.length > NOSCRIPT_MIN_LENGTH) {
      ssrScore += 1;
      indicators.push({
        type: 'ssr',
        indicator: 'Has meaningful noscript fallback',
        weight: 1,
      });
    }
  }

  // Check heading structure (SSR typically has proper headings)
  const hasHeadings = doc.querySelectorAll('h1, h2, h3').length > 0;
  if (hasHeadings && hasSubstantialContent) {
    ssrScore += 1;
    indicators.push({
      type: 'ssr',
      indicator: 'Proper heading structure in initial HTML',
      weight: 1,
    });
  }

  // Determine rendering type
  let renderingType: RenderingAnalysis['renderingType'] = 'unknown';
  const totalScore = ssrScore + csrScore;
  let confidence = 0;

  if (totalScore > 0) {
    if (ssrScore > csrScore * 2) {
      renderingType = hydrationMarkers.length > 0 ? 'hybrid' : 'ssr';
      confidence = Math.min(100, (ssrScore / totalScore) * 100);
    } else if (csrScore > ssrScore * 2) {
      renderingType = 'csr';
      confidence = Math.min(100, (csrScore / totalScore) * 100);
    } else if (hydrationMarkers.length > 0) {
      renderingType = 'hybrid';
      confidence = 60;
    } else if (hasSubstantialContent && !emptyContainers) {
      renderingType = 'static';
      confidence = 50;
    }
  }

  // Determine status
  let status: SeoStatus = 'good';
  if (renderingType === 'csr') {
    status = 'warning';
    if (!hasNoscriptFallback) {
      issues.push('No noscript fallback for JavaScript-disabled users/crawlers');
      status = 'error';
    }
  } else if (renderingType === 'unknown') {
    status = 'info';
  }

  return {
    renderingType,
    confidence: Math.round(confidence),
    indicators,
    hasNoscriptFallback,
    noscriptContent,
    appContainerEmpty,
    hydrationMarkers,
    issues,
    status,
  };
}
