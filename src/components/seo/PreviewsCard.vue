<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { MetaAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';
import SerpPreview from '@/components/seo/previews/SerpPreview.vue';
import FacebookPreview from '@/components/seo/previews/FacebookPreview.vue';
import TwitterPreview from '@/components/seo/previews/TwitterPreview.vue';

defineProps<{
  url: string;
  meta: MetaAnalysis;
}>();

const { t } = useI18n();

type PreviewTab = 'serp' | 'facebook' | 'twitter';
const activeTab = ref<PreviewTab>('serp');

const tabs: { id: PreviewTab; label: string }[] = [
  { id: 'serp', label: 'Google' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'X (Twitter)' },
];
</script>

<template>
  <AnalysisSection :title="t('seo.previews.title')" :status="meta.openGraph.status">
    <div class="space-y-4">
      <!-- Tab buttons -->
      <div class="flex gap-2 border-b border-border pb-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="
            activeTab === tab.id
              ? 'bg-primary text-white'
              : 'bg-surface hover:bg-surface-hover text-body'
          "
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Preview content -->
      <div class="pt-2">
        <SerpPreview v-if="activeTab === 'serp'" :url="url" :meta="meta" />
        <FacebookPreview v-if="activeTab === 'facebook'" :url="url" :meta="meta" />
        <TwitterPreview v-if="activeTab === 'twitter'" :url="url" :meta="meta" />
      </div>
    </div>
  </AnalysisSection>
</template>
