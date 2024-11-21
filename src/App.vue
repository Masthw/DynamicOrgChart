<template>
  <div class="container">
    <Person />
  </div>
</template>

<script>
import Person from "./components/Person.vue";

export default {
  components: {
    Person,
  },
};
</script>

<style>
/* Centraliza o componente na tela */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
  margin: 0;
}
</style>
