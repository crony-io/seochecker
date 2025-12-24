<script setup lang="ts">
import { Globe, Loader2, Search, FileText } from 'lucide-vue-next';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

import { useSeoStore } from '@/stores/seo';

const { t } = useI18n();
const seoStore = useSeoStore();
const { url, isLoading, showManualInput, manualHtml, error } = storeToRefs(seoStore);

const inputUrl = ref(url.value);

function handleSubmit(): void {
  if (!inputUrl.value.trim() || isLoading.value) {
    return;
  }
  seoStore.analyze(inputUrl.value);
}

function handleManualSubmit(): void {
  seoStore.analyzeManualHtml();
}

function handleManualHtmlChange(event: Event): void {
  const target = event.target as HTMLTextAreaElement;
  seoStore.setManualHtml(target.value);
}
</script>

<template>
  <div class="w-full">
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Globe
            class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="seo-url-input"
            v-model="inputUrl"
            type="text"
            name="url"
            :placeholder="t('seo.urlInput.placeholder')"
            class="form-control pl-12 pr-4"
            :disabled="isLoading"
            autocomplete="url"
          />
        </div>
        <button
          type="submit"
          class="btn-primary flex items-center justify-center gap-2 min-w-[140px]"
          :disabled="isLoading || !inputUrl.trim()"
        >
          <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin" aria-hidden="true" />
          <Search v-else class="h-5 w-5" aria-hidden="true" />
          <span>{{ isLoading ? t('seo.urlInput.analyzing') : t('seo.urlInput.analyze') }}</span>
        </button>
      </div>

      <div v-if="error && showManualInput" class="glass-card p-4">
        <div class="flex items-start gap-3 mb-4">
          <FileText class="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p class="font-medium text-body">{{ t('seo.urlInput.corsError') }}</p>
            <p class="text-sm text-muted mt-1">{{ t('seo.urlInput.pasteHtml') }}</p>
          </div>
        </div>
        <textarea
          :value="manualHtml"
          @input="handleManualHtmlChange"
          :placeholder="t('seo.urlInput.htmlPlaceholder')"
          class="form-control form-control-textarea min-h-[200px] font-mono text-sm"
          rows="8"
        />
        <button
          type="button"
          class="btn-primary mt-3"
          :disabled="!manualHtml.trim()"
          @click="handleManualSubmit"
        >
          {{ t('seo.urlInput.analyzeHtml') }}
        </button>
      </div>
    </form>
  </div>
</template>
