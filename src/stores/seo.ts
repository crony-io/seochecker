/**
 * @fileoverview Pinia store for SEO analysis state management.
 */

import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { z } from 'zod';

import { analyzeSeo } from '@/analyzers';
import type { AnalysisState, FetchError, SeoAnalysisResult } from '@/types/seo';
import {
  analyzeRobotsTxt,
  analyzeSitemaps,
  type RobotsTxtAnalysis,
  type SitemapAnalysis,
} from '@/utils/robotsParser';
import { analyzeSecurityFull, type SecurityAnalysis } from '@/utils/securityAnalysis';
import { analyzeUrl, type UrlAnalysis } from '@/utils/urlAnalysis';
import {
  analyzeEmbeddedContent,
  type EmbeddedContentAnalysis,
} from '@/utils/embeddedContentAnalysis';
import { fetchWithProxy, normalizeUrl } from '@/utils/corsProxy';
import { createVersionedLocalStorage, makeStorageKey } from '@/utils/persistence';

const MAX_HISTORY_ITEMS = 10;

const historyItemSchema = z.object({
  url: z.string(),
  analyzedAt: z.string(),
  overallScore: z.number(),
});

const persistedSeoStateV1Schema = z.object({
  schemaVersion: z.literal(1),
  history: z.array(historyItemSchema),
});

type PersistedSeoStateV1 = z.infer<typeof persistedSeoStateV1Schema>;

const seoHistoryStorage = createVersionedLocalStorage<PersistedSeoStateV1>({
  key: makeStorageKey('seo', 'history'),
  latestVersion: 1,
  schemas: {
    1: persistedSeoStateV1Schema,
  },
  coerce: (input) => {
    if (Array.isArray(input)) {
      return { schemaVersion: 1, history: input as PersistedSeoStateV1['history'] };
    }
    return undefined;
  },
});

export interface HistoryItem {
  url: string;
  analyzedAt: string;
  overallScore: number;
}

export const useSeoStore = defineStore('seo', () => {
  const persisted = seoHistoryStorage.read();

  const url = ref('');
  const state = ref<AnalysisState>('idle');
  const result = ref<SeoAnalysisResult | null>(null);
  const error = ref<FetchError | null>(null);
  const history = ref<HistoryItem[]>(persisted?.history ?? []);
  const manualHtml = ref('');
  const showManualInput = ref(false);
  const robotsTxt = ref<RobotsTxtAnalysis | null>(null);
  const sitemap = ref<SitemapAnalysis | null>(null);
  const security = ref<SecurityAnalysis | null>(null);
  const urlAnalysis = ref<UrlAnalysis | null>(null);
  const embeddedContent = ref<EmbeddedContentAnalysis | null>(null);
  const isLoadingRobots = ref(false);
  const isLoadingSecurity = ref(false);

  const isLoading = computed(() => ['fetching', 'parsing', 'analyzing'].includes(state.value));
  const hasResult = computed(() => result.value !== null);
  const hasError = computed(() => error.value !== null);

  watch(
    history,
    (newHistory) => {
      const payload: PersistedSeoStateV1 = { schemaVersion: 1, history: newHistory };
      seoHistoryStorage.write(payload);
    },
    { deep: true },
  );

  function setUrl(newUrl: string): void {
    url.value = newUrl;
  }

  function reset(): void {
    state.value = 'idle';
    result.value = null;
    error.value = null;
    showManualInput.value = false;
    manualHtml.value = '';
    robotsTxt.value = null;
    sitemap.value = null;
    security.value = null;
    urlAnalysis.value = null;
    embeddedContent.value = null;
    isLoadingRobots.value = false;
    isLoadingSecurity.value = false;
  }

  function addToHistory(item: HistoryItem): void {
    const existingIndex = history.value.findIndex((h) => h.url === item.url);
    if (existingIndex !== -1) {
      history.value.splice(existingIndex, 1);
    }

    history.value.unshift(item);

    if (history.value.length > MAX_HISTORY_ITEMS) {
      history.value = history.value.slice(0, MAX_HISTORY_ITEMS);
    }
  }

  function clearHistory(): void {
    history.value = [];
  }

  async function analyze(targetUrl?: string): Promise<void> {
    const urlToAnalyze = normalizeUrl(targetUrl ?? url.value);
    if (!urlToAnalyze) {
      error.value = { type: 'invalid-url', message: 'Please enter a valid URL' };
      state.value = 'error';
      return;
    }

    reset();
    url.value = urlToAnalyze;
    state.value = 'fetching';
    error.value = null;

    const fetchResult = await fetchWithProxy(urlToAnalyze);

    if (fetchResult.ok === false) {
      error.value = fetchResult.error;
      state.value = 'error';
      showManualInput.value = true;
      return;
    }

    state.value = 'analyzing';

    try {
      const analysisResult = analyzeSeo(fetchResult.html, urlToAnalyze, fetchResult.duration);
      // Extract the parsed Document for reuse (parsed once in analyzeSeo)
      const { _doc: doc, ...resultWithoutDoc } = analysisResult;
      result.value = resultWithoutDoc;
      state.value = 'complete';

      addToHistory({
        url: urlToAnalyze,
        analyzedAt: analysisResult.analyzedAt,
        overallScore: analysisResult.overallScore,
      });

      // Perform URL and embedded content analysis (sync) - reuse parsed Document
      urlAnalysis.value = analyzeUrl(urlToAnalyze);
      embeddedContent.value = analyzeEmbeddedContent(doc);

      // Fetch robots.txt, sitemap, and security analysis in background - reuse Document
      fetchRobotsAndSitemap(urlToAnalyze);
      fetchSecurityAnalysis(urlToAnalyze, doc);
    } catch (err) {
      error.value = {
        type: 'unknown',
        message: err instanceof Error ? err.message : 'Analysis failed',
      };
      state.value = 'error';
    }
  }

  function analyzeManualHtml(): void {
    if (!manualHtml.value.trim()) {
      error.value = { type: 'unknown', message: 'Please paste HTML content' };
      return;
    }

    const targetUrl = normalizeUrl(url.value) || 'https://manual-input.local';
    state.value = 'analyzing';
    error.value = null;

    try {
      const analysisResult = analyzeSeo(manualHtml.value, targetUrl, 0);
      // Extract the parsed Document for reuse, store result without _doc
      const { _doc: doc, ...resultWithoutDoc } = analysisResult;
      result.value = resultWithoutDoc;
      state.value = 'complete';
      showManualInput.value = false;

      addToHistory({
        url: targetUrl,
        analyzedAt: analysisResult.analyzedAt,
        overallScore: analysisResult.overallScore,
      });

      // Perform additional analysis with reused Document
      urlAnalysis.value = analyzeUrl(targetUrl);
      embeddedContent.value = analyzeEmbeddedContent(doc);
    } catch (err) {
      error.value = {
        type: 'unknown',
        message: err instanceof Error ? err.message : 'Analysis failed',
      };
      state.value = 'error';
    }
  }

  function setManualHtml(html: string): void {
    manualHtml.value = html;
  }

  function toggleManualInput(): void {
    showManualInput.value = !showManualInput.value;
  }

  async function fetchRobotsAndSitemap(targetUrl: string): Promise<void> {
    isLoadingRobots.value = true;
    robotsTxt.value = null;
    sitemap.value = null;

    try {
      const robotsResult = await analyzeRobotsTxt(targetUrl);
      robotsTxt.value = robotsResult;

      const sitemapResult = await analyzeSitemaps(targetUrl, robotsResult.sitemaps);
      sitemap.value = sitemapResult;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[SEO Store] Robots.txt/sitemap analysis failed:', error);
      }
    } finally {
      isLoadingRobots.value = false;
    }
  }

  async function fetchSecurityAnalysis(targetUrl: string, doc: Document): Promise<void> {
    isLoadingSecurity.value = true;
    security.value = null;

    try {
      const securityResult = await analyzeSecurityFull(targetUrl, doc);
      security.value = securityResult;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[SEO Store] Security analysis failed:', error);
      }
    } finally {
      isLoadingSecurity.value = false;
    }
  }

  return {
    url,
    state,
    result,
    error,
    history,
    manualHtml,
    showManualInput,
    robotsTxt,
    sitemap,
    security,
    urlAnalysis,
    embeddedContent,
    isLoadingRobots,
    isLoadingSecurity,
    isLoading,
    hasResult,
    hasError,
    setUrl,
    reset,
    analyze,
    analyzeManualHtml,
    setManualHtml,
    toggleManualInput,
    clearHistory,
    fetchRobotsAndSitemap,
    fetchSecurityAnalysis,
  };
});
