<template>
  <button :class="['custom-button', variant]" @click="$emit('click')">
    <q-icon v-if="icon" :name="icon" class="button-icon" size="18px" />
    <span class="button-text">{{ label }}</span>
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'primary', // 'primary' ou 'secondary'
    validator: (value) => ['primary', 'secondary'].includes(value),
  },
});
</script>

<style scoped lang="scss">
.custom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;

  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.primary {
    background-color: $white;
    color: $orange;
    border: 1px solid $orange;

    &:hover {
      background-color: $orange;
      color: $white;
    }
  }

  &.secondary {
    background-color: $orange;
    color: $white;
    border: 1px solid $orange;

    &:hover {
      background-color: $white;
      color: $orange;
    }
  }

  .button-icon {
    margin-right: 0.5rem;
  }

  .button-text {
    line-height: 1;
  }
}
</style>
