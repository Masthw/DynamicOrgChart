<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="delete-modal">
      <!-- Ícone centralizado no topo -->
      <div class="icon-wrapper">
        <div class="icon-container">
          <img
            src="/src/assets/icons/delete.png"
            alt="Excluir"
            class="modal-icon"
          />
        </div>
      </div>

      <!-- Cabeçalho do Modal -->
      <q-card-section class="modal-header">
        <h2 class="modal-title">Excluir Vaga</h2>
        <p class="modal-text">
          Deseja realmente excluir a vaga
          <strong>{{ nodeToDelete.position }}</strong
          >?
        </p>
      </q-card-section>

      <!-- Rodapé do Modal: Botões -->
      <q-card-actions class="button-container">
        <ButtonComponent
          label="Cancelar"
          variant="primary"
          @click="closeModal"
        />
        <ButtonComponent
          label="Excluir"
          variant="secondary"
          @click="confirmDelete"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import ButtonComponent from 'src/components/ButtonComponent.vue';

const props = defineProps({
  modelValue: Boolean,
  nodeData: Object,
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const isOpen = ref(props.modelValue);
const nodeToDelete = ref(props.nodeData || {});

watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal && props.nodeData) {
      nodeToDelete.value = props.nodeData;
    }
  },
  { immediate: true }
);

const closeModal = () => {
  emit('update:modelValue', false);
};

const confirmDelete = () => {
  const orgchartIframe = window.parent.document.querySelector('iframe');
  if (orgchartIframe && orgchartIframe.contentWindow) {
    orgchartIframe.contentWindow.postMessage(
      { type: 'confirmDeleteVacancy', nodeId: nodeToDelete.value.id },
      '*'
    );
  } else {
    console.warn('Orgchart iframe não foi encontrado.');
  }

  closeModal();
};
</script>

<style scoped lang="scss">
.delete-modal {
  width: 60%;
  padding: 5px 30px;
  border-radius: 20px;
  text-align: center;
  position: relative;
  overflow: visible;
  background-color: $background-white;
}

.icon-wrapper {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  background: $background-white;
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container {
  width: 60px;
  height: 60px;
  background: $red;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon {
  width: 30px;
  height: 30px;
  filter: brightness(0) invert(1);
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  color: $gray;
  margin: 0;
  font-family: 'Poppins', sans-serif;
}

.modal-text {
  font-size: 16px;
  color: $gray;
  margin: 10px 0 20px;
  font-family: 'Poppins', sans-serif;
}

.button-container {
  display: flex;
  align-content: center;
  gap: 20px;
  justify-content: space-between;
}

.button-container button {
  flex: 1;
}
</style>
