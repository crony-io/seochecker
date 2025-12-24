<script setup lang="ts">
import { Image, AlertTriangle } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { ImagesAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

defineProps<{
  images: ImagesAnalysis;
}>();

const { t } = useI18n();
</script>

<template>
  <AnalysisSection :title="t('seo.images.title')" :status="images.status">
    <div class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass p-4 rounded-xl text-center">
          <p class="text-2xl font-bold text-body">{{ images.total }}</p>
          <p class="text-xs text-muted mt-1">{{ t('seo.images.total') }}</p>
        </div>
        <div class="glass p-4 rounded-xl text-center">
          <p
            :class="[
              'text-2xl font-bold',
              images.withoutAlt === 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
            ]"
          >
            {{ images.withoutAlt }}
          </p>
          <p class="text-xs text-muted mt-1">{{ t('seo.images.missingAlt') }}</p>
        </div>
        <div class="glass p-4 rounded-xl text-center">
          <p class="text-2xl font-bold text-body">{{ images.withLazyLoading }}</p>
          <p class="text-xs text-muted mt-1">{{ t('seo.images.lazyLoading') }}</p>
        </div>
        <div class="glass p-4 rounded-xl text-center">
          <p class="text-2xl font-bold text-body">{{ Object.keys(images.formats).length }}</p>
          <p class="text-xs text-muted mt-1">{{ t('seo.images.formats') }}</p>
        </div>
      </div>

      <div v-if="Object.keys(images.formats).length > 0" class="flex flex-wrap gap-2">
        <span
          v-for="(count, format) in images.formats"
          :key="format"
          class="px-3 py-1 text-sm rounded-full bg-surface border border-border"
        >
          {{ format }}: {{ count }}
        </span>
      </div>

      <div
        v-if="images.items.length > 0 && images.withoutAlt > 0"
        class="border-t border-border pt-4"
      >
        <h4 class="text-sm font-semibold text-body mb-3">{{ t('seo.images.issues') }}</h4>
        <div class="space-y-2 max-h-[300px] overflow-y-auto scrollbar">
          <div
            v-for="(image, index) in images.items.filter((img) => img.issues.length > 0)"
            :key="index"
            class="flex items-start gap-3 p-2 rounded-lg bg-red-500/5 border border-red-500/10"
          >
            <Image class="h-4 w-4 text-muted shrink-0 mt-0.5" aria-hidden="true" />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-body truncate">{{ image.src || t('seo.images.noSrc') }}</p>
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="(issue, issueIndex) in image.issues"
                  :key="issueIndex"
                  class="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400"
                >
                  <AlertTriangle class="h-3 w-3" aria-hidden="true" />
                  {{ issue }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-else-if="images.total === 0" class="text-sm text-muted">
        {{ t('seo.images.noImages') }}
      </p>
    </div>
  </AnalysisSection>
</template>
