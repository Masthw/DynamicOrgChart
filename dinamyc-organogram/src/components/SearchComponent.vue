<template>
  <div class="search-component">
    <input name="search" type="text" :placeholder="placeholder" @input="onInput" />
    <img src="src/assets/icons/search.png" alt="Buscar" class="search-icon" />
  </div>
</template>

<script>
export default {
  name: 'SearchComponent',
  props: {
    placeholder: {
      type: String,
      default: 'Buscar Empregado ou Departamento',
    },
  },
  methods: {
    onInput(event) {
      const searchTerm = event.target.value;
      this.$emit('search-input', searchTerm);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-component {
  margin-left: 30px;
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 440px;
  height: 40px;
  border-radius: 20px;
  background-color: $white;
  padding: 5px;
  font-size: 16px;
  color: $background-gray;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  outline: none;

  input {
    flex-grow: 1;
    border: none;
    background: transparent;
    padding-left: 10px;
    font-size: 16px;
    color: $gray;
    &:focus {
      outline: none;
    }
  }

  .search-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    cursor: pointer;
    filter: brightness(0) saturate(100%) invert(55%) sepia(73%) saturate(552%) hue-rotate(3deg) brightness(94%) contrast(97%);
  }
}
</style>
