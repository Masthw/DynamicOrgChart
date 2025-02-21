<template>
  <div class="range-input">
    <input
      type="text"
      v-model="formattedMinValue"
      :placeholder="minPlaceholder"
      @input="onMinInput"
      @blur="onMinBlur"
      @focus="onFocus"
    />
    <span class="separator"> - </span>
    <input
      type="text"
      v-model="formattedMaxValue"
      :placeholder="maxPlaceholder"
      @input="onMaxInput"
      @blur="onMaxBlur"
      @focus="onFocus"
    />
  </div>
</template>

<script>
export default {
  name: 'RangeInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    minPlaceholder: {
      type: String,
      default: 'Min',
    },
    maxPlaceholder: {
      type: String,
      default: 'Max',
    },
  },
  data() {
    return {
      minValue: '',
      maxValue: '',
      formattedMinValue: '',
      formattedMaxValue: '',
    };
  },
  mounted() {
    if (this.value && this.value.includes('-')) {
      const [min, max] = this.value.split('-');
      this.minValue = parseFloat(min.trim());
      this.maxValue = parseFloat(max.trim());
      this.formattedMinValue = this.formatCurrency(this.minValue);
      this.formattedMaxValue = this.formatCurrency(this.maxValue);
    }
  },
  watch: {
    value(newVal) {
      if (newVal && newVal.includes('-')) {
        const [min, max] = newVal.split('-');
        this.minValue = parseFloat(min.trim());
        this.maxValue = parseFloat(max.trim());
        this.formattedMinValue = this.formatCurrency(this.minValue);
        this.formattedMaxValue = this.formatCurrency(this.maxValue);
      } else {
        this.minValue = '';
        this.maxValue = '';
        this.formattedMinValue = '';
        this.formattedMaxValue = '';
      }
    },
  },
  methods: {
    formatCurrency(value) {
      if (isNaN(value)) return '';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    },
    parseCurrency(value) {
      if (typeof value === 'string') {
        return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.'));
      }
      return value;
    },
    onMinInput(event) {
      const value = this.parseCurrency(event.target.value);
      this.minValue = value;
      this.formattedMinValue = event.target.value;
    },
    onMaxInput(event) {
      const value = this.parseCurrency(event.target.value);
      this.maxValue = value;
      this.formattedMaxValue = event.target.value;
    },
    onMinBlur() {
      if (this.minValue > this.maxValue) {
        this.maxValue = this.minValue;
        this.formattedMaxValue = this.formatCurrency(this.maxValue);
      }
      this.formattedMinValue = this.formatCurrency(this.minValue);
      this.updateValue();
    },
    onMaxBlur() {
      if (this.maxValue < this.minValue) {
        this.minValue = this.maxValue;
        this.formattedMinValue = this.formatCurrency(this.minValue);
      }
      this.formattedMaxValue = this.formatCurrency(this.maxValue);
      this.updateValue();
    },
    onFocus(event) {
      event.target.select();
    },
    updateValue() {
      let newValue = '';
      if (this.minValue !== '' || this.maxValue !== '') {
        newValue = `${this.minValue}-${this.maxValue}`;
      }
      this.$emit('input', newValue);
    },
  },
};
</script>

<style scoped lang="scss">
.range-input {
  display: flex;
  align-items: center;
}
.range-input input {
  width: 100%;
  padding: 4px 10px;
  box-sizing: border-box;
  border-radius: 14px;
  height: 38px;
  border: 1px solid $background-gray;
  color: $background-gray;
  transition: border-color 0.3s;
}

.range-input input:focus {
  border-color: $orange;
  outline: none;
}

.separator {
  margin: 0 8px;
}
</style>
