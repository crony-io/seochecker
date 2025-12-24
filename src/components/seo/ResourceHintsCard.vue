<script setup lang="ts">
import { Zap, Link, Server, Wifi } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { ResourceHintsAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

defineProps<{
  resourceHints: ResourceHintsAnalysis;
}>();

const { t } = useI18n();
</script>

<template>
  <AnalysisSection :title="t('seo.resourceHints.title')" :status="resourceHints.status">
    <div class="space-y-4">
      <!-- Summary -->
      <div class="flex items-center gap-4 text-sm">
        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium',
            resourceHints.hasResourceHints
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
          ]"
        >
          {{
            resourceHints.hasResourceHints
              ? t('seo.resourceHints.optimized')
              : t('seo.resourceHints.notOptimized')
          }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Preload -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <Zap class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.resourceHints.preload') }}</span>
            <span class="ml-auto text-xs text-muted">{{ resourceHints.preload.length }}</span>
          </div>
          <div v-if="resourceHints.preload.length > 0" class="space-y-1">
            <p
              v-for="(item, index) in resourceHints.preload.slice(0, 3)"
              :key="index"
              class="text-xs text-muted truncate"
            >
              {{ item }}
            </p>
            <p v-if="resourceHints.preload.length > 3" class="text-xs text-muted">
              +{{ resourceHints.preload.length - 3 }} {{ t('common.more') }}
            </p>
          </div>
          <p v-else class="text-xs text-muted">{{ t('seo.resourceHints.none') }}</p>
        </div>

        <!-- Prefetch -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <Link class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.resourceHints.prefetch') }}</span>
            <span class="ml-auto text-xs text-muted">{{ resourceHints.prefetch.length }}</span>
          </div>
          <div v-if="resourceHints.prefetch.length > 0" class="space-y-1">
            <p
              v-for="(item, index) in resourceHints.prefetch.slice(0, 3)"
              :key="index"
              class="text-xs text-muted truncate"
            >
              {{ item }}
            </p>
            <p v-if="resourceHints.prefetch.length > 3" class="text-xs text-muted">
              +{{ resourceHints.prefetch.length - 3 }} {{ t('common.more') }}
            </p>
          </div>
          <p v-else class="text-xs text-muted">{{ t('seo.resourceHints.none') }}</p>
        </div>

        <!-- Preconnect -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <Server class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.resourceHints.preconnect') }}</span>
            <span class="ml-auto text-xs text-muted">{{ resourceHints.preconnect.length }}</span>
          </div>
          <div v-if="resourceHints.preconnect.length > 0" class="space-y-1">
            <p
              v-for="(item, index) in resourceHints.preconnect.slice(0, 3)"
              :key="index"
              class="text-xs text-muted truncate"
            >
              {{ item }}
            </p>
            <p v-if="resourceHints.preconnect.length > 3" class="text-xs text-muted">
              +{{ resourceHints.preconnect.length - 3 }} {{ t('common.more') }}
            </p>
          </div>
          <p v-else class="text-xs text-muted">{{ t('seo.resourceHints.none') }}</p>
        </div>

        <!-- DNS Prefetch -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <Wifi class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.resourceHints.dnsPrefetch') }}</span>
            <span class="ml-auto text-xs text-muted">{{ resourceHints.dnsPrefetch.length }}</span>
          </div>
          <div v-if="resourceHints.dnsPrefetch.length > 0" class="space-y-1">
            <p
              v-for="(item, index) in resourceHints.dnsPrefetch.slice(0, 3)"
              :key="index"
              class="text-xs text-muted truncate"
            >
              {{ item }}
            </p>
            <p v-if="resourceHints.dnsPrefetch.length > 3" class="text-xs text-muted">
              +{{ resourceHints.dnsPrefetch.length - 3 }} {{ t('common.more') }}
            </p>
          </div>
          <p v-else class="text-xs text-muted">{{ t('seo.resourceHints.none') }}</p>
        </div>
      </div>

      <p class="text-xs text-muted">{{ t('seo.resourceHints.description') }}</p>
    </div>
  </AnalysisSection>
</template>
