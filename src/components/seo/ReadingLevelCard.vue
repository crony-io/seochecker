<script setup lang="ts">
import { BookOpen, GraduationCap, Users } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { analyzeReadingLevel } from '@/utils/readingLevel';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';
import type { SeoStatus } from '@/types/seo';

const props = defineProps<{
  text: string;
}>();

const { t } = useI18n();

const analysis = computed(() => analyzeReadingLevel(props.text));

const status = computed<SeoStatus>(() => {
  const score = analysis.value.fleschReadingEase;
  if (score >= 60 && score <= 80) {
    return 'good';
  }
  if (score >= 50 || score <= 90) {
    return 'warning';
  }
  return 'info';
});

const scoreColor = computed(() => {
  const score = analysis.value.fleschReadingEase;
  if (score >= 70) {
    return 'text-green-500';
  }
  if (score >= 50) {
    return 'text-yellow-500';
  }
  if (score >= 30) {
    return 'text-orange-500';
  }
  return 'text-red-500';
});

const scoreBg = computed(() => {
  const score = analysis.value.fleschReadingEase;
  if (score >= 70) {
    return 'bg-green-500/10';
  }
  if (score >= 50) {
    return 'bg-yellow-500/10';
  }
  if (score >= 30) {
    return 'bg-orange-500/10';
  }
  return 'bg-red-500/10';
});
</script>

<template>
  <AnalysisSection :title="t('seo.readingLevel.title')" :status="status">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Flesch Reading Ease Score -->
      <div :class="[scoreBg, 'p-4 rounded-xl text-center']">
        <div class="flex items-center justify-center gap-2 text-muted mb-2">
          <BookOpen class="h-4 w-4" aria-hidden="true" />
          <span class="text-xs uppercase tracking-wide">{{ t('seo.readingLevel.score') }}</span>
        </div>
        <p :class="['text-3xl font-bold', scoreColor]">{{ analysis.fleschReadingEase }}</p>
        <p class="text-sm font-medium text-body mt-1">{{ analysis.readingEaseLabel }}</p>
      </div>

      <!-- Grade Level -->
      <div class="glass p-4 rounded-xl text-center">
        <div class="flex items-center justify-center gap-2 text-muted mb-2">
          <GraduationCap class="h-4 w-4" aria-hidden="true" />
          <span class="text-xs uppercase tracking-wide">{{
            t('seo.readingLevel.gradeLevel')
          }}</span>
        </div>
        <p class="text-3xl font-bold text-body">{{ analysis.fleschKincaidGrade }}</p>
        <p class="text-sm text-muted mt-1">{{ t('seo.readingLevel.gradeLabel') }}</p>
      </div>

      <!-- Target Audience -->
      <div class="glass p-4 rounded-xl text-center">
        <div class="flex items-center justify-center gap-2 text-muted mb-2">
          <Users class="h-4 w-4" aria-hidden="true" />
          <span class="text-xs uppercase tracking-wide">{{ t('seo.readingLevel.audience') }}</span>
        </div>
        <p class="text-xl font-bold text-body">{{ analysis.targetAudience }}</p>
        <p class="text-sm text-muted mt-1">{{ t('seo.readingLevel.audienceLabel') }}</p>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
      <div class="flex justify-between p-2 rounded bg-surface">
        <span class="text-muted">{{ t('seo.readingLevel.avgSyllables') }}:</span>
        <span class="font-medium text-body">{{ analysis.avgSyllablesPerWord }}</span>
      </div>
      <div class="flex justify-between p-2 rounded bg-surface">
        <span class="text-muted">{{ t('seo.readingLevel.avgWords') }}:</span>
        <span class="font-medium text-body">{{ analysis.avgWordsPerSentence }}</span>
      </div>
    </div>

    <p class="mt-4 text-xs text-muted">
      {{ t('seo.readingLevel.recommendation') }}
    </p>
  </AnalysisSection>
</template>
