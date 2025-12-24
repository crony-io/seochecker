<script setup lang="ts">
import { Server, Monitor, Layers, HelpCircle, Check, X } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { RenderingAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

const props = defineProps<{
  rendering: RenderingAnalysis;
}>();

const { t } = useI18n();

const renderingIcon = computed(() => {
  switch (props.rendering.renderingType) {
    case 'ssr':
      return Server;
    case 'csr':
      return Monitor;
    case 'hybrid':
      return Layers;
    default:
      return HelpCircle;
  }
});

const renderingLabel = computed(() => {
  const key = props.rendering.renderingType;
  return t(`seo.rendering.${key}`);
});

const renderingColor = computed(() => {
  switch (props.rendering.renderingType) {
    case 'ssr':
    case 'hybrid':
    case 'static':
      return 'text-green-600 dark:text-green-400 bg-green-500/10';
    case 'csr':
      return 'text-amber-600 dark:text-amber-400 bg-amber-500/10';
    default:
      return 'text-blue-600 dark:text-blue-400 bg-blue-500/10';
  }
});
</script>

<template>
  <AnalysisSection :title="t('seo.rendering.title')" :status="rendering.status">
    <div class="space-y-4">
      <!-- Rendering Type -->
      <div class="flex items-center gap-4">
        <div :class="['px-4 py-2 rounded-lg flex items-center gap-2', renderingColor]">
          <component :is="renderingIcon" class="h-5 w-5" aria-hidden="true" />
          <span class="font-medium">{{ renderingLabel }}</span>
        </div>
        <span class="text-sm text-muted">
          {{ t('seo.rendering.confidence') }}: {{ rendering.confidence }}%
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Noscript Fallback -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <span class="font-medium text-sm">{{ t('seo.rendering.noscriptFallback') }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <component
              :is="rendering.hasNoscriptFallback ? Check : X"
              :class="[
                'h-4 w-4',
                rendering.hasNoscriptFallback ? 'text-green-500' : 'text-red-500',
              ]"
              aria-hidden="true"
            />
            <span :class="rendering.hasNoscriptFallback ? 'text-body' : 'text-muted'">
              {{
                rendering.hasNoscriptFallback
                  ? t('seo.lazyContent.detected')
                  : t('seo.lazyContent.notDetected')
              }}
            </span>
          </div>
        </div>

        <!-- Hydration Markers -->
        <div v-if="rendering.hydrationMarkers.length > 0" class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <span class="font-medium text-sm">{{ t('seo.rendering.hydrationMarkers') }}</span>
          </div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="(marker, index) in rendering.hydrationMarkers.slice(0, 4)"
              :key="index"
              class="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded"
            >
              {{ marker }}
            </span>
          </div>
        </div>
      </div>

      <!-- Indicators -->
      <div v-if="rendering.indicators.length > 0">
        <p class="text-sm font-medium text-body mb-2">{{ t('seo.rendering.indicators') }}</p>
        <div class="space-y-1">
          <p
            v-for="(indicator, index) in rendering.indicators.slice(0, 5)"
            :key="index"
            class="text-xs text-muted"
          >
            • {{ indicator.indicator }}
          </p>
        </div>
      </div>

      <!-- Issues -->
      <div v-if="rendering.issues.length > 0" class="space-y-1">
        <p
          v-for="(issue, index) in rendering.issues"
          :key="index"
          class="text-sm text-amber-600 dark:text-amber-400"
        >
          • {{ issue }}
        </p>
      </div>

      <p class="text-xs text-muted">{{ t('seo.rendering.description') }}</p>
    </div>
  </AnalysisSection>
</template>
