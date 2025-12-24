<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Comparison Mode -->
    <section v-if="showComparison">
      <ComparisonView @close="showComparison = false" />
    </section>

    <!-- Normal Mode -->
    <section v-else-if="!hasResult" class="text-center py-8">
      <h1 class="text-3xl md:text-4xl font-bold text-body mb-4">
        {{ t('seo.hero.title') }}
      </h1>
      <p class="text-lg text-muted max-w-2xl mx-auto mb-8">
        {{ t('seo.hero.description') }}
      </p>
      <UrlInput />

      <button
        type="button"
        class="mt-6 text-sm text-accent hover:underline flex items-center gap-2 mx-auto"
        @click="showComparison = true"
      >
        <ArrowLeftRight class="h-4 w-4" aria-hidden="true" />
        {{ t('seo.comparison.title') }}
      </button>
    </section>

    <section v-else-if="isLoading">
      <LoadingSkeleton />
    </section>

    <section v-else-if="hasResult">
      <AnalysisResults />
    </section>

    <section v-if="!showComparison && !isLoading && !hasResult && history.length > 0" class="mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-body">{{ t('seo.history.title') }}</h2>
        <button
          type="button"
          class="text-sm text-muted hover:text-body transition-colors"
          @click="clearHistory"
        >
          {{ t('seo.history.clear') }}
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="item in history"
          :key="item.url + item.analyzedAt"
          type="button"
          class="glass-card p-4 text-left hover:bg-surface-hover transition-colors"
          @click="analyzeFromHistory(item.url)"
        >
          <p class="text-sm font-medium text-body truncate">{{ item.url }}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs text-muted">
              {{ new Date(item.analyzedAt).toLocaleDateString() }}
            </span>
            <span
              :class="[
                'text-sm font-bold',
                item.overallScore >= 80
                  ? 'text-green-500'
                  : item.overallScore >= 60
                    ? 'text-yellow-500'
                    : item.overallScore >= 40
                      ? 'text-orange-500'
                      : 'text-red-500',
              ]"
            >
              {{ item.overallScore }}
            </span>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview Home page with SEO analyzer functionality.
 */
import { ArrowLeftRight } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import AnalysisResults from '@/components/seo/AnalysisResults.vue';
import ComparisonView from '@/components/seo/ComparisonView.vue';
import LoadingSkeleton from '@/components/seo/LoadingSkeleton.vue';
import UrlInput from '@/components/seo/UrlInput.vue';
import { useSeoStore } from '@/stores/seo';

const { t } = useI18n();
const seoStore = useSeoStore();
const { hasResult, history, isLoading } = storeToRefs(seoStore);

const showComparison = ref(false);

function analyzeFromHistory(url: string): void {
  seoStore.analyze(url);
}

function clearHistory(): void {
  seoStore.clearHistory();
}
</script>
