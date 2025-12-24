<script setup lang="ts">
import { CheckCircle, XCircle, Globe } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { TechnicalAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

defineProps<{
  technical: TechnicalAnalysis;
}>();

const { t } = useI18n();
</script>

<template>
  <AnalysisSection :title="t('seo.technical.title')" :status="technical.status">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="flex items-center gap-3 p-3 rounded-lg bg-surface">
        <component
          :is="technical.isHttps ? CheckCircle : XCircle"
          :class="['h-5 w-5', technical.isHttps ? 'text-green-500' : 'text-red-500']"
          aria-hidden="true"
        />
        <div>
          <p class="text-sm font-medium text-body">HTTPS</p>
          <p class="text-xs text-muted">
            {{ technical.isHttps ? t('seo.technical.secure') : t('seo.technical.notSecure') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 p-3 rounded-lg bg-surface">
        <component
          :is="technical.hasDoctype ? CheckCircle : XCircle"
          :class="['h-5 w-5', technical.hasDoctype ? 'text-green-500' : 'text-red-500']"
          aria-hidden="true"
        />
        <div>
          <p class="text-sm font-medium text-body">DOCTYPE</p>
          <p class="text-xs text-muted">
            {{ technical.hasDoctype ? t('seo.technical.present') : t('seo.technical.missing') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 p-3 rounded-lg bg-surface">
        <component
          :is="technical.hasCharset ? CheckCircle : XCircle"
          :class="['h-5 w-5', technical.hasCharset ? 'text-green-500' : 'text-red-500']"
          aria-hidden="true"
        />
        <div>
          <p class="text-sm font-medium text-body">{{ t('seo.technical.charset') }}</p>
          <p class="text-xs text-muted">
            {{ technical.hasCharset ? t('seo.technical.present') : t('seo.technical.missing') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 p-3 rounded-lg bg-surface">
        <component
          :is="technical.hasViewport ? CheckCircle : XCircle"
          :class="['h-5 w-5', technical.hasViewport ? 'text-green-500' : 'text-red-500']"
          aria-hidden="true"
        />
        <div>
          <p class="text-sm font-medium text-body">{{ t('seo.technical.viewport') }}</p>
          <p class="text-xs text-muted">
            {{ technical.hasViewport ? t('seo.technical.present') : t('seo.technical.missing') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 p-3 rounded-lg bg-surface">
        <component
          :is="technical.hasCanonical ? CheckCircle : XCircle"
          :class="['h-5 w-5', technical.hasCanonical ? 'text-green-500' : 'text-yellow-500']"
          aria-hidden="true"
        />
        <div>
          <p class="text-sm font-medium text-body">{{ t('seo.technical.canonical') }}</p>
          <p class="text-xs text-muted">
            {{ technical.hasCanonical ? t('seo.technical.present') : t('seo.technical.notSet') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 p-3 rounded-lg bg-surface">
        <component
          :is="technical.hasLanguage ? CheckCircle : XCircle"
          :class="['h-5 w-5', technical.hasLanguage ? 'text-green-500' : 'text-yellow-500']"
          aria-hidden="true"
        />
        <div>
          <p class="text-sm font-medium text-body">{{ t('seo.technical.language') }}</p>
          <p class="text-xs text-muted">
            {{ technical.hasLanguage ? t('seo.technical.present') : t('seo.technical.notSet') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 p-3 rounded-lg bg-surface">
        <component
          :is="technical.hasFavicon ? CheckCircle : XCircle"
          :class="['h-5 w-5', technical.hasFavicon ? 'text-green-500' : 'text-yellow-500']"
          aria-hidden="true"
        />
        <div>
          <p class="text-sm font-medium text-body">Favicon</p>
          <p class="text-xs text-muted">
            {{ technical.hasFavicon ? t('seo.technical.present') : t('seo.technical.notFound') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 p-3 rounded-lg bg-surface">
        <Globe class="h-5 w-5 text-muted" aria-hidden="true" />
        <div>
          <p class="text-sm font-medium text-body">{{ t('seo.technical.urlLength') }}</p>
          <p class="text-xs text-muted">{{ technical.urlLength }} {{ t('seo.meta.chars') }}</p>
        </div>
      </div>
    </div>
  </AnalysisSection>
</template>
