<template>
  <ErrorBoundary>
    <AppLayout>
      <AboutView v-if="activeView === 'about'" />
      <HomeView v-else />
    </AppLayout>
  </ErrorBoundary>
</template>

<script setup lang="ts">
/**
 * @fileoverview Root application component.
 */
import { storeToRefs } from 'pinia';

import AppLayout from '@/components/AppLayout.vue';
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue';
import { useUiStore } from '@/stores/ui';
import AboutView from '@/views/AboutView.vue';
import HomeView from '@/views/HomeView.vue';

const uiStore = useUiStore();
const { activeView } = storeToRefs(uiStore);
</script>
