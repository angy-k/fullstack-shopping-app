<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :label="label"
    :type="computedType"
    :rules="rules"
    :variant="variant"
    :prepend-inner-icon="prependIcon"
    :append-inner-icon="computedAppendIcon"
    @click:append-inner="togglePasswordVisibility"
    :autocomplete="autocomplete"
    :placeholder="placeholder"
    :hint="hint"
    :persistent-hint="persistentHint"
    :error-messages="errorMessages"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :density="density"
    :class="customClass"
  ></v-text-field>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'password', 'number', 'tel', 'url'].includes(value),
  },
  rules: {
    type: Array,
    default: () => [],
  },
  variant: {
    type: String,
    default: 'outlined',
  },
  prependIcon: {
    type: String,
    default: '',
  },
  appendIcon: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  persistentHint: {
    type: Boolean,
    default: false,
  },
  errorMessages: {
    type: [String, Array],
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  density: {
    type: String,
    default: 'default',
  },
  customClass: {
    type: String,
    default: '',
  },
  togglePassword: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

// Password visibility toggle
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  if (props.type === 'password' && props.togglePassword) {
    showPassword.value = !showPassword.value;
  }
};

const computedType = computed(() => {
  if (props.type === 'password' && props.togglePassword && showPassword.value) {
    return 'text';
  }
  return props.type;
});

const computedAppendIcon = computed(() => {
  if (props.type === 'password' && props.togglePassword) {
    return showPassword.value ? 'mdi-eye-off' : 'mdi-eye';
  }
  return props.appendIcon;
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
