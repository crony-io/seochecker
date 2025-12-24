<script setup lang="ts">
import { Globe, Loader2, ArrowLeftRight, X } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { SeoAnalysisResult, SeoStatus } from '@/types/seo';
import { analyzeSeo } from '@/analyzers';
import { fetchWithProxy, normalizeUrl } from '@/utils/corsProxy';
import ScoreCard from '@/components/seo/ScoreCard.vue';

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n();

const url1 = ref('');
const url2 = ref('');
const result1 = ref<SeoAnalysisResult | null>(null);
const result2 = ref<SeoAnalysisResult | null>(null);
const isLoading1 = ref(false);
const isLoading2 = ref(false);
const error1 = ref<string | null>(null);
const error2 = ref<string | null>(null);

const canCompare = computed(() => {
  return url1.value.trim() && url2.value.trim() && !isLoading1.value && !isLoading2.value;
});

const hasResults = computed(() => result1.value && result2.value);

async function analyzeUrl(
  url: string,
  setResult: (r: SeoAnalysisResult | null) => void,
  setLoading: (v: boolean) => void,
  setError: (e: string | null) => void,
): Promise<void> {
  const normalizedUrl = normalizeUrl(url);
  if (!normalizedUrl) {
    setError('Invalid URL');
    return;
  }

  setLoading(true);
  setError(null);

  const fetchResult = await fetchWithProxy(normalizedUrl);

  if (fetchResult.ok === false) {
    setError(fetchResult.error.message);
    setLoading(false);
    return;
  }

  try {
    const analysis = analyzeSeo(fetchResult.html, normalizedUrl, fetchResult.duration);
    setResult(analysis);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Analysis failed');
  } finally {
    setLoading(false);
  }
}

async function handleCompare(): Promise<void> {
  if (!canCompare.value) {
    return;
  }

  await Promise.all([
    analyzeUrl(
      url1.value,
      (r) => (result1.value = r),
      (v) => (isLoading1.value = v),
      (e) => (error1.value = e),
    ),
    analyzeUrl(
      url2.value,
      (r) => (result2.value = r),
      (v) => (isLoading2.value = v),
      (e) => (error2.value = e),
    ),
  ]);
}

function getStatusClass(status: SeoStatus): string {
  switch (status) {
    case 'good':
      return 'text-green-500';
    case 'warning':
      return 'text-yellow-500';
    case 'error':
      return 'text-red-500';
    default:
      return 'text-blue-500';
  }
}

interface ComparisonRow {
  label: string;
  value1: string | number;
  value2: string | number;
  status1?: SeoStatus;
  status2?: SeoStatus;
  higherIsBetter?: boolean;
}

const comparisonRows = computed<ComparisonRow[]>(() => {
  if (!result1.value || !result2.value) {
    return [];
  }

  return [
    {
      label: t('seo.comparison.overallScore'),
      value1: result1.value.overallScore,
      value2: result2.value.overallScore,
      higherIsBetter: true,
    },
    {
      label: t('seo.meta.pageTitle'),
      value1: `${result1.value.meta.title.length} ${t('seo.meta.chars')}`,
      value2: `${result2.value.meta.title.length} ${t('seo.meta.chars')}`,
      status1: result1.value.meta.title.status,
      status2: result2.value.meta.title.status,
    },
    {
      label: t('seo.meta.description'),
      value1: `${result1.value.meta.description.length} ${t('seo.meta.chars')}`,
      value2: `${result2.value.meta.description.length} ${t('seo.meta.chars')}`,
      status1: result1.value.meta.description.status,
      status2: result2.value.meta.description.status,
    },
    {
      label: t('seo.headings.h1Count'),
      value1: result1.value.headings.h1Count,
      value2: result2.value.headings.h1Count,
      status1: result1.value.headings.status,
      status2: result2.value.headings.status,
    },
    {
      label: t('seo.content.words'),
      value1: result1.value.content.wordCount.toLocaleString(),
      value2: result2.value.content.wordCount.toLocaleString(),
      higherIsBetter: true,
    },
    {
      label: t('seo.content.readTime'),
      value1: `${result1.value.content.readingTimeMinutes} ${t('seo.content.minutes')}`,
      value2: `${result2.value.content.readingTimeMinutes} ${t('seo.content.minutes')}`,
    },
    {
      label: t('seo.content.textHtmlRatio'),
      value1: `${result1.value.content.textToHtmlRatio}%`,
      value2: `${result2.value.content.textToHtmlRatio}%`,
      higherIsBetter: true,
    },
    {
      label: t('seo.images.total'),
      value1: result1.value.images.total,
      value2: result2.value.images.total,
    },
    {
      label: t('seo.images.missingAlt'),
      value1: result1.value.images.withoutAlt,
      value2: result2.value.images.withoutAlt,
      higherIsBetter: false,
    },
    {
      label: t('seo.links.internal'),
      value1: result1.value.links.internal,
      value2: result2.value.links.internal,
      higherIsBetter: true,
    },
    {
      label: t('seo.links.external'),
      value1: result1.value.links.external,
      value2: result2.value.links.external,
    },
    {
      label: t('seo.performance.domElements'),
      value1: result1.value.performance.domElements.toLocaleString(),
      value2: result2.value.performance.domElements.toLocaleString(),
      higherIsBetter: false,
    },
  ];
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-body flex items-center gap-2">
        <ArrowLeftRight class="h-5 w-5 text-accent" aria-hidden="true" />
        {{ t('seo.comparison.title') }}
      </h2>
      <button
        type="button"
        class="p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-body transition-colors"
        @click="emit('close')"
      >
        <X class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>

    <!-- URL Inputs -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label for="compare-url-1" class="text-sm font-medium text-body">{{
          t('seo.comparison.url1')
        }}</label>
        <div class="relative">
          <Globe
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="compare-url-1"
            v-model="url1"
            type="text"
            name="compare-url-1"
            :placeholder="t('seo.urlInput.placeholder')"
            class="form-control pl-10"
            :disabled="isLoading1"
            autocomplete="url"
          />
        </div>
        <p v-if="error1" class="text-xs text-red-500">{{ error1 }}</p>
      </div>

      <div class="space-y-2">
        <label for="compare-url-2" class="text-sm font-medium text-body">{{
          t('seo.comparison.url2')
        }}</label>
        <div class="relative">
          <Globe
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="compare-url-2"
            v-model="url2"
            type="text"
            name="compare-url-2"
            :placeholder="t('seo.urlInput.placeholder')"
            class="form-control pl-10"
            :disabled="isLoading2"
            autocomplete="url"
          />
        </div>
        <p v-if="error2" class="text-xs text-red-500">{{ error2 }}</p>
      </div>
    </div>

    <button
      type="button"
      class="btn-primary w-full flex items-center justify-center gap-2"
      :disabled="!canCompare"
      @click="handleCompare"
    >
      <Loader2 v-if="isLoading1 || isLoading2" class="h-5 w-5 animate-spin" aria-hidden="true" />
      <ArrowLeftRight v-else class="h-5 w-5" aria-hidden="true" />
      {{ isLoading1 || isLoading2 ? t('seo.comparison.analyzing') : t('seo.comparison.compare') }}
    </button>

    <!-- Results -->
    <div v-if="hasResults" class="space-y-6">
      <!-- Score Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <p class="text-sm text-muted truncate">{{ result1!.url }}</p>
          <ScoreCard :score="result1!.overallScore" :label="t('seo.results.overallScore')" />
        </div>
        <div class="space-y-2">
          <p class="text-sm text-muted truncate">{{ result2!.url }}</p>
          <ScoreCard :score="result2!.overallScore" :label="t('seo.results.overallScore')" />
        </div>
      </div>

      <!-- Comparison Table -->
      <div class="glass-card overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left p-4 text-sm font-semibold text-body">
                {{ t('seo.comparison.metric') }}
              </th>
              <th class="text-center p-4 text-sm font-semibold text-body">
                {{ t('seo.comparison.url1') }}
              </th>
              <th class="text-center p-4 text-sm font-semibold text-body">
                {{ t('seo.comparison.url2') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in comparisonRows"
              :key="index"
              class="border-b border-border last:border-0"
            >
              <td class="p-4 text-sm text-body">{{ row.label }}</td>
              <td class="p-4 text-center">
                <span
                  :class="[
                    'text-sm font-medium',
                    row.status1 ? getStatusClass(row.status1) : 'text-body',
                  ]"
                >
                  {{ row.value1 }}
                </span>
              </td>
              <td class="p-4 text-center">
                <span
                  :class="[
                    'text-sm font-medium',
                    row.status2 ? getStatusClass(row.status2) : 'text-body',
                  ]"
                >
                  {{ row.value2 }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
