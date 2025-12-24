<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { AnchorTextAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

const props = defineProps<{
  anchorText: AnchorTextAnalysis;
}>();

const { t } = useI18n();

const descriptivePercentage = computed(() => {
  if (props.anchorText.total === 0) {
    return 0;
  }
  return Math.round((props.anchorText.descriptive / props.anchorText.total) * 100);
});

const genericPercentage = computed(() => {
  if (props.anchorText.total === 0) {
    return 0;
  }
  return Math.round((props.anchorText.generic / props.anchorText.total) * 100);
});
</script>

<template>
  <AnalysisSection :title="t('seo.anchorText.title')" :status="anchorText.status">
    <div class="space-y-4">
      <!-- Summary Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="text-center p-3 rounded-lg bg-surface">
          <p class="text-2xl font-bold text-body">{{ anchorText.total }}</p>
          <p class="text-xs text-muted">{{ t('seo.anchorText.total') }}</p>
        </div>
        <div class="text-center p-3 rounded-lg bg-green-500/10">
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ anchorText.descriptive }}
          </p>
          <p class="text-xs text-muted">{{ t('seo.anchorText.descriptive') }}</p>
        </div>
        <div class="text-center p-3 rounded-lg bg-yellow-500/10">
          <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {{ anchorText.generic }}
          </p>
          <p class="text-xs text-muted">{{ t('seo.anchorText.generic') }}</p>
        </div>
        <div class="text-center p-3 rounded-lg bg-orange-500/10">
          <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {{ anchorText.overOptimized }}
          </p>
          <p class="text-xs text-muted">{{ t('seo.anchorText.overOptimized') }}</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-muted">{{ t('seo.anchorText.quality') }}</span>
          <span class="font-medium text-body"
            >{{ descriptivePercentage }}% {{ t('seo.anchorText.descriptive') }}</span
          >
        </div>
        <div class="h-2 bg-surface rounded-full overflow-hidden flex">
          <div
            class="h-full bg-green-500 transition-all duration-500"
            :style="{ width: `${descriptivePercentage}%` }"
          />
          <div
            class="h-full bg-yellow-500 transition-all duration-500"
            :style="{ width: `${genericPercentage}%` }"
          />
        </div>
      </div>

      <!-- Generic Texts Found -->
      <div v-if="anchorText.genericTexts.length > 0">
        <h4 class="text-sm font-medium text-body mb-2">
          {{ t('seo.anchorText.genericFound') }}
        </h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(text, index) in anchorText.genericTexts"
            :key="index"
            class="px-2 py-1 text-xs rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
          >
            "{{ text }}"
          </span>
        </div>
      </div>

      <!-- Issues -->
      <div v-if="anchorText.issues.length > 0" class="space-y-2">
        <div
          v-for="(issue, index) in anchorText.issues"
          :key="index"
          class="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/10"
        >
          <AlertTriangle class="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" aria-hidden="true" />
          <p class="text-xs text-body">{{ issue }}</p>
        </div>
      </div>

      <p class="text-xs text-muted">{{ t('seo.anchorText.description') }}</p>
    </div>
  </AnalysisSection>
</template>
