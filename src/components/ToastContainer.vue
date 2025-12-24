<script setup lang="ts">
import { computed } from 'vue';
import { CheckCircle, Info, X, XCircle } from 'lucide-vue-next';
import { useToast, type ToastType } from '@/composables/useToast';

const { toasts, removeToast } = useToast();

const iconByType = computed(() => {
  const map: Record<ToastType, typeof CheckCircle> = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  };
  return map;
});

const classesByType = computed(() => {
  return {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100',
    error: 'border-red-500/30 bg-red-500/10 text-red-900 dark:text-red-100',
    info: 'border-sky-500/30 bg-sky-500/10 text-sky-900 dark:text-sky-100',
  } satisfies Record<ToastType, string>;
});
</script>

<template>
  <div
    class="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2"
  >
    <TransitionGroup
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
      move-class="transition-transform"
      tag="div"
      class="flex flex-col gap-2"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-xl"
        :class="classesByType[toast.type]"
        role="status"
        aria-live="polite"
      >
        <component :is="iconByType[toast.type]" class="mt-0.5 h-5 w-5" aria-hidden="true" />
        <div class="flex-1 text-sm font-medium">
          {{ toast.message }}
        </div>
        <button
          type="button"
          class="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
          :aria-label="$t('common.close')"
          @click="removeToast(toast.id)"
        >
          <X class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
