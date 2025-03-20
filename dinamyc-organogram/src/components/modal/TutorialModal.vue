<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="tutorial-modal">
      <!-- Imagem no topo -->
      <img src="src/assets/images/tutorial.png" alt="Ilustração do tutorial" class="tutorial-image" />

      <!-- Conteúdo das páginas -->
      <div class="tutorial-content">
        <!-- Página 1 -->
        <div v-if="currentPage === 1">
          <h2><strong>Bem-Vindo(a) à criação da sua simulação!</strong></h2>
          <p>
            Você está prestes a dar o primeiro passo <br />
            para estruturar de forma clara e <br />
            organizada as relações e funções dentro <br />
            da sua organização. Uma simulação <br />
            permite que você visualize hierarquias, <br />
            departamentos e conexões entre <br />
            diferentes áreas e equipes, facilitando o <br />
            entendimento e a comunicação interna.
          </p>
        </div>

        <!-- Página 2 -->
        <div v-if="currentPage === 2">
          <h2><strong>Como começar?</strong></h2>
          <ol class="steps-list">
            <li><strong>Defina níveis hierárquicos:</strong> Quem estará no topo? Ex: Gestores.</li>
            <li><strong>Adicione cargos ou departamentos:</strong> Insira as posições ou setores que farão parte da estrutura.</li>
            <li><strong>Crie conexões:</strong> Estabeleça as relações entre os cargos, indicando subordinações e colaborações.</li>
          </ol>
        </div>

        <!-- Página 3 -->
        <div v-if="currentPage === 3" class="page-three">
          <p>Você pode personalizar a simulação conforme as necessidades da empresa, seja uma estrutura simples ou mais detalhada.</p>
          <p>Dica: Concentre-se em manter a simulação simples e intuitivo, para que ele seja uma ferramenta prática e eficaz. 😊</p>
        </div>
      </div>

      <!-- Bolinhas de paginação -->
      <div class="pagination-dots">
        <span v-for="page in 3" :key="page" class="dot" :class="{ active: currentPage === page }"></span>
      </div>

      <!-- Botões -->
      <div class="button-container">
        <!-- Botão Voltar com ícone -->
        <ButtonComponent v-if="currentPage > 1" label="Voltar" @click="previousPage" icon="src/assets/icons/arrow_back.png" class="back-button" />

        <ButtonComponent v-if="currentPage < 3" label="Próximo" @click="nextPage" primary />

        <ButtonComponent v-else label="Concluir" @click="finishTutorial" secondary />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ButtonComponent from 'src/components/ButtonComponent.vue';
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue', 'finish']);
const isOpen = ref(props.modelValue);
const currentPage = ref(1);
const route = useRoute();

let lastNextPageCall = 0;
const nextPage = () => {
  const now = Date.now();
  if (now - lastNextPageCall < 10) return;
  lastNextPageCall = now;
  if (currentPage.value === 1) {
    currentPage.value = 2;
  } else {
    currentPage.value = 3;
  }
};

const previousPage = () => {
  const now = Date.now();
  if (now - lastNextPageCall < 10) return;
  lastNextPageCall = now;
  if (currentPage.value === 3) {
    currentPage.value = 2;
  } else {
    currentPage.value = 1;
  }
};

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

<style scoped lang="scss">
.tutorial-modal {
  width: 500px;
  padding: 20px;
  text-align: center;
}

.tutorial-image {
  width: 100%;
  margin: 0 auto 0px;
  display: block;
}

.tutorial-content {
  min-height: 250px;
  padding: 0 20px;
}

h2 {
  color: $gray;
  font-size: 24px;
  line-height: normal;
  font-weight: 700;
  text-align: start;
}

p {
  font-size: 20px;
  color: $gray;
  line-height: normal;
  text-align: start;
}

.steps-list {
  text-align: left;
  padding-left: 20px;
}

.steps-list li {
  font-size: 20px;
  margin-bottom: 15px;
  line-height: 1.6;
  color: $gray;
}

.page-three {
  margin-top: 60px;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
  height: 10px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: $background-white;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: $gray;
}

.back-button {
  padding: 8px 12px;
  margin-right: auto;
  border: none !important;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}
</style>
