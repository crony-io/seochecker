<script setup lang="ts">
import { FileText, Clock, BarChart3, Code } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { ContentAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

defineProps<{
  content: ContentAnalysis;
}>();

const { t } = useI18n();
</script>

<template>
  <AnalysisSection :title="t('seo.content.title')" :status="content.status">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="glass p-4 rounded-xl">
        <div class="flex items-center gap-2 text-muted mb-2">
          <FileText class="h-4 w-4" aria-hidden="true" />
          <span class="text-xs uppercase tracking-wide">{{ t('seo.content.words') }}</span>
        </div>
        <p class="text-2xl font-bold text-body">{{ content.wordCount.toLocaleString() }}</p>
        <p class="text-xs text-muted mt-1">
          {{
            content.wordCount >= 300 ? t('seo.content.goodLength') : t('seo.content.shortContent')
          }}
        </p>
      </div>

      <div class="glass p-4 rounded-xl">
        <div class="flex items-center gap-2 text-muted mb-2">
          <Clock class="h-4 w-4" aria-hidden="true" />
          <span class="text-xs uppercase tracking-wide">{{ t('seo.content.readTime') }}</span>
        </div>
        <p class="text-2xl font-bold text-body">{{ content.readingTimeMinutes }}</p>
        <p class="text-xs text-muted mt-1">{{ t('seo.content.minutes') }}</p>
      </div>

      <div class="glass p-4 rounded-xl">
        <div class="flex items-center gap-2 text-muted mb-2">
          <BarChart3 class="h-4 w-4" aria-hidden="true" />
          <span class="text-xs uppercase tracking-wide">{{ t('seo.content.paragraphs') }}</span>
        </div>
        <p class="text-2xl font-bold text-body">{{ content.paragraphCount }}</p>
        <p class="text-xs text-muted mt-1">
          {{ content.sentenceCount }} {{ t('seo.content.sentences') }}
        </p>
      </div>

      <div class="glass p-4 rounded-xl">
        <div class="flex items-center gap-2 text-muted mb-2">
          <Code class="h-4 w-4" aria-hidden="true" />
          <span class="text-xs uppercase tracking-wide">{{ t('seo.content.textHtmlRatio') }}</span>
        </div>
        <p class="text-2xl font-bold text-body">{{ content.textToHtmlRatio }}%</p>
        <p class="text-xs text-muted mt-1">
          {{ content.textToHtmlRatio >= 25 ? t('seo.content.optimal') : t('seo.content.lowRatio') }}
        </p>
      </div>
    </div>

    <div class="mt-4 text-sm text-muted">
      <p>
        {{ t('seo.content.avgWords') }}:
        <span class="font-medium text-body">{{ content.avgWordsPerSentence }}</span>
      </p>
    </div>
  </AnalysisSection>
</template>
