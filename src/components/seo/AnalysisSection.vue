<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { ref } from 'vue';

import type { SeoStatus } from '@/types/seo';
import StatusBadge from '@/components/seo/StatusBadge.vue';

defineProps<{
  title: string;
  status: SeoStatus;
  defaultOpen?: boolean;
}>();

const isOpen = ref(false);

function toggle(): void {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <div class="glass-card overflow-hidden">
    <button
      type="button"
      class="w-full flex items-center justify-between p-4 text-left hover:bg-surface-hover transition-colors"
      @click="toggle"
      :aria-expanded="isOpen"
    >
      <div class="flex items-center gap-3">
        <h3 class="text-lg font-semibold text-body">{{ title }}</h3>
        <StatusBadge :status="status" :show-icon="false">
          {{ status }}
        </StatusBadge>
      </div>
      <ChevronDown
        class="h-5 w-5 text-muted transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        aria-hidden="true"
      />
    </button>
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-[2000px] opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="max-h-[2000px] opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-show="isOpen" class="border-t border-border">
        <div class="p-4">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>
