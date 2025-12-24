<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { KeywordsAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';
import KeywordCloud from '@/components/seo/KeywordCloud.vue';
defineProps<{
  keywords: KeywordsAnalysis;
}>();

const { t } = useI18n();
</script>

<template>
  <AnalysisSection :title="t('seo.keywords.title')" :status="keywords.status">
    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 text-sm">
        <div class="flex items-center gap-2">
          <span class="text-muted">{{ t('seo.keywords.totalWords') }}:</span>
          <span class="font-semibold text-body">{{ keywords.totalWords.toLocaleString() }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-muted">{{ t('seo.keywords.uniqueWords') }}:</span>
          <span class="font-semibold text-body">{{ keywords.uniqueWords.toLocaleString() }}</span>
        </div>
      </div>

      <div v-if="keywords.topKeywords.length > 0" class="border-t border-border pt-4">
        <h4 class="text-sm font-semibold text-body mb-3">{{ t('seo.keywords.topKeywords') }}</h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="keyword in keywords.topKeywords.slice(0, 15)"
            :key="keyword.word"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-sm"
          >
            <span class="font-medium text-body">{{ keyword.word }}</span>
            <span class="text-xs text-muted">({{ keyword.count }})</span>
            <span class="text-xs text-accent">{{ keyword.density }}%</span>
          </span>
        </div>
      </div>

      <div class="border-t border-border pt-4">
        <h4 class="text-sm font-semibold text-body mb-3">{{ t('seo.keywords.consistency') }}</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="glass p-3 rounded-lg">
            <p class="text-xs text-muted uppercase tracking-wide mb-1">
              {{ t('seo.keywords.inTitle') }}
            </p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="word in keywords.consistency.inTitle"
                :key="word"
                class="px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-xs"
              >
                {{ word }}
              </span>
              <span v-if="keywords.consistency.inTitle.length === 0" class="text-xs text-muted">
                {{ t('seo.keywords.noMatch') }}
              </span>
            </div>
          </div>

          <div class="glass p-3 rounded-lg">
            <p class="text-xs text-muted uppercase tracking-wide mb-1">
              {{ t('seo.keywords.inDescription') }}
            </p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="word in keywords.consistency.inDescription"
                :key="word"
                class="px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-xs"
              >
                {{ word }}
              </span>
              <span
                v-if="keywords.consistency.inDescription.length === 0"
                class="text-xs text-muted"
              >
                {{ t('seo.keywords.noMatch') }}
              </span>
            </div>
          </div>

          <div class="glass p-3 rounded-lg">
            <p class="text-xs text-muted uppercase tracking-wide mb-1">
              {{ t('seo.keywords.inH1') }}
            </p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="word in keywords.consistency.inH1"
                :key="word"
                class="px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-xs"
              >
                {{ word }}
              </span>
              <span v-if="keywords.consistency.inH1.length === 0" class="text-xs text-muted">
                {{ t('seo.keywords.noMatch') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <KeywordCloud :keywords="keywords.topKeywords" />
    </div>
  </AnalysisSection>
</template>
