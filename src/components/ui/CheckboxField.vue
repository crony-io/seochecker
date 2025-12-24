<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string;
    modelValue: boolean;
    label?: string;
    labelClass?: string;
    inputClass?: string;
    wrapperClass?: string;
    disabled?: boolean;
  }>(),
  {
    label: undefined,
    labelClass: 'form-checkbox-label',
    inputClass: 'form-checkbox',
    wrapperClass: 'flex items-center gap-2',
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

function onChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).checked);
}
</script>

<template>
  <div :class="props.wrapperClass">
    <input
      :id="props.id"
      type="checkbox"
      :checked="props.modelValue"
      :disabled="props.disabled"
      :class="props.inputClass"
      @change="onChange"
    />
    <label v-if="props.label" :for="props.id" :class="props.labelClass">
      {{ props.label }}
    </label>
  </div>
</template>
