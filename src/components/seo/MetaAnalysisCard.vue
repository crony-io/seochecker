<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { MetaAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';
import StatusBadge from '@/components/seo/StatusBadge.vue';

defineProps<{
  meta: MetaAnalysis;
}>();

const { t } = useI18n();
</script>

<template>
  <AnalysisSection :title="t('seo.meta.title')" :status="meta.title.status">
    <div class="space-y-6">
      <div class="space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-medium text-body">{{ t('seo.meta.pageTitle') }}</span>
              <StatusBadge :status="meta.title.status">
                {{ meta.title.length }} {{ t('seo.meta.chars') }}
              </StatusBadge>
            </div>
            <p class="text-sm text-muted truncate">
              {{ meta.title.value || t('seo.meta.missing') }}
            </p>
            <p v-if="meta.title.details" class="text-xs text-muted-2 mt-1">
              {{ meta.title.details }}
            </p>
          </div>
        </div>

        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-medium text-body">{{ t('seo.meta.description') }}</span>
              <StatusBadge :status="meta.description.status">
                {{ meta.description.length }} {{ t('seo.meta.chars') }}
              </StatusBadge>
            </div>
            <p class="text-sm text-muted line-clamp-2">
              {{ meta.description.value || t('seo.meta.missing') }}
            </p>
            <p v-if="meta.description.details" class="text-xs text-muted-2 mt-1">
              {{ meta.description.details }}
            </p>
          </div>
        </div>

        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-medium text-body">{{ t('seo.meta.canonical') }}</span>
              <StatusBadge :status="meta.canonical.status" />
            </div>
            <p class="text-sm text-muted truncate">
              {{ meta.canonical.value || t('seo.meta.notSet') }}
            </p>
          </div>
        </div>

        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-medium text-body">{{ t('seo.meta.robots') }}</span>
              <StatusBadge :status="meta.robots.status" />
            </div>
            <p class="text-sm text-muted">{{ meta.robots.value }}</p>
          </div>
        </div>

        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-medium text-body">{{ t('seo.meta.viewport') }}</span>
              <StatusBadge :status="meta.viewport.status" />
            </div>
            <p class="text-sm text-muted truncate">
              {{ meta.viewport.value || t('seo.meta.missing') }}
            </p>
          </div>
        </div>
      </div>

      <div class="border-t border-border pt-4">
        <h4 class="text-sm font-semibold text-body mb-3">{{ t('seo.meta.openGraph') }}</h4>
        <div class="space-y-2">
          <div
            v-for="item in meta.openGraph.items"
            :key="item.label"
            class="flex items-center justify-between gap-4 py-1"
          >
            <span class="text-sm text-muted">{{ item.label }}</span>
            <div class="flex items-center gap-2">
              <span class="text-sm text-body truncate max-w-[200px]">
                {{ item.value || t('seo.meta.notSet') }}
              </span>
              <StatusBadge :status="item.status" :show-icon="true" />
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-border pt-4">
        <h4 class="text-sm font-semibold text-body mb-3">{{ t('seo.meta.twitterCard') }}</h4>
        <div class="space-y-2">
          <div
            v-for="item in meta.twitterCard.items"
            :key="item.label"
            class="flex items-center justify-between gap-4 py-1"
          >
            <span class="text-sm text-muted">{{ item.label }}</span>
            <div class="flex items-center gap-2">
              <span class="text-sm text-body truncate max-w-[200px]">
                {{ item.value || t('seo.meta.notSet') }}
              </span>
              <StatusBadge :status="item.status" :show-icon="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AnalysisSection>
</template>
