<template>
  <div :class="['custom-select', customClass]">
    <div class="selected-option" @click="toggleDropdown">
      <span>{{ selectedLabel || placeholder }}</span>
      <img
        :src="isOpen ? arrowUpIcon : arrowDownIcon"
        alt="Arrow"
        class="arrow-icon"
      />
    </div>
    <div v-if="isOpen" class="options-list">
      <div v-if="options.length === 0" class="empty-option">
        Nenhuma simulação cadastrada
      </div>
      <div
        v-for="option in options"
        :key="option.value"
        class="option-item"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script>
import arrowUpIcon from 'src/assets/icons/arrow_up_orange.png';
import arrowDownIcon from 'src/assets/icons/arrow_down.png';

export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Selecione uma opção',
    },
    modelValue: {
      type: [String, Number, Array],
      default: '',
    },
    customClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isOpen: false,
      selectedOption: null,
      selectedLabel: '',
      arrowUpIcon,
      arrowDownIcon,
    };
  },
  watch: {
    modelValue(newValue) {
      const selectedOption = this.options.find(
        (option) => option.value === newValue
      );
      this.selectedLabel = selectedOption ? selectedOption.label : '';
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.selectedOption = option.value;
      this.selectedLabel = option.label;
      this.isOpen = false;
      this.$emit('update:modelValue', option.value);
    },
  },
  created() {
    const selectedOption = this.options.find(
      (option) => option.value === this.modelValue
    );
    this.selectedLabel = selectedOption ? selectedOption.label : '';
  },
};
</script>

<style lang="scss" scoped>
.custom-select {
  position: relative;
  display: inline-block;
  width: 280px;
  height: 40px;
  border-radius: 20px;
  background-color: $white;
  padding: 5px;
  font-size: 16px;
  border-color: $background-gray;
  color: $background-gray;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  outline: none;
}

.selected-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding-left: 10px;
  padding-right: 10px;
  height: 100%;
  outline: none;
}

.options-list {
  margin-top: 5px;
  padding: 10px;
  position: absolute;
  width: 100%;
  background-color: $white;
  border: 1px solid $background-white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-top: none;
  border-radius: 10px;
  z-index: 10;
  max-height: 150px;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: $orange transparent;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: $orange;
    border-radius: 2px;
  }
}

.option-item {
  color: $gray;
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: $background-white;
  }
}

.option-item.selected {
  background-color: $background-gray;
}
</style>
