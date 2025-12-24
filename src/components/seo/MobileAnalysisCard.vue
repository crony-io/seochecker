<script setup lang="ts">
import { CheckCircle, XCircle, AlertTriangle, Image, Type, Hand } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { MobileAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

defineProps<{
  mobile: MobileAnalysis;
}>();

const { t } = useI18n();
</script>

<template>
  <AnalysisSection :title="t('seo.mobile.title')" :status="mobile.status">
    <div class="space-y-4">
      <!-- Summary Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="text-center p-3 rounded-lg bg-surface">
          <div class="flex justify-center mb-2">
            <CheckCircle
              v-if="mobile.hasViewport"
              class="h-6 w-6 text-green-500"
              aria-hidden="true"
            />
            <XCircle v-else class="h-6 w-6 text-red-500" aria-hidden="true" />
          </div>
          <p class="text-xs text-muted">{{ t('seo.mobile.viewport') }}</p>
        </div>

        <div class="text-center p-3 rounded-lg bg-surface">
          <p class="text-2xl font-bold text-body">{{ mobile.imagesWithSrcset }}</p>
          <p class="text-xs text-muted">{{ t('seo.mobile.responsiveImages') }}</p>
        </div>

        <div class="text-center p-3 rounded-lg bg-surface">
          <p class="text-2xl font-bold text-body">{{ mobile.pictureElements }}</p>
          <p class="text-xs text-muted">{{ t('seo.mobile.pictureElements') }}</p>
        </div>

        <div class="text-center p-3 rounded-lg bg-surface">
          <div class="flex justify-center mb-2">
            <CheckCircle
              v-if="mobile.mediaQueries"
              class="h-6 w-6 text-green-500"
              aria-hidden="true"
            />
            <XCircle v-else class="h-6 w-6 text-yellow-500" aria-hidden="true" />
          </div>
          <p class="text-xs text-muted">{{ t('seo.mobile.mediaQueries') }}</p>
        </div>
      </div>

      <!-- Viewport Content -->
      <div v-if="mobile.viewportContent" class="p-3 rounded-lg bg-surface">
        <p class="text-xs text-muted mb-1">{{ t('seo.mobile.viewportContent') }}:</p>
        <code class="text-xs text-body break-all">{{ mobile.viewportContent }}</code>
      </div>

      <!-- Checks -->
      <div class="space-y-2">
        <div class="flex items-center gap-2 p-2 rounded-lg bg-surface">
          <Image class="h-4 w-4 text-muted" aria-hidden="true" />
          <span class="text-sm text-body flex-1">{{ t('seo.mobile.responsiveImagesCheck') }}</span>
          <CheckCircle
            v-if="mobile.hasResponsiveImages"
            class="h-4 w-4 text-green-500"
            aria-hidden="true"
          />
          <XCircle v-else class="h-4 w-4 text-yellow-500" aria-hidden="true" />
        </div>

        <div class="flex items-center gap-2 p-2 rounded-lg bg-surface">
          <Type class="h-4 w-4 text-muted" aria-hidden="true" />
          <span class="text-sm text-body flex-1">{{ t('seo.mobile.fontSizes') }}</span>
          <CheckCircle
            v-if="mobile.hasMobileFont"
            class="h-4 w-4 text-green-500"
            aria-hidden="true"
          />
          <span v-else class="text-xs text-yellow-500">{{ mobile.smallFontCount }} issues</span>
        </div>

        <div class="flex items-center gap-2 p-2 rounded-lg bg-surface">
          <Hand class="h-4 w-4 text-muted" aria-hidden="true" />
          <span class="text-sm text-body flex-1">{{ t('seo.mobile.touchTargets') }}</span>
          <CheckCircle
            v-if="mobile.touchTargetIssues === 0"
            class="h-4 w-4 text-green-500"
            aria-hidden="true"
          />
          <span v-else class="text-xs text-yellow-500">{{ mobile.touchTargetIssues }} issues</span>
        </div>
      </div>

      <!-- Issues -->
      <div v-if="mobile.issues.length > 0" class="space-y-2">
        <h4 class="text-sm font-medium text-body">{{ t('seo.mobile.issues') }}</h4>
        <div
          v-for="(issue, index) in mobile.issues"
          :key="index"
          class="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/10"
        >
          <AlertTriangle class="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" aria-hidden="true" />
          <p class="text-xs text-body">{{ issue }}</p>
        </div>
      </div>
    </div>
  </AnalysisSection>
</template>
