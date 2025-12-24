<script setup lang="ts">
type OptionValue = string | number;

type OptionItem = {
  value: OptionValue;
  label?: string;
  disabled?: boolean;
  ariaLabel?: string;
} & Record<string, unknown>;

type OptionInput = OptionValue | OptionItem;

const props = withDefaults(
  defineProps<{
    options: readonly OptionInput[];
    modelValue: OptionValue;
    containerClass?: string;
    buttonClass?: string;
    activeButtonClass?: string;
  }>(),
  {
    containerClass: 'flex flex-wrap gap-2',
    buttonClass: 'btn-ghost px-3 py-2 text-xs',
    activeButtonClass: 'ring-2 ring-accent',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: OptionValue];
}>();

function normalizeOption(option: OptionInput): OptionItem {
  return typeof option === 'string' || typeof option === 'number' ? { value: option } : option;
}

function isSelected(option: OptionItem): boolean {
  return option.value === props.modelValue;
}

function select(option: OptionItem) {
  if (option.disabled) {
    return;
  }
  emit('update:modelValue', option.value);
}
</script>

<template>
  <div :class="props.containerClass">
    <button
      v-for="(raw, index) in props.options"
      :key="
        typeof raw === 'object' && raw !== null && 'value' in raw
          ? (raw as OptionItem).value
          : index
      "
      type="button"
      :class="[props.buttonClass, isSelected(normalizeOption(raw)) ? props.activeButtonClass : '']"
      :disabled="normalizeOption(raw).disabled"
      :aria-pressed="isSelected(normalizeOption(raw))"
      :aria-label="normalizeOption(raw).ariaLabel ?? normalizeOption(raw).label"
      @click="select(normalizeOption(raw))"
    >
      <slot
        name="option"
        :option="normalizeOption(raw)"
        :selected="isSelected(normalizeOption(raw))"
      >
        {{ normalizeOption(raw).label ?? normalizeOption(raw).value }}
      </slot>
    </button>
  </div>
</template>
