<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { MetaAnalysis } from '@/types/seo';

const props = defineProps<{
  url: string;
  meta: MetaAnalysis;
}>();

const { t } = useI18n();

const domain = computed(() => {
  try {
    const parsed = new URL(props.url);
    return parsed.hostname;
  } catch {
    return props.url;
  }
});

const twitterCard = computed(() => {
  const card = props.meta.twitterCard.items.find((i) => i.label === 'twitter:card');
  return (card?.value as string) || 'summary';
});

const twitterTitle = computed(() => {
  const title = props.meta.twitterCard.items.find((i) => i.label === 'twitter:title');
  const ogTitle = props.meta.openGraph.items.find((i) => i.label === 'og:title');
  return (
    (title?.value as string) ||
    (ogTitle?.value as string) ||
    (props.meta.title.value as string) ||
    t('seo.previews.twitter.noTitle')
  );
});

const twitterDescription = computed(() => {
  const desc = props.meta.twitterCard.items.find((i) => i.label === 'twitter:description');
  const ogDesc = props.meta.openGraph.items.find((i) => i.label === 'og:description');
  return (
    (desc?.value as string) ||
    (ogDesc?.value as string) ||
    (props.meta.description.value as string) ||
    ''
  );
});

const twitterImage = computed(() => {
  const img = props.meta.twitterCard.items.find((i) => i.label === 'twitter:image');
  const ogImg = props.meta.openGraph.items.find((i) => i.label === 'og:image');
  return (img?.value as string) || (ogImg?.value as string) || null;
});

const isLargeCard = computed(() => {
  return twitterCard.value === 'summary_large_image';
});

const truncatedTitle = computed(() => {
  if (twitterTitle.value.length > 70) {
    return twitterTitle.value.substring(0, 67) + '...';
  }
  return twitterTitle.value;
});

const truncatedDescription = computed(() => {
  if (twitterDescription.value.length > 200) {
    return twitterDescription.value.substring(0, 197) + '...';
  }
  return twitterDescription.value;
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-4 mb-4">
      <span class="text-sm font-medium text-body">{{ t('seo.previews.twitter.title') }}</span>
      <span class="px-2 py-1 text-xs rounded bg-surface border border-border">
        {{ twitterCard }}
      </span>
    </div>

    <!-- Summary Large Image Card -->
    <div
      v-if="isLargeCard"
      class="max-w-[500px] rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden bg-white dark:bg-stone-900"
    >
      <!-- Large Image -->
      <div
        class="w-full h-[250px] bg-stone-200 dark:bg-stone-800 flex items-center justify-center"
        :class="{
          'bg-linear-to-br from-stone-300 to-stone-400 dark:from-stone-700 dark:to-stone-800':
            !twitterImage,
        }"
      >
        <img
          v-if="twitterImage"
          :src="twitterImage"
          :alt="twitterTitle"
          class="w-full h-full object-cover"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
        <div v-else class="text-center p-4">
          <div
            class="w-12 h-12 mx-auto mb-2 rounded-lg bg-stone-400 dark:bg-stone-600 flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-stone-200 dark:text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p class="text-xs text-stone-500 dark:text-stone-400">
            {{ t('seo.previews.twitter.noImage') }}
          </p>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3">
        <h3 class="text-base font-normal text-stone-900 dark:text-stone-100 leading-tight mb-1">
          {{ truncatedTitle }}
        </h3>
        <p class="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-1">
          {{ truncatedDescription }}
        </p>
        <p class="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          {{ domain }}
        </p>
      </div>
    </div>

    <!-- Summary Card (small) -->
    <div
      v-else
      class="max-w-[500px] rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden bg-white dark:bg-stone-900 flex"
    >
      <!-- Small Image -->
      <div
        class="w-[125px] h-[125px] shrink-0 bg-stone-200 dark:bg-stone-800 flex items-center justify-center"
        :class="{
          'bg-linear-to-br from-stone-300 to-stone-400 dark:from-stone-700 dark:to-stone-800':
            !twitterImage,
        }"
      >
        <img
          v-if="twitterImage"
          :src="twitterImage"
          :alt="twitterTitle"
          class="w-full h-full object-cover"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
        <div v-else class="text-center p-2">
          <svg
            class="w-8 h-8 mx-auto text-stone-400 dark:text-stone-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3 flex flex-col justify-center min-w-0">
        <h3
          class="text-base font-normal text-stone-900 dark:text-stone-100 leading-tight mb-1 truncate"
        >
          {{ truncatedTitle }}
        </h3>
        <p class="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-1">
          {{ truncatedDescription }}
        </p>
        <p class="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-1">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <span class="truncate">{{ domain }}</span>
        </p>
      </div>
    </div>

    <!-- Info -->
    <div class="text-xs text-muted space-y-1">
      <p>
        <span class="font-medium">twitter:card:</span>
        {{ twitterCard }}
      </p>
      <p>
        <span class="font-medium">{{ t('seo.previews.twitter.recommended') }}:</span>
        {{ isLargeCard ? '1200 × 628px' : '144 × 144px (min)' }}
      </p>
    </div>
  </div>
</template>
