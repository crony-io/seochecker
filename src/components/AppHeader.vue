<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import LanguageSelector from '@/components/LanguageSelector.vue';
import ThemeSelector from '@/components/ThemeSelector.vue';
import AppLogo from '@/components/ui/AppLogo.vue';
import OptionButtonGroup from '@/components/ui/OptionButtonGroup.vue';
import { useUiStore } from '@/stores/ui';
import { ACTIVE_VIEWS, type ActiveView } from '@/types/ui';

const uiStore = useUiStore();
const { activeView } = storeToRefs(uiStore);

const { t } = useI18n();

const isMobileMenuOpen = ref(false);

function toggleMobileMenu(): void {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu(): void {
  isMobileMenuOpen.value = false;
}

const viewOptions = computed(
  () =>
    [
      { value: 'home', label: t('navigation.home') },
      { value: 'about', label: t('navigation.about') },
    ] as const,
);

function handleActiveViewChange(value: string | number): void {
  if (typeof value !== 'string') {
    return;
  }

  const candidate = value as ActiveView;
  if (!ACTIVE_VIEWS.includes(candidate)) {
    return;
  }

  uiStore.setActiveView(candidate);
  closeMobileMenu();
}
</script>
<template>
  <header class="border-b border-border">
    <div class="mx-auto p-4">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo/Title -->
        <div class="flex items-center space-x-3 shrink-0">
          <AppLogo class="h-8 w-8 text-accent" aria-hidden="true" />
          <h1 class="text-xl font-semibold text-body">
            {{ $t('app.title') }}
          </h1>
        </div>

        <!-- Desktop Navigation -->
        <OptionButtonGroup
          :options="viewOptions"
          :model-value="activeView"
          container-class="hidden md:flex flex-wrap justify-center gap-2"
          button-class="btn-ghost px-3 py-2 text-sm"
          active-button-class="ring-2 ring-accent"
          @update:modelValue="handleActiveViewChange"
        />

        <!-- Desktop Controls -->
        <div class="hidden md:flex items-center space-x-4 shrink-0">
          <LanguageSelector />
          <ThemeSelector />
        </div>

        <!-- Mobile Menu Button -->
        <button
          type="button"
          class="md:hidden btn-ghost p-2"
          :aria-label="$t('navigation.toggleMenu')"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          @click="toggleMobileMenu"
        >
          <Menu v-if="!isMobileMenuOpen" class="h-6 w-6" aria-hidden="true" />
          <X v-else class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        v-show="isMobileMenuOpen"
        id="mobile-menu"
        class="md:hidden mt-4 pb-2 border-t border-border pt-4"
      >
        <!-- Mobile Navigation -->
        <nav class="flex flex-col space-y-2 mb-4">
          <button
            v-for="option in viewOptions"
            :key="option.value"
            type="button"
            class="btn-ghost px-3 py-2 text-left text-sm"
            :class="{ 'ring-2 ring-accent': activeView === option.value }"
            @click="handleActiveViewChange(option.value)"
          >
            {{ option.label }}
          </button>
        </nav>

        <!-- Mobile Controls -->
        <div class="flex items-center justify-end pt-2 border-t border-border">
          <LanguageSelector />
          <ThemeSelector />
        </div>
      </div>
    </div>
  </header>
</template>
