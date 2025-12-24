<script setup lang="ts">
import { AlertTriangle, RefreshCw } from 'lucide-vue-next';
import { ref, onErrorCaptured } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const error = ref<Error | null>(null);
const errorInfo = ref<string>('');

onErrorCaptured((err: Error, instance, info: string) => {
  error.value = err;
  errorInfo.value = info;

  // Log error for debugging
  console.error('Error captured by ErrorBoundary:', err);
  console.error('Component:', instance);
  console.error('Info:', info);

  // Prevent error from propagating further
  return false;
});

function handleRetry(): void {
  error.value = null;
  errorInfo.value = '';
}

function handleReload(): void {
  window.location.reload();
}
</script>

<template>
  <div v-if="error" class="min-h-[400px] flex items-center justify-center p-8">
    <div class="max-w-md w-full text-center">
      <div
        class="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6"
      >
        <AlertTriangle class="h-8 w-8 text-red-500" aria-hidden="true" />
      </div>

      <h2 class="text-xl font-bold text-body mb-2">
        {{ t('errors.boundary.title') }}
      </h2>

      <p class="text-muted mb-6">
        {{ t('errors.boundary.description') }}
      </p>

      <div class="bg-surface rounded-lg p-4 mb-6 text-left">
        <p class="text-sm font-mono text-red-500 break-all">
          {{ error.message }}
        </p>
        <p v-if="errorInfo" class="text-xs text-muted mt-2">
          {{ t('errors.boundary.component') }}: {{ errorInfo }}
        </p>
      </div>

      <div class="flex gap-3 justify-center">
        <button type="button" class="btn-outline flex items-center gap-2" @click="handleRetry">
          <RefreshCw class="h-4 w-4" aria-hidden="true" />
          {{ t('errors.boundary.retry') }}
        </button>
        <button type="button" class="btn-primary" @click="handleReload">
          {{ t('errors.boundary.reload') }}
        </button>
      </div>
    </div>
  </div>

  <slot v-else />
</template>
