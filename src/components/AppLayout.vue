<script setup lang="ts">
import { onMounted } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import ToastContainer from '@/components/ToastContainer.vue';
import { useLocale } from '@/composables/useI18n';

const { initLocale } = useLocale();

onMounted(() => {
  initLocale();
});
</script>

<template>
  <Teleport to="body">
    <ToastContainer />
  </Teleport>
  <div class="min-h-screen text-body backdrop-blur-3xl relative z-10">
    <AppHeader />

    <main class="mx-auto px-4 py-8">
      <slot />
    </main>

    <AppFooter />
  </div>
  <div
    class="fixed top-4 left-4 w-64 h-64 lg:w-lg lg:h-lg xl:w-xl xl:h-xl rounded-full bg-conic/decreasing from-accent via-primary to-accent opacity-30"
  ></div>
</template>
