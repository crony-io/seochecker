<script setup lang="ts">
import { Check, X } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { SocialShareAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

defineProps<{
  socialShare: SocialShareAnalysis;
}>();

const { t } = useI18n();
</script>

<template>
  <AnalysisSection :title="t('seo.socialShare.title')" :status="socialShare.status">
    <div class="space-y-4">
      <!-- Summary -->
      <div class="flex items-center gap-4 text-sm">
        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium',
            socialShare.hasShareButtons
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
          ]"
        >
          {{
            socialShare.hasShareButtons
              ? t('seo.socialShare.detected')
              : t('seo.socialShare.notDetected')
          }}
        </span>
        <span
          v-if="socialShare.nativeShareApi"
          class="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent"
        >
          {{ t('seo.socialShare.nativeApi') }}
        </span>
      </div>

      <!-- Platforms Grid -->
      <div v-if="socialShare.platforms.length > 0">
        <p class="text-sm font-medium text-body mb-2">{{ t('seo.socialShare.platforms') }}</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div
            v-for="platform in socialShare.platforms"
            :key="platform.platform"
            :class="[
              'p-2 rounded-lg flex items-center gap-2 text-sm',
              platform.detected ? 'bg-green-500/10' : 'bg-surface',
            ]"
          >
            <component
              :is="platform.detected ? Check : X"
              :class="['h-4 w-4', platform.detected ? 'text-green-500' : 'text-muted']"
              aria-hidden="true"
            />
            <span :class="platform.detected ? 'text-body' : 'text-muted'">
              {{ platform.platform }}
            </span>
          </div>
        </div>
      </div>

      <!-- Share Widgets -->
      <div v-if="socialShare.shareWidgets.length > 0">
        <p class="text-sm font-medium text-body mb-2">{{ t('seo.socialShare.widgets') }}</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(widget, index) in socialShare.shareWidgets"
            :key="index"
            class="px-2 py-1 text-xs bg-accent/10 text-accent rounded"
          >
            {{ widget }}
          </span>
        </div>
      </div>

      <!-- Issues -->
      <div v-if="socialShare.issues.length > 0" class="space-y-1">
        <p v-for="(issue, index) in socialShare.issues" :key="index" class="text-sm text-muted">
          • {{ issue }}
        </p>
      </div>

      <p class="text-xs text-muted">{{ t('seo.socialShare.description') }}</p>
    </div>
  </AnalysisSection>
</template>
