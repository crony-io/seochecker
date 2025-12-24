<script setup lang="ts">
import { Accessibility, Check, AlertTriangle, AlertCircle, Info } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { AccessibilityAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

const props = defineProps<{
  accessibility: AccessibilityAnalysis;
}>();

const { t } = useI18n();

const scoreColor = computed(() => {
  if (props.accessibility.score >= 80) {
    return 'text-green-500';
  }
  if (props.accessibility.score >= 60) {
    return 'text-amber-500';
  }
  return 'text-red-500';
});

const errorCount = computed(() => {
  return props.accessibility.issues.filter((i) => i.type === 'error').length;
});

const warningCount = computed(() => {
  return props.accessibility.issues.filter((i) => i.type === 'warning').length;
});
</script>

<template>
  <AnalysisSection :title="t('seo.accessibility.title')" :status="accessibility.status">
    <div class="space-y-4">
      <!-- Score -->
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3">
          <Accessibility class="h-8 w-8 text-accent" aria-hidden="true" />
          <div>
            <p class="text-sm text-muted">{{ t('seo.accessibility.score') }}</p>
            <p :class="['text-3xl font-bold', scoreColor]">{{ accessibility.score }}</p>
          </div>
        </div>
        <div class="flex gap-4 text-sm">
          <div class="flex items-center gap-1">
            <AlertCircle class="h-4 w-4 text-red-500" aria-hidden="true" />
            <span class="text-body">{{ errorCount }} {{ t('seo.accessibility.errors') }}</span>
          </div>
          <div class="flex items-center gap-1">
            <AlertTriangle class="h-4 w-4 text-amber-500" aria-hidden="true" />
            <span class="text-body">{{ warningCount }} {{ t('seo.accessibility.warnings') }}</span>
          </div>
        </div>
      </div>

      <!-- Landmarks -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div
          v-for="(hasLandmark, landmark) in {
            main: accessibility.landmarks.hasMain,
            nav: accessibility.landmarks.hasNav,
            header: accessibility.landmarks.hasHeader,
            footer: accessibility.landmarks.hasFooter,
            aside: accessibility.landmarks.hasAside,
          }"
          :key="landmark"
          :class="[
            'p-2 rounded-lg flex items-center gap-2 text-sm',
            hasLandmark ? 'bg-green-500/10' : 'bg-surface',
          ]"
        >
          <component
            :is="hasLandmark ? Check : AlertTriangle"
            :class="['h-4 w-4', hasLandmark ? 'text-green-500' : 'text-muted']"
            aria-hidden="true"
          />
          <span :class="hasLandmark ? 'text-body' : 'text-muted'">&lt;{{ landmark }}&gt;</span>
        </div>
      </div>

      <!-- Form Accessibility -->
      <div v-if="accessibility.forms.totalInputs > 0" class="p-3 rounded-lg bg-surface">
        <p class="text-sm font-medium text-body mb-2">{{ t('seo.accessibility.forms') }}</p>
        <div class="flex items-center gap-4 text-sm">
          <span class="text-muted">{{ t('seo.accessibility.inputsWithLabels') }}:</span>
          <span class="font-medium text-body">
            {{ accessibility.forms.inputsWithLabels }}/{{ accessibility.forms.totalInputs }}
          </span>
        </div>
      </div>

      <!-- Issues -->
      <div v-if="accessibility.issues.length > 0" class="space-y-2">
        <p class="text-sm font-medium text-body">{{ t('seo.accessibility.issues') }}</p>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div
            v-for="(issue, index) in accessibility.issues.slice(0, 8)"
            :key="index"
            :class="[
              'p-2 rounded-lg text-sm flex items-start gap-2',
              issue.type === 'error'
                ? 'bg-red-500/10'
                : issue.type === 'warning'
                  ? 'bg-amber-500/10'
                  : 'bg-blue-500/10',
            ]"
          >
            <component
              :is="
                issue.type === 'error'
                  ? AlertCircle
                  : issue.type === 'warning'
                    ? AlertTriangle
                    : Info
              "
              :class="[
                'h-4 w-4 shrink-0 mt-0.5',
                issue.type === 'error'
                  ? 'text-red-500'
                  : issue.type === 'warning'
                    ? 'text-amber-500'
                    : 'text-blue-500',
              ]"
              aria-hidden="true"
            />
            <div class="flex-1 min-w-0">
              <p class="text-body">{{ issue.message }}</p>
              <p class="text-xs text-muted">
                WCAG {{ issue.wcagLevel }} - {{ issue.wcagCriteria }}
                <span v-if="issue.count > 1" class="ml-1">({{ issue.count }} instances)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Passed Checks -->
      <div v-if="accessibility.passed.length > 0">
        <p class="text-sm font-medium text-body mb-2">{{ t('seo.accessibility.passed') }}</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(check, index) in accessibility.passed"
            :key="index"
            class="px-2 py-1 text-xs bg-green-500/10 text-green-600 dark:text-green-400 rounded flex items-center gap-1"
          >
            <Check class="h-3 w-3" aria-hidden="true" />
            {{ check.description }}
          </span>
        </div>
      </div>

      <p class="text-xs text-muted">{{ t('seo.accessibility.description') }}</p>
    </div>
  </AnalysisSection>
</template>
