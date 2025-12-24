<script setup lang="ts" generic="ItemOption extends object">
/**
 * @fileoverview Dropdown selector component with slots for trigger and options.
 */

import { Check, ChevronDown } from 'lucide-vue-next';
import type { Ref } from 'vue';
import { computed, shallowRef, watch } from 'vue';

import { useDropdown } from '@/composables/useDropdown';

const props = defineProps<{
  /** Array of items to display in the dropdown. */
  items: ReadonlyArray<ItemOption>;
  /** Currently selected item key. */
  modelValue: string;
  /** Accessible label for the dropdown button. */
  ariaLabel: string;
  /** Function to extract unique key from each item. */
  getKey: (item: ItemOption) => string;
  /** Prefix for option IDs (for aria-activedescendant). */
  idPrefix?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'select', item: ItemOption): void;
}>();

const itemsRef = shallowRef<ItemOption[]>([...props.items]);

watch(
  () => props.items,
  (val) => (itemsRef.value = [...val]),
);

const handleSelect = (item: ItemOption) => {
  emit('update:modelValue', props.getKey(item));
  emit('select', item);
};

const { isOpen, focusedIndex, toggle, handleKeydown, containerRef } = useDropdown<ItemOption>({
  items: itemsRef as Ref<ItemOption[]>,
  getKey: props.getKey,
  onSelect: handleSelect,
});

const idPrefix = computed(() => props.idPrefix ?? 'dropdown-option');
const activeDescendant = computed(() => `${idPrefix.value}-${props.modelValue}`);
</script>

<template>
  <div ref="containerRef" class="relative" @keydown="handleKeydown">
    <button
      type="button"
      class="form-control-inline glass-hover flex items-center gap-2 text-sm font-medium transition"
      @click="toggle"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-label="ariaLabel"
    >
      <slot name="trigger" />
      <ChevronDown
        class="h-4 w-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        aria-hidden="true"
      />
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <ul
        v-if="isOpen"
        class="dropdown-surface absolute right-0 z-50 mt-2 w-36 origin-top-right py-1"
        role="listbox"
        :aria-activedescendant="activeDescendant"
      >
        <li
          v-for="(item, index) in items"
          :key="getKey(item)"
          :id="`${idPrefix}-${getKey(item)}`"
          role="option"
          :aria-selected="modelValue === getKey(item)"
          class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition hover:bg-surface-hover"
          :class="[
            modelValue === getKey(item) ? 'text-body font-medium' : 'text-muted',
            focusedIndex === index ? 'bg-surface-hover/20' : '',
          ]"
          @click="handleSelect(item)"
        >
          <slot name="option" :item="item" :selected="modelValue === getKey(item)">
            <span class="flex-1">{{ getKey(item) }}</span>
          </slot>
          <Check v-if="modelValue === getKey(item)" class="h-4 w-4 shrink-0" aria-hidden="true" />
        </li>
      </ul>
    </Transition>
  </div>
</template>
