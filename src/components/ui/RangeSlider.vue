<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string;
    modelValue: number;
    min: number;
    max: number;
    step?: number;
    label?: string;
    labelClass?: string;
    inputClass?: string;
    disabled?: boolean;
    valueText?: string | number;
    valueClass?: string;
  }>(),
  {
    step: 1,
    label: undefined,
    labelClass: 'form-label',
    inputClass: undefined,
    disabled: false,
    valueText: undefined,
    valueClass: 'w-16 text-sm text-muted',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).valueAsNumber);
}
</script>

<template>
  <div>
    <label v-if="props.label" :for="props.id" :class="props.labelClass">
      {{ props.label }}
    </label>

    <div :class="props.valueText === undefined ? undefined : 'flex items-center gap-3'">
      <input
        :id="props.id"
        type="range"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :value="props.modelValue"
        :disabled="props.disabled"
        :class="props.inputClass ?? (props.valueText === undefined ? 'w-full' : 'flex-1')"
        @input="onInput"
      />
      <span v-if="props.valueText !== undefined" :class="props.valueClass">
        {{ props.valueText }}
      </span>
    </div>
  </div>
</template>
