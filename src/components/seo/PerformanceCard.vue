<script setup lang="ts">
import { Gauge, Box, FileCode, Zap } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { PerformanceAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

defineProps<{
  performance: PerformanceAnalysis;
}>();

const { t } = useI18n();

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
</script>

<template>
  <AnalysisSection :title="t('seo.performance.title')" :status="performance.status">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="glass p-4 rounded-xl">
        <div class="flex items-center gap-2 text-muted mb-2">
          <FileCode class="h-4 w-4" aria-hidden="true" />
          <span class="text-xs uppercase tracking-wide">{{ t('seo.performance.htmlSize') }}</span>
        </div>
        <p class="text-xl font-bold text-body">{{ formatBytes(performance.htmlSize) }}</p>
        <p class="text-xs text-muted mt-1">
          {{
            performance.htmlSize <= 500000 ? t('seo.performance.good') : t('seo.performance.large')
          }}
        </p>
      </div>

      <div class="glass p-4 rounded-xl">
        <div class="flex items-center gap-2 text-muted mb-2">
          <Box class="h-4 w-4" aria-hidden="true" />
          <span class="text-xs uppercase tracking-wide">{{
            t('seo.performance.domElements')
          }}</span>
        </div>
        <p class="text-xl font-bold text-body">{{ performance.domElements.toLocaleString() }}</p>
        <p class="text-xs text-muted mt-1">
          {{
            performance.domElements <= 1500
              ? t('seo.performance.optimal')
              : t('seo.performance.complex')
          }}
        </p>
      </div>

      <div class="glass p-4 rounded-xl">
        <div class="flex items-center gap-2 text-muted mb-2">
          <Gauge class="h-4 w-4" aria-hidden="true" />
          <span class="text-xs uppercase tracking-wide">{{ t('seo.performance.domDepth') }}</span>
        </div>
        <p class="text-xl font-bold text-body">{{ performance.domDepth }}</p>
        <p class="text-xs text-muted mt-1">{{ t('seo.performance.levels') }}</p>
      </div>

      <div class="glass p-4 rounded-xl">
        <div class="flex items-center gap-2 text-muted mb-2">
          <Zap class="h-4 w-4" aria-hidden="true" />
          <span class="text-xs uppercase tracking-wide">{{ t('seo.performance.blocking') }}</span>
        </div>
        <p
          :class="[
            'text-xl font-bold',
            performance.blockingResources <= 3
              ? 'text-green-600 dark:text-green-400'
              : 'text-yellow-600 dark:text-yellow-400',
          ]"
        >
          {{ performance.blockingResources }}
        </p>
        <p class="text-xs text-muted mt-1">{{ t('seo.performance.resources') }}</p>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div class="flex justify-between">
        <span class="text-muted">{{ t('seo.performance.scripts') }}:</span>
        <span class="font-medium text-body">{{ performance.scriptsCount }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-muted">{{ t('seo.performance.stylesheets') }}:</span>
        <span class="font-medium text-body">{{ performance.stylesheetsCount }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-muted">{{ t('seo.performance.inlineScripts') }}:</span>
        <span class="font-medium text-body">{{ performance.inlineScripts }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-muted">{{ t('seo.performance.inlineStyles') }}:</span>
        <span class="font-medium text-body">{{ performance.inlineStyles }}</span>
      </div>
    </div>
  </AnalysisSection>
</template>
