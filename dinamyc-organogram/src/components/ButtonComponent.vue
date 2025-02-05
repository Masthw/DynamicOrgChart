<template>
  <button :class="['custom-button', variant]" @click="$emit('click')">
    <img v-if="icon" :src="icon" :alt="label" class="button-icon" />
    <span class="button-text">{{ label }}</span>
  </button>
</template>

<script setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
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
    default: 'primary',
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
    .button-icon {
      filter: brightness(0) saturate(100%) invert(28%) sepia(81%)
        saturate(4237%) hue-rotate(3deg) brightness(104%) contrast(106%);
    }

    &:hover {
      background-color: $orange;
      color: $white;
      .button-icon {
        filter: brightness(0) invert(1);
      }
    }
  }

  &.secondary {
    background-color: $orange;
    color: $white;
    border: 1px solid $orange;
    .button-icon {
      filter: brightness(0) invert(1);
    }

    &:hover {
      background-color: $white;
      color: $orange;

      .button-icon {
        filter: brightness(0) saturate(100%) invert(28%) sepia(81%)
          saturate(4237%) hue-rotate(3deg) brightness(104%) contrast(106%);
      }
    }
  }

  .button-icon {
    width: 18px;
    height: 18px;
    margin-right: 0.5rem;
  }

  .button-text {
    line-height: 1;
  }
}
</style>
