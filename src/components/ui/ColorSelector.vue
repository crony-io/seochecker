<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string;
    modelValue: string;
    label?: string;
    labelClass?: string;
    pickerClass?: string;
    withText?: boolean;
    textInputClass?: string;
    textMaxLength?: number;
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    label: undefined,
    labelClass: 'form-label',
    pickerClass: 'h-10 min-w-10 cursor-pointer rounded border border-border',
    withText: true,
    textInputClass: 'form-control-inline flex-1 uppercase w-full',
    textMaxLength: 7,
    disabled: false,
    ariaLabel: undefined,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <div>
    <label v-if="props.label" :for="props.id" :class="props.labelClass">
      {{ props.label }}
    </label>

    <div class="flex items-center gap-2">
      <input
        :id="props.id"
        type="color"
        :value="props.modelValue"
        :disabled="props.disabled"
        :class="props.pickerClass"
        :aria-label="props.ariaLabel ?? props.label"
        @input="onInput"
      />
      <input
        v-if="props.withText"
        type="text"
        :value="props.modelValue"
        :disabled="props.disabled"
        :class="props.textInputClass"
        :maxlength="props.textMaxLength"
        @input="onInput"
      />
    </div>
  </div>
</template>
