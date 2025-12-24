<script setup lang="ts">
import { Gauge, LayoutDashboard, MousePointer, Zap } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { CoreWebVitalsAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

const props = defineProps<{
  coreWebVitals: CoreWebVitalsAnalysis;
}>();

const { t } = useI18n();

function getEstimateColor(estimate: string): string {
  switch (estimate) {
    case 'good':
      return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
    case 'needs-improvement':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'poor':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
  }
}

function getEstimateLabel(estimate: string): string {
  switch (estimate) {
    case 'good':
      return t('seo.coreWebVitals.good');
    case 'needs-improvement':
      return t('seo.coreWebVitals.needsImprovement');
    case 'poor':
      return t('seo.coreWebVitals.poor');
    default:
      return t('seo.coreWebVitals.unknown');
  }
}

const metrics = computed(() => [
  {
    key: 'lcp',
    label: t('seo.coreWebVitals.lcp'),
    icon: Gauge,
    estimate: props.coreWebVitals.lcp.estimate,
    factors: props.coreWebVitals.lcp.factors,
    extra: props.coreWebVitals.lcp.largestElement,
  },
  {
    key: 'cls',
    label: t('seo.coreWebVitals.cls'),
    icon: LayoutDashboard,
    estimate: props.coreWebVitals.cls.estimate,
    factors: props.coreWebVitals.cls.factors,
    extra: null,
  },
  {
    key: 'inp',
    label: t('seo.coreWebVitals.inp'),
    icon: MousePointer,
    estimate: props.coreWebVitals.inp.estimate,
    factors: props.coreWebVitals.inp.factors,
    extra: null,
  },
  {
    key: 'fid',
    label: t('seo.coreWebVitals.fid'),
    icon: Zap,
    estimate: props.coreWebVitals.fid.estimate,
    factors: props.coreWebVitals.fid.factors,
    extra: null,
  },
]);
</script>

<template>
  <AnalysisSection :title="t('seo.coreWebVitals.title')" :status="coreWebVitals.overallStatus">
    <div class="space-y-4">
      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="metric in metrics" :key="metric.key" class="p-4 rounded-lg border bg-surface">
          <div class="flex items-center gap-2 mb-3">
            <component :is="metric.icon" class="h-5 w-5 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm text-body">{{ metric.label }}</span>
          </div>
          <div
            :class="[
              'inline-flex px-3 py-1 rounded-full text-xs font-medium border',
              getEstimateColor(metric.estimate),
            ]"
          >
            {{ getEstimateLabel(metric.estimate) }}
          </div>
          <p v-if="metric.extra" class="text-xs text-muted mt-2 truncate">
            {{ t('seo.coreWebVitals.largestElement') }}: {{ metric.extra }}
          </p>
        </div>
      </div>

      <!-- Factors -->
      <div v-if="coreWebVitals.lcp.factors.length > 0 || coreWebVitals.cls.factors.length > 0">
        <p class="text-sm font-medium text-body mb-2">{{ t('seo.coreWebVitals.factors') }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div
            v-for="(factor, index) in [
              ...coreWebVitals.lcp.factors,
              ...coreWebVitals.cls.factors,
            ].slice(0, 6)"
            :key="index"
            :class="[
              'p-2 rounded text-xs',
              factor.impact === 'positive'
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : factor.impact === 'negative'
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                  : 'bg-surface text-muted',
            ]"
          >
            <span class="font-medium">{{ factor.factor }}</span>
            <span
              v-if="'description' in factor && factor.description"
              class="block text-xs opacity-80"
              >{{ factor.description }}</span
            >
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="coreWebVitals.recommendations.length > 0">
        <p class="text-sm font-medium text-body mb-2">
          {{ t('seo.coreWebVitals.recommendations') }}
        </p>
        <div class="space-y-1">
          <p
            v-for="(rec, index) in coreWebVitals.recommendations.slice(0, 5)"
            :key="index"
            class="text-xs text-muted"
          >
            • {{ rec }}
          </p>
        </div>
      </div>

      <p class="text-xs text-muted">{{ t('seo.coreWebVitals.description') }}</p>
    </div>
  </AnalysisSection>
</template>
