<script setup lang="ts">
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next';
import { computed } from 'vue';

import type { SeoStatus } from '@/types/seo';

const props = defineProps<{
  status: SeoStatus;
  showIcon?: boolean;
}>();

const statusConfig = computed(() => {
  switch (props.status) {
    case 'good':
      return {
        icon: CheckCircle,
        bgClass: 'bg-green-500/10',
        textClass: 'text-green-600 dark:text-green-400',
        borderClass: 'border-green-500/20',
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        bgClass: 'bg-yellow-500/10',
        textClass: 'text-yellow-600 dark:text-yellow-400',
        borderClass: 'border-yellow-500/20',
      };
    case 'error':
      return {
        icon: AlertCircle,
        bgClass: 'bg-red-500/10',
        textClass: 'text-red-600 dark:text-red-400',
        borderClass: 'border-red-500/20',
      };
    case 'info':
    default:
      return {
        icon: Info,
        bgClass: 'bg-blue-500/10',
        textClass: 'text-blue-600 dark:text-blue-400',
        borderClass: 'border-blue-500/20',
      };
  }
});
</script>

<template>
  <span
    :class="[
      statusConfig.bgClass,
      statusConfig.textClass,
      statusConfig.borderClass,
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
    ]"
  >
    <component
      v-if="showIcon !== false"
      :is="statusConfig.icon"
      class="h-3.5 w-3.5"
      aria-hidden="true"
    />
    <slot />
  </span>
</template>
