<script setup lang="ts">
import { Link, ExternalLink, AlertTriangle } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { LinksAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

defineProps<{
  links: LinksAnalysis;
}>();

const { t } = useI18n();
</script>

<template>
  <AnalysisSection :title="t('seo.links.title')" :status="links.status">
    <div class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass p-4 rounded-xl text-center">
          <p class="text-2xl font-bold text-body">{{ links.total }}</p>
          <p class="text-xs text-muted mt-1">{{ t('seo.links.total') }}</p>
        </div>
        <div class="glass p-4 rounded-xl text-center">
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ links.internal }}</p>
          <p class="text-xs text-muted mt-1">{{ t('seo.links.internal') }}</p>
        </div>
        <div class="glass p-4 rounded-xl text-center">
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {{ links.external }}
          </p>
          <p class="text-xs text-muted mt-1">{{ t('seo.links.external') }}</p>
        </div>
        <div class="glass p-4 rounded-xl text-center">
          <p class="text-2xl font-bold text-muted">{{ links.nofollow }}</p>
          <p class="text-xs text-muted mt-1">{{ t('seo.links.nofollow') }}</p>
        </div>
      </div>

      <div
        v-if="links.items.some((link) => link.issues.length > 0)"
        class="border-t border-border pt-4"
      >
        <h4 class="text-sm font-semibold text-body mb-3">{{ t('seo.links.issues') }}</h4>
        <div class="space-y-2 max-h-[300px] overflow-y-auto scrollbar">
          <div
            v-for="(link, index) in links.items.filter((l) => l.issues.length > 0)"
            :key="index"
            class="flex items-start gap-3 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10"
          >
            <component
              :is="link.isInternal ? Link : ExternalLink"
              class="h-4 w-4 text-muted shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-body">
                <span class="font-medium">{{ link.text || t('seo.links.emptyText') }}</span>
                <span class="text-muted"> → </span>
                <span class="text-muted truncate">{{ link.href }}</span>
              </p>
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="(issue, issueIndex) in link.issues"
                  :key="issueIndex"
                  class="inline-flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400"
                >
                  <AlertTriangle class="h-3 w-3" aria-hidden="true" />
                  {{ issue }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-else-if="links.total === 0" class="text-sm text-muted">{{ t('seo.links.noLinks') }}</p>
    </div>
  </AnalysisSection>
</template>
