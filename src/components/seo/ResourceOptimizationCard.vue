<script setup lang="ts">
import { FileCode, Palette, Printer, Check, X } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { ResourceOptimizationAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

defineProps<{
  resourceOptimization: ResourceOptimizationAnalysis;
}>();

const { t } = useI18n();
</script>

<template>
  <AnalysisSection
    :title="t('seo.resourceOptimization.title')"
    :status="resourceOptimization.status"
  >
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Scripts Minification -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <FileCode class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.resourceOptimization.scripts') }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted">{{ t('seo.resourceOptimization.minified') }}</span>
            <span class="font-medium text-body">
              {{ resourceOptimization.minifiedScripts }}/{{ resourceOptimization.totalScripts }}
            </span>
          </div>
        </div>

        <!-- Stylesheets Minification -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <Palette class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.resourceOptimization.stylesheets') }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted">{{ t('seo.resourceOptimization.minified') }}</span>
            <span class="font-medium text-body">
              {{ resourceOptimization.minifiedStylesheets }}/{{
                resourceOptimization.totalStylesheets
              }}
            </span>
          </div>
        </div>

        <!-- Print Styles -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-2">
            <Printer class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.resourceOptimization.printStyles') }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <component
              :is="resourceOptimization.hasPrintStyles ? Check : X"
              :class="[
                'h-4 w-4',
                resourceOptimization.hasPrintStyles ? 'text-green-500' : 'text-muted',
              ]"
              aria-hidden="true"
            />
            <span :class="resourceOptimization.hasPrintStyles ? 'text-body' : 'text-muted'">
              {{
                resourceOptimization.hasPrintStyles
                  ? t('seo.resourceOptimization.hasPrintStyles')
                  : t('seo.resourceOptimization.noPrintStyles')
              }}
            </span>
          </div>
          <p v-if="resourceOptimization.printMediaQueries > 0" class="text-xs text-muted mt-1">
            {{ resourceOptimization.printMediaQueries }}
            {{ t('seo.resourceOptimization.printMediaQueries') }}
          </p>
        </div>
      </div>

      <!-- Issues -->
      <div v-if="resourceOptimization.issues.length > 0" class="space-y-2">
        <p
          v-for="(issue, index) in resourceOptimization.issues"
          :key="index"
          class="text-sm text-amber-600 dark:text-amber-400"
        >
          • {{ issue }}
        </p>
      </div>

      <p class="text-xs text-muted">{{ t('seo.resourceOptimization.description') }}</p>
    </div>
  </AnalysisSection>
</template>
