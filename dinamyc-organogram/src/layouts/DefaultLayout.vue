<template>
  <q-layout view="lHh Lpr lFf">
    <!-- App Bar aparece em todas as páginas -->
    <AppBar />

    <!-- Aqui é onde as páginas serão carregadas -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppBar from 'src/components/AppBar.vue';
</script>

<style scoped lang="scss">
.q-page-container {
  height: calc(100vh - 75px);
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
