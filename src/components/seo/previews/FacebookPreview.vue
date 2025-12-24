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
    return parsed.hostname.toUpperCase();
  } catch {
    return props.url.toUpperCase();
  }
});

const ogTitle = computed(() => {
  const ogT = props.meta.openGraph.items.find((i) => i.label === 'og:title');
  return (
    (ogT?.value as string) ||
    (props.meta.title.value as string) ||
    t('seo.previews.facebook.noTitle')
  );
});

const ogDescription = computed(() => {
  const ogD = props.meta.openGraph.items.find((i) => i.label === 'og:description');
  return (
    (ogD?.value as string) ||
    (props.meta.description.value as string) ||
    t('seo.previews.facebook.noDescription')
  );
});

const ogImage = computed(() => {
  const ogI = props.meta.openGraph.items.find((i) => i.label === 'og:image');
  return ogI?.value as string | null;
});

const truncatedTitle = computed(() => {
  if (ogTitle.value.length > 88) {
    return ogTitle.value.substring(0, 85) + '...';
  }
  return ogTitle.value;
});

const truncatedDescription = computed(() => {
  if (ogDescription.value.length > 200) {
    return ogDescription.value.substring(0, 197) + '...';
  }
  return ogDescription.value;
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-4 mb-4">
      <span class="text-sm font-medium text-body">{{ t('seo.previews.facebook.title') }}</span>
    </div>

    <!-- Facebook Link Preview -->
    <div
      class="max-w-[500px] bg-white dark:bg-stone-900 rounded-lg border border-stone-300 dark:border-stone-600 overflow-hidden shadow-sm"
    >
      <!-- Image area -->
      <div
        class="w-full h-[261px] bg-stone-200 dark:bg-stone-800 flex items-center justify-center"
        :class="{
          'bg-linear-to-br from-stone-300 to-stone-400 dark:from-stone-700 dark:to-stone-800':
            !ogImage,
        }"
      >
        <img
          v-if="ogImage"
          :src="ogImage"
          :alt="ogTitle"
          class="w-full h-full object-cover"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
        <div v-else class="text-center p-4">
          <div
            class="w-16 h-16 mx-auto mb-2 rounded-lg bg-stone-400 dark:bg-stone-600 flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-stone-200 dark:text-stone-400"
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
            {{ t('seo.previews.facebook.noImage') }}
          </p>
        </div>
      </div>

      <!-- Content area -->
      <div class="p-3 bg-stone-100 dark:bg-stone-800/50">
        <p class="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">
          {{ domain }}
        </p>
        <h3
          class="text-base font-semibold text-stone-900 dark:text-stone-100 leading-tight mb-1 line-clamp-2"
        >
          {{ truncatedTitle }}
        </h3>
        <p class="text-sm text-stone-500 dark:text-stone-400 line-clamp-1">
          {{ truncatedDescription }}
        </p>
      </div>
    </div>

    <!-- Info about OG tags -->
    <div class="text-xs text-muted space-y-1">
      <p>
        <span class="font-medium">og:image:</span>
        {{
          ogImage ? t('seo.previews.facebook.imageSet') : t('seo.previews.facebook.imageMissing')
        }}
      </p>
      <p>
        <span class="font-medium">{{ t('seo.previews.facebook.recommended') }}:</span>
        1200 × 630px
      </p>
    </div>
  </div>
</template>
