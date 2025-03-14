<template>
  <div :class="['custom-multiselect', customClass]">
    <!-- Área de exibição das opções selecionadas -->
    <div class="selected-options" @click="toggleDropdown">
      <div v-if="selectedOptions.length === 0" class="placeholder">
        {{ placeholder }}
      </div>
      <div v-else class="chips-container">
        <div class="chip" v-for="option in selectedOptions" :key="option.value">
          <span class="chip-bullet"></span>
          <span class="chip-label">{{ option.label }}</span>
          <span class="chip-close" @click.stop="removeOption(option)">×</span>
        </div>
      </div>
      <img :src="isOpen ? arrowUpIcon : arrowDownIcon" alt="Arrow" class="arrow-icon" />
    </div>
    <!-- Lista de opções do dropdown -->
    <div v-if="isOpen" class="options-list">
      <div v-if="options.length === 0" class="empty-option">Nenhuma opção disponível</div>
      <div v-for="option in options" :key="option.value" class="option-item" :class="{ selected: isSelected(option) }" @click="toggleOption(option)">
        <span class="option-bullet">
          <!-- Bolinha para indicar seleção -->
          <span v-if="isSelected(option)" class="selected-circle"></span>
        </span>
        <span class="option-label">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import arrowUpIcon from 'src/assets/icons/arrow_up_orange.png';
import arrowDownIcon from 'src/assets/icons/arrow_down.png';

export default {
  name: 'MultiSelectComponent',
  props: {
    options: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Selecione uma ou mais opções',
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    customClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isOpen: false,
      arrowUpIcon,
      arrowDownIcon,
    };
  },
  computed: {
    selectedOptions() {
      return this.options.filter((option) => this.modelValue.includes(option.value));
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    isSelected(option) {
      return this.modelValue.includes(option.value);
    },
    toggleOption(option) {
      let newValue = [...this.modelValue];
      if (this.isSelected(option)) {
        newValue = newValue.filter((val) => val !== option.value);
      } else {
        newValue.push(option.value);
      }
      this.$emit('update:modelValue', newValue);
    },
    removeOption(option) {
      const newValue = this.modelValue.filter((val) => val !== option.value);
      this.$emit('update:modelValue', newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-multiselect {
  position: relative;
  display: inline-block;
  width: 280px;
  min-height: 40px;
  border-radius: 20px;
  background-color: $white;
  padding: 5px 10px;
  font-size: 16px;
  color: $background-gray;
  cursor: pointer;
}

.selected-options {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 30px;
  gap: 5px;
  position: relative;
}

.placeholder {
  color: $background-gray;
  padding: 5px;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.chip {
  display: flex;
  align-items: center;
  background-color: $background-white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 14px;
  color: $gray;
}

.chip-bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: $orange;
  margin-right: 4px;
}

.chip-label {
  margin-right: 4px;
}

.chip-close {
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    color: $orange;
  }
}

.arrow-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.options-list {
  margin-top: 5px;
  padding: 10px;
  position: absolute;
  width: 95%;
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
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  color: $gray;
  &:hover {
    background-color: $background-white;
  }
}

.option-item.selected {
  background-color: $background-white;
}

.option-bullet {
  width: 10px;
  height: 10px;
  border: 1px solid $orange;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.selected-circle {
  width: 10px;
  height: 10px;
  background-color: $orange;
  border-radius: 50%;
}

.option-label {
  flex: 1;
}
</style>
