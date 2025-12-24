<script setup lang="ts">
import { Loader, Image, Frame, ListOrdered, Check, X } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { LazyContentAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

defineProps<{
  lazyContent: LazyContentAnalysis;
}>();

const { t } = useI18n();
</script>

<template>
  <AnalysisSection :title="t('seo.lazyContent.title')" :status="lazyContent.status">
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Infinite Scroll -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <Loader class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.lazyContent.infiniteScroll') }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <component
              :is="lazyContent.hasInfiniteScroll ? Check : X"
              :class="['h-4 w-4', lazyContent.hasInfiniteScroll ? 'text-amber-500' : 'text-muted']"
              aria-hidden="true"
            />
            <span class="text-body">
              {{
                lazyContent.hasInfiniteScroll
                  ? t('seo.lazyContent.detected')
                  : t('seo.lazyContent.notDetected')
              }}
            </span>
          </div>
        </div>

        <!-- Lazy Images -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <Image class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.lazyContent.lazyImages') }}</span>
          </div>
          <p class="text-lg font-bold text-body">{{ lazyContent.lazyImageCount }}</p>
        </div>

        <!-- Lazy Iframes -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <Frame class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.lazyContent.lazyIframes') }}</span>
          </div>
          <p class="text-lg font-bold text-body">{{ lazyContent.lazyIframeCount }}</p>
        </div>

        <!-- Pagination -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <ListOrdered class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.lazyContent.pagination') }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <component
              :is="lazyContent.hasPagination ? Check : X"
              :class="['h-4 w-4', lazyContent.hasPagination ? 'text-green-500' : 'text-muted']"
              aria-hidden="true"
            />
            <span class="text-body">
              {{
                lazyContent.hasPagination
                  ? t('seo.lazyContent.hasPagination')
                  : t('seo.lazyContent.noPagination')
              }}
            </span>
          </div>
        </div>
      </div>

      <!-- Detected Patterns -->
      <div v-if="lazyContent.infiniteScrollPatterns.length > 0">
        <p class="text-sm font-medium text-body mb-2">{{ t('seo.lazyContent.patterns') }}</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(pattern, index) in lazyContent.infiniteScrollPatterns"
            :key="index"
            class="px-2 py-1 text-xs bg-surface rounded text-muted"
          >
            {{ pattern }}
          </span>
        </div>
      </div>

      <!-- Issues -->
      <div v-if="lazyContent.issues.length > 0" class="space-y-1">
        <p
          v-for="(issue, index) in lazyContent.issues"
          :key="index"
          class="text-sm text-amber-600 dark:text-amber-400"
        >
          • {{ issue }}
        </p>
      </div>

      <!-- Recommendations -->
      <div v-if="lazyContent.recommendations.length > 0">
        <p class="text-sm font-medium text-body mb-2">{{ t('seo.lazyContent.recommendations') }}</p>
        <div class="space-y-1">
          <p
            v-for="(rec, index) in lazyContent.recommendations"
            :key="index"
            class="text-xs text-muted"
          >
            • {{ rec }}
          </p>
        </div>
      </div>

      <p class="text-xs text-muted">{{ t('seo.lazyContent.description') }}</p>
    </div>
  </AnalysisSection>
</template>
