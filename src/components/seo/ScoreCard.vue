<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { SeoStatus } from '@/types/seo';

const props = defineProps<{
  score: number;
  label: string;
  status?: SeoStatus;
}>();

const { t } = useI18n();

const scoreColor = computed(() => {
  if (props.score >= 80) {
    return 'text-green-500';
  }
  if (props.score >= 60) {
    return 'text-yellow-500';
  }
  if (props.score >= 40) {
    return 'text-orange-500';
  }
  return 'text-red-500';
});

const bgColor = computed(() => {
  if (props.score >= 80) {
    return 'bg-green-500/10';
  }
  if (props.score >= 60) {
    return 'bg-yellow-500/10';
  }
  if (props.score >= 40) {
    return 'bg-orange-500/10';
  }
  return 'bg-red-500/10';
});

const ringColor = computed(() => {
  if (props.score >= 80) {
    return 'stroke-green-500';
  }
  if (props.score >= 60) {
    return 'stroke-yellow-500';
  }
  if (props.score >= 40) {
    return 'stroke-orange-500';
  }
  return 'stroke-red-500';
});

const circumference = 2 * Math.PI * 45;
const dashOffset = computed(() => circumference - (props.score / 100) * circumference);

const gradeLabel = computed(() => {
  if (props.score >= 90) {
    return t('seo.score.grades.excellent');
  }
  if (props.score >= 80) {
    return t('seo.score.grades.good');
  }
  if (props.score >= 60) {
    return t('seo.score.grades.needsWork');
  }
  if (props.score >= 40) {
    return t('seo.score.grades.poor');
  }
  return t('seo.score.grades.critical');
});
</script>

<template>
  <div class="glass-card p-6 flex flex-col items-center">
    <div class="relative w-32 h-32">
      <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          stroke-width="8"
          class="text-border"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          :stroke-width="8"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          stroke-linecap="round"
          :class="ringColor"
          class="transition-all duration-700 ease-out"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span :class="[scoreColor, 'text-3xl font-bold']">{{ score }}</span>
        <span class="text-xs text-muted uppercase tracking-wide">/ 100</span>
      </div>
    </div>
    <h3 class="mt-4 text-lg font-semibold text-body">{{ label }}</h3>
    <span :class="[bgColor, scoreColor, 'mt-2 px-3 py-1 rounded-full text-sm font-medium']">
      {{ gradeLabel }}
    </span>
  </div>
</template>
