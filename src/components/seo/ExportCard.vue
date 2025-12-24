<script setup lang="ts">
import { Download, FileJson, FileSpreadsheet, FileText } from 'lucide-vue-next';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { SeoAnalysisResult } from '@/types/seo';
import { exportAsJson, exportAsCsv, exportAsPdf } from '@/utils/exportReport';

const props = defineProps<{
  result: SeoAnalysisResult;
}>();

const { t } = useI18n();

const isExporting = ref(false);

async function handleExportJson(): Promise<void> {
  isExporting.value = true;
  try {
    exportAsJson(props.result);
  } finally {
    setTimeout(() => {
      isExporting.value = false;
    }, 500);
  }
}

async function handleExportCsv(): Promise<void> {
  isExporting.value = true;
  try {
    exportAsCsv(props.result);
  } finally {
    setTimeout(() => {
      isExporting.value = false;
    }, 500);
  }
}

async function handleExportPdf(): Promise<void> {
  isExporting.value = true;
  try {
    exportAsPdf(props.result);
  } finally {
    setTimeout(() => {
      isExporting.value = false;
    }, 500);
  }
}
</script>

<template>
  <div class="glass-card p-4">
    <div class="flex items-center gap-2 mb-4">
      <Download class="h-5 w-5 text-accent" aria-hidden="true" />
      <h3 class="text-lg font-semibold text-body">{{ t('seo.export.title') }}</h3>
    </div>

    <div class="flex flex-wrap gap-3">
      <button
        type="button"
        class="btn-outline flex items-center gap-2 text-sm"
        :disabled="isExporting"
        @click="handleExportJson"
      >
        <FileJson class="h-4 w-4" aria-hidden="true" />
        {{ t('seo.export.json') }}
      </button>

      <button
        type="button"
        class="btn-outline flex items-center gap-2 text-sm"
        :disabled="isExporting"
        @click="handleExportCsv"
      >
        <FileSpreadsheet class="h-4 w-4" aria-hidden="true" />
        {{ t('seo.export.csv') }}
      </button>

      <button
        type="button"
        class="btn-outline flex items-center gap-2 text-sm"
        :disabled="isExporting"
        @click="handleExportPdf"
      >
        <FileText class="h-4 w-4" aria-hidden="true" />
        {{ t('seo.export.pdf') }}
      </button>
    </div>
  </div>
</template>
