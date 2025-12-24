<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { MetaAnalysis } from '@/types/seo';

const props = defineProps<{
  url: string;
  meta: MetaAnalysis;
}>();

const { t } = useI18n();

const displayUrl = computed(() => {
  try {
    const parsed = new URL(props.url);
    return parsed.hostname + parsed.pathname;
  } catch {
    return props.url;
  }
});

const breadcrumbs = computed(() => {
  try {
    const parsed = new URL(props.url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length === 0) {
      return parsed.hostname;
    }
    return `${parsed.hostname} › ${parts.join(' › ')}`;
  } catch {
    return props.url;
  }
});

const truncatedTitle = computed(() => {
  const title = props.meta.title.value as string | null;
  if (!title) {
    return t('seo.previews.serp.noTitle');
  }
  if (title.length > 60) {
    return title.substring(0, 57) + '...';
  }
  return title;
});

const truncatedDescription = computed(() => {
  const desc = props.meta.description.value as string | null;
  if (!desc) {
    return t('seo.previews.serp.noDescription');
  }
  if (desc.length > 160) {
    return desc.substring(0, 157) + '...';
  }
  return desc;
});

const currentDate = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4 mb-4">
      <span class="text-sm font-medium text-body">{{ t('seo.previews.serp.title') }}</span>
      <div class="flex gap-2">
        <span class="px-2 py-1 text-xs rounded bg-surface border border-border">
          {{ t('seo.previews.serp.desktop') }}
        </span>
      </div>
    </div>

    <!-- Desktop SERP Preview -->
    <div
      class="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-700"
    >
      <div class="max-w-[600px]">
        <!-- URL breadcrumb -->
        <div class="flex items-center gap-2 mb-1">
          <div
            class="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center"
          >
            <span class="text-xs font-bold text-stone-600 dark:text-stone-400">
              {{ displayUrl.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-stone-800 dark:text-stone-200">{{ displayUrl }}</span>
            <span class="text-xs text-stone-500 dark:text-stone-400">{{ breadcrumbs }}</span>
          </div>
        </div>

        <!-- Title -->
        <h3
          class="text-xl text-blue-700 dark:text-blue-400 hover:underline cursor-pointer leading-tight mb-1"
        >
          {{ truncatedTitle }}
        </h3>

        <!-- Description -->
        <p class="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          <span class="text-stone-500 dark:text-stone-500">{{ currentDate }} — </span>
          {{ truncatedDescription }}
        </p>
      </div>
    </div>

    <!-- Mobile SERP Preview -->
    <div class="flex items-center gap-4 mb-2">
      <span class="px-2 py-1 text-xs rounded bg-surface border border-border">
        {{ t('seo.previews.serp.mobile') }}
      </span>
    </div>

    <div
      class="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-700 max-w-[360px]"
    >
      <div class="flex items-center gap-2 mb-2">
        <div
          class="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center"
        >
          <span class="text-[10px] font-bold text-stone-600 dark:text-stone-400">
            {{ displayUrl.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div class="flex flex-col min-w-0">
          <span class="text-xs text-stone-800 dark:text-stone-200 truncate">{{ displayUrl }}</span>
        </div>
      </div>

      <h3
        class="text-base text-blue-700 dark:text-blue-400 hover:underline cursor-pointer leading-tight mb-1 line-clamp-2"
      >
        {{ truncatedTitle }}
      </h3>

      <p class="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2">
        {{ truncatedDescription }}
      </p>
    </div>
  </div>
</template>
