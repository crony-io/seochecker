<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { HeadingsAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

defineProps<{
  headings: HeadingsAnalysis;
}>();

const { t } = useI18n();

function getIndentClass(level: number): string {
  const indents: Record<number, string> = {
    1: 'ml-0',
    2: 'ml-4',
    3: 'ml-8',
    4: 'ml-12',
    5: 'ml-16',
    6: 'ml-20',
  };
  return indents[level] ?? 'ml-0';
}

function getTagClass(level: number): string {
  const classes: Record<number, string> = {
    1: 'bg-primary/10 text-primary',
    2: 'bg-accent/10 text-accent',
    3: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    4: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    5: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    6: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  };
  return classes[level] ?? 'bg-gray-500/10 text-gray-600';
}
</script>

<template>
  <AnalysisSection :title="t('seo.headings.title')" :status="headings.status">
    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 text-sm">
        <div class="flex items-center gap-2">
          <span class="text-muted">{{ t('seo.headings.h1Count') }}:</span>
          <span
            :class="[
              'font-semibold',
              headings.h1Count === 1
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
            ]"
          >
            {{ headings.h1Count }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-muted">{{ t('seo.headings.total') }}:</span>
          <span class="font-semibold text-body">{{ headings.items.length }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-muted">{{ t('seo.headings.hierarchy') }}:</span>
          <span
            :class="[
              'font-semibold',
              headings.hasProperHierarchy
                ? 'text-green-600 dark:text-green-400'
                : 'text-yellow-600 dark:text-yellow-400',
            ]"
          >
            {{ headings.hasProperHierarchy ? t('seo.headings.proper') : t('seo.headings.hasGaps') }}
          </span>
        </div>
      </div>

      <div v-if="headings.issues.length > 0" class="flex flex-col gap-2">
        <div
          v-for="(issue, index) in headings.issues"
          :key="index"
          class="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400"
        >
          <AlertTriangle class="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{{ issue }}</span>
        </div>
      </div>

      <div v-if="headings.items.length > 0" class="border-t border-border pt-4 space-y-2">
        <div
          v-for="(heading, index) in headings.items"
          :key="index"
          :class="[getIndentClass(heading.level), 'flex items-start gap-2 py-1']"
        >
          <span
            :class="[
              getTagClass(heading.level),
              'shrink-0 px-2 py-0.5 rounded text-xs font-mono font-semibold uppercase',
            ]"
          >
            {{ heading.tag }}
          </span>
          <span class="text-sm text-body wrap-break-word">
            {{ heading.text || t('seo.headings.empty') }}
          </span>
          <span
            v-if="heading.issues.length > 0"
            class="shrink-0 text-xs text-yellow-600 dark:text-yellow-400"
          >
            <AlertTriangle class="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>

      <p v-else class="text-sm text-muted">{{ t('seo.headings.noHeadings') }}</p>
    </div>
  </AnalysisSection>
</template>
