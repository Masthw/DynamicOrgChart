<template>
  <div class="text-field-component">
    <!-- Label do campo -->
    <label v-if="label" class="field-label">
      {{ label }}<span v-if="required" class="required">*</span>
    </label>
    <!-- Campo de texto do Quasar -->
    <q-input
      v-model="localValue"
      outlined
      dense
      spellcheck="false"
      color="orange"
      :placeholder="placeholder"
      :rules="rules"
      class="text-input"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

// Computed para gerenciar o v-model
const localValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
</script>

<style scoped lang="scss">
.text-field-component {
  margin-bottom: 1rem;

  .field-label {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 0.3rem;
    display: block;
  }

  .required {
    color: $orange;
  }

  .text-input :deep(.q-field__control) {
    border-radius: 14px;
    background: $white;
  }
}
</style>
