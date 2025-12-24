<script setup lang="ts">
defineProps<{
  id: string;
  message?: string;
}>();
</script>

<template>
  <p v-if="message" :id="id" class="mt-1 text-sm text-error">
    {{ $t(message) }}
  </p>
</template>
