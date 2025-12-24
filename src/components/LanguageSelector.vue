<script setup lang="ts">
/**
 * @fileoverview Dropdown for selecting the application's language (locale).
 */

import { Languages } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import DropdownSelector from '@/components/ui/DropdownSelector.vue';
import { useLocale } from '@/composables/useI18n';
import type { LocaleInfo } from '@/composables/useI18n';

const { t } = useI18n();
const { currentLocale, setLocale, availableLocales } = useLocale();

/** Currently selected locale info. */
const currentOption = computed(() => {
  const match = availableLocales.value.find((locale) => locale.code === currentLocale.value);
  return match ?? availableLocales.value[0];
});

const handleSelect = (item: LocaleInfo) => {
  setLocale(item.code);
};
</script>

<template>
  <DropdownSelector
    :items="availableLocales"
    :model-value="currentLocale"
    :ariaLabel="
      t('language.selector.aria_label', { language: currentOption?.nativeName ?? currentLocale })
    "
    :get-key="(item) => (item as LocaleInfo).code"
    id-prefix="locale-option"
    @select="(item) => handleSelect(item as LocaleInfo)"
  >
    <template #trigger>
      <Languages class="h-4 w-4" aria-hidden="true" />
      <span class="hidden sm:inline">{{ currentOption?.nativeName ?? currentLocale }}</span>
    </template>

    <template #option="{ item }">
      <span class="flex-1">{{ (item as LocaleInfo).nativeName }}</span>
    </template>
  </DropdownSelector>
</template>
