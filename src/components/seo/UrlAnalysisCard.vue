<script setup lang="ts">
import { computed } from 'vue';
import { Link, CheckCircle, XCircle, AlertTriangle, Hash, Layers, Type } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { UrlAnalysis } from '@/utils/urlAnalysis';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

const props = defineProps<{
  urlAnalysis: UrlAnalysis;
}>();

const { t } = useI18n();

const scoreColor = computed(() => {
  const score = props.urlAnalysis.readability.score;
  if (score >= 80) {
    return 'text-green-600 dark:text-green-400';
  }
  if (score >= 60) {
    return 'text-amber-600 dark:text-amber-400';
  }
  return 'text-red-600 dark:text-red-400';
});

const scoreBgColor = computed(() => {
  const score = props.urlAnalysis.readability.score;
  if (score >= 80) {
    return 'bg-green-500/10';
  }
  if (score >= 60) {
    return 'bg-amber-500/10';
  }
  return 'bg-red-500/10';
});
</script>

<template>
  <AnalysisSection :title="t('seo.urlAnalysis.title')" :status="urlAnalysis.status">
    <div class="space-y-4">
      <!-- Score and URL Display -->
      <div class="flex items-start gap-4">
        <div :class="['p-3 rounded-lg', scoreBgColor]">
          <p :class="['text-2xl font-bold', scoreColor]">{{ urlAnalysis.readability.score }}</p>
          <p class="text-xs text-muted">{{ t('seo.urlAnalysis.score') }}</p>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-mono text-body break-all">{{ urlAnalysis.url }}</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              :class="[
                'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs',
                urlAnalysis.usesHttps
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400',
              ]"
            >
              {{ urlAnalysis.protocol.replace(':', '') }}
            </span>
            <span
              v-if="urlAnalysis.readability.isHumanReadable"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400"
            >
              <CheckCircle class="h-3 w-3" />
              {{ t('seo.urlAnalysis.readability') }}
            </span>
          </div>
        </div>
      </div>

      <!-- URL Metrics -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="p-2 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-muted mb-1">
            <Type class="h-3.5 w-3.5" />
            <span class="text-xs">{{ t('seo.urlAnalysis.length') }}</span>
          </div>
          <p class="text-sm font-medium text-body">
            {{ urlAnalysis.length }}
            <span class="text-xs text-muted">{{ t('seo.urlAnalysis.characters') }}</span>
          </p>
        </div>

        <div class="p-2 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-muted mb-1">
            <Layers class="h-3.5 w-3.5" />
            <span class="text-xs">{{ t('seo.urlAnalysis.depth') }}</span>
          </div>
          <p class="text-sm font-medium text-body">
            {{ urlAnalysis.depth }}
            <span class="text-xs text-muted">{{ t('seo.urlAnalysis.levels') }}</span>
          </p>
        </div>

        <div class="p-2 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-muted mb-1">
            <Hash class="h-3.5 w-3.5" />
            <span class="text-xs">{{ t('seo.urlAnalysis.queryParams') }}</span>
          </div>
          <p class="text-sm font-medium text-body">{{ urlAnalysis.queryParams.size }}</p>
        </div>

        <div class="p-2 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-muted mb-1">
            <Link class="h-3.5 w-3.5" />
            <span class="text-xs">{{ t('seo.urlAnalysis.path') }}</span>
          </div>
          <p class="text-sm font-medium text-body truncate" :title="urlAnalysis.pathname">
            {{ urlAnalysis.pathname || '/' }}
          </p>
        </div>
      </div>

      <!-- Readability Checks -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div class="flex items-center gap-2">
          <component
            :is="urlAnalysis.readability.hasUnderscores ? XCircle : CheckCircle"
            :class="[
              'h-3.5 w-3.5',
              urlAnalysis.readability.hasUnderscores ? 'text-red-500' : 'text-green-500',
            ]"
          />
          <span class="text-muted">{{ t('seo.urlAnalysis.underscores') }}</span>
        </div>

        <div class="flex items-center gap-2">
          <component
            :is="urlAnalysis.readability.hasUppercase ? XCircle : CheckCircle"
            :class="[
              'h-3.5 w-3.5',
              urlAnalysis.readability.hasUppercase ? 'text-red-500' : 'text-green-500',
            ]"
          />
          <span class="text-muted">{{ t('seo.urlAnalysis.uppercase') }}</span>
        </div>

        <div class="flex items-center gap-2">
          <component
            :is="urlAnalysis.readability.hasSpecialChars ? XCircle : CheckCircle"
            :class="[
              'h-3.5 w-3.5',
              urlAnalysis.readability.hasSpecialChars ? 'text-red-500' : 'text-green-500',
            ]"
          />
          <span class="text-muted">{{ t('seo.urlAnalysis.specialChars') }}</span>
        </div>

        <div class="flex items-center gap-2">
          <component
            :is="urlAnalysis.readability.hasKeywords ? CheckCircle : XCircle"
            :class="[
              'h-3.5 w-3.5',
              urlAnalysis.readability.hasKeywords ? 'text-green-500' : 'text-amber-500',
            ]"
          />
          <span class="text-muted">{{ t('seo.urlAnalysis.keywords') }}</span>
        </div>
      </div>

      <!-- Issues -->
      <div
        v-if="urlAnalysis.issues.length > 0"
        class="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"
      >
        <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
          <AlertTriangle class="h-4 w-4" />
          <span class="font-medium text-sm">{{ t('seo.urlAnalysis.issues') }}</span>
        </div>
        <ul class="space-y-1">
          <li
            v-for="(issue, index) in urlAnalysis.issues"
            :key="index"
            class="text-xs text-amber-700 dark:text-amber-300 pl-6"
          >
            • {{ issue }}
          </li>
        </ul>
      </div>

      <p class="text-xs text-muted">{{ t('seo.urlAnalysis.description') }}</p>
    </div>
  </AnalysisSection>
</template>
