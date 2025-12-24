<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { KeywordItem } from '@/types/seo';

const props = defineProps<{
  keywords: KeywordItem[];
  maxWords?: number;
}>();

const { t } = useI18n();

const displayKeywords = computed(() => {
  const max = props.maxWords || 30;
  return props.keywords.slice(0, max);
});

const maxCount = computed(() => {
  if (displayKeywords.value.length === 0) {
    return 1;
  }
  return Math.max(...displayKeywords.value.map((k) => k.count));
});

const minCount = computed(() => {
  if (displayKeywords.value.length === 0) {
    return 1;
  }
  return Math.min(...displayKeywords.value.map((k) => k.count));
});

function getSize(count: number): string {
  const range = maxCount.value - minCount.value || 1;
  const normalized = (count - minCount.value) / range;
  const size = 0.75 + normalized * 1.25; // 0.75rem to 2rem
  return `${size}rem`;
}

function getOpacity(count: number): number {
  const range = maxCount.value - minCount.value || 1;
  const normalized = (count - minCount.value) / range;
  return 0.5 + normalized * 0.5; // 0.5 to 1
}

const colors = [
  'text-blue-500',
  'text-green-500',
  'text-purple-500',
  'text-orange-500',
  'text-pink-500',
  'text-cyan-500',
  'text-indigo-500',
  'text-teal-500',
];

function getColor(index: number): string {
  return colors[index % colors.length] ?? 'text-blue-500';
}
</script>

<template>
  <div class="glass-card p-4">
    <h3 class="text-lg font-semibold text-body mb-4">{{ t('seo.keywords.cloud') }}</h3>

    <div
      v-if="displayKeywords.length > 0"
      class="flex flex-wrap items-center justify-center gap-3 p-4 min-h-[200px]"
    >
      <span
        v-for="(keyword, index) in displayKeywords"
        :key="keyword.word"
        :class="[
          getColor(index),
          'font-medium cursor-default transition-transform hover:scale-110',
        ]"
        :style="{
          fontSize: getSize(keyword.count),
          opacity: getOpacity(keyword.count),
        }"
        :title="`${keyword.word}: ${keyword.count} (${keyword.density}%)`"
      >
        {{ keyword.word }}
      </span>
    </div>

    <p v-else class="text-center text-muted py-8">{{ t('seo.keywords.noKeywords') }}</p>

    <p class="text-xs text-muted text-center mt-4">
      {{ t('seo.keywords.cloudDescription') }}
    </p>
  </div>
</template>
