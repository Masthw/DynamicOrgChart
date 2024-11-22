<template>
  <div class="container">
    <Organogram />
  </div>
</template>

<script>
import Organogram from "../dinamyc-organogram/src/components/Organogram.vue";
import Person from "../dinamyc-organogram/src/components/Person.vue";

export default {
  components: {
    Person,
    Organogram
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
