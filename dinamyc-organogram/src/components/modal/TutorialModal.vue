<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="tutorial-modal">
      <!-- Conteúdo do tutorial -->
      <div v-if="currentPage === 1">
        <h2>Bem-vindo ao Organiza!</h2>
        <p>Comece arrastando e soltando nós para estruturar sua organização.</p>
      </div>

      <div v-else-if="currentPage === 2">
        <h2>Adição de Elementos</h2>
        <p>Clique no ícone ➕ para adicionar departamentos, vagas ou colaboradores.</p>
      </div>

      <div class="navigation">
        <q-btn v-if="currentPage > 1" icon="arrow_back" @click="currentPage--" flat />

        <q-btn :label="currentPage === 3 ? 'Começar' : 'Próximo'" color="primary" @click="currentPage < 3 ? currentPage++ : finishTutorial()" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue', 'finish']);
const isOpen = ref(props.modelValue);
const currentPage = ref(1);
const route = useRoute();

watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      currentPage.value = 1;
    }
  },
  { immediate: true }
);

function closeModal() {
  emit('update:modelValue', false);
}

function finishTutorial() {
  const orgChartId = route.params.id;
  if (orgChartId) {
    localStorage.setItem(`tutorialShown_${orgChartId}`, 'true');
  }
  emit('finish');
  closeModal();
}
</script>

<style scoped>
.tutorial-modal {
  width: 800px;
  max-width: 90vw;
  padding: 20px;
}

.tutorial-modal img {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 15px 0;
}

.navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
