<script setup lang="ts">
/**
 * @fileoverview Dropdown for selecting the application's theme appearance.
 */

import { Monitor, Moon, Sun } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import DropdownSelector from '@/components/ui/DropdownSelector.vue';
import { useAppearance } from '@/composables/useAppearance';
import type { Appearance } from '@/types/appearance';

const { t } = useI18n();
const { appearance, updateAppearance } = useAppearance();

/** Available theme options with their icons. */
const options = [
  { value: 'light', labelKey: 'theme.options.light', icon: Sun },
  { value: 'dark', labelKey: 'theme.options.dark', icon: Moon },
  { value: 'system', labelKey: 'theme.options.system', icon: Monitor },
] as const satisfies ReadonlyArray<{ value: Appearance; labelKey: string; icon: typeof Sun }>;

type ThemeOption = (typeof options)[number];

/** Currently selected theme option. */
const currentOption = computed<ThemeOption>(
  () => options.find((option) => option.value === appearance.value) ?? options[2],
);

const currentLabel = computed(() => t(currentOption.value.labelKey));

const handleSelect = (item: ThemeOption) => {
  updateAppearance(item.value);
};
</script>

<template>
  <DropdownSelector
    :items="options"
    :model-value="appearance"
    :ariaLabel="t('theme.selector.aria_label', { theme: currentLabel })"
    :get-key="(item) => (item as ThemeOption).value"
    id-prefix="theme-option"
    @select="(item) => handleSelect(item as ThemeOption)"
  >
    <template #trigger>
      <component :is="currentOption?.icon" class="h-4 w-4" aria-hidden="true" />
      <span class="hidden sm:inline">{{ currentLabel }}</span>
    </template>

    <template #option="{ item }">
      <component :is="(item as ThemeOption).icon" class="h-4 w-4" aria-hidden="true" />
      <span class="flex-1">{{ t((item as ThemeOption).labelKey) }}</span>
    </template>
  </DropdownSelector>
</template>
