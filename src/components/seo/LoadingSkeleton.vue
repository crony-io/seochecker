<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="space-y-6 animate-pulse">
    <!-- Header skeleton -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="h-7 w-48 bg-surface rounded" />
        <div class="h-4 w-64 bg-surface rounded mt-2" />
        <div class="h-3 w-40 bg-surface rounded mt-2" />
      </div>
      <div class="h-10 w-32 bg-surface rounded" />
    </div>

    <!-- Score and summary skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="glass-card p-6 flex flex-col items-center">
        <div class="w-32 h-32 rounded-full bg-surface" />
        <div class="h-6 w-24 bg-surface rounded mt-4" />
        <div class="h-5 w-20 bg-surface rounded mt-2" />
      </div>
      <div class="md:col-span-2 glass-card p-6">
        <div class="h-6 w-32 bg-surface rounded mb-4" />
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="text-center">
            <div class="h-8 w-16 bg-surface rounded mx-auto" />
            <div class="h-3 w-12 bg-surface rounded mx-auto mt-2" />
          </div>
        </div>
      </div>
    </div>

    <!-- Analysis sections skeleton -->
    <div v-for="i in 4" :key="i" class="glass-card overflow-hidden">
      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-6 w-32 bg-surface rounded" />
          <div class="h-6 w-16 bg-surface rounded-full" />
        </div>
        <div class="h-5 w-5 bg-surface rounded" />
      </div>
      <div class="border-t border-border p-4">
        <div class="space-y-3">
          <div class="h-4 w-full bg-surface rounded" />
          <div class="h-4 w-3/4 bg-surface rounded" />
          <div class="h-4 w-1/2 bg-surface rounded" />
        </div>
      </div>
    </div>

    <!-- Loading indicator -->
    <div
      class="fixed bottom-6 right-6 flex items-center gap-3 bg-primary text-white px-4 py-3 rounded-full shadow-lg"
    >
      <Loader2 class="h-5 w-5 animate-spin" aria-hidden="true" />
      <span class="text-sm font-medium">{{ t('seo.urlInput.analyzing') }}</span>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-pulse > * {
  animation: shimmer 1.5s infinite linear;
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    var(--color-surface-hover) 50%,
    var(--color-surface) 75%
  );
  background-size: 200% 100%;
}
</style>
