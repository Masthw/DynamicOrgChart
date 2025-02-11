<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="export-modal">
      <!-- Ícone centralizado no topo -->
      <div class="icon-wrapper">
        <div class="icon-container">
          <img
            src="/src/assets/icons/download.png"
            alt="Exportar"
            class="modal-icon"
          />
        </div>
      </div>

      <!-- Cabeçalho do Modal -->
      <q-card-section class="modal-header">
        <h2 class="modal-title">Exportar Organograma</h2>
        <p class="modal-text">
          Você está prestes a fazer o download do
          <strong>{{ orgchartName }}.</strong> <br />
          Selecione abaixo o formato desejado para iniciar o <br />
          download.
        </p>
      </q-card-section>

      <!-- Rodapé do Modal: Botões de Exportação empilhados -->
      <q-card-actions class="button-container">
        <ButtonComponent
          label="Exportar PNG"
          variant="primary"
          @click="exportPNG"
          :icon="'/src/assets/icons/photo.png'"
        />
        <ButtonComponent
          label="Exportar PDF"
          variant="primary"
          @click="exportPDF"
          :icon="'/src/assets/icons/pdf.png'"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';
import ButtonComponent from 'src/components/ButtonComponent.vue';

const props = defineProps({
  modelValue: Boolean,
  orgchart: Object,
});

const emit = defineEmits(['update:modelValue', 'export']);

const isOpen = ref(props.modelValue);
const orgchartName = ref(props.orgchart?.name || '');

watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      orgchartName.value = props.orgchart?.name || '';
    }
  },
  { immediate: true }
);

const closeModal = () => {
  emit('update:modelValue', false);
};

const exportPNG = () => {
  emit('export', { id: props.orgchart?.id, format: 'png' });
  closeModal();
};

const exportPDF = () => {
  emit('export', { id: props.orgchart?.id, format: 'pdf' });
  closeModal();
};
</script>

<style scoped lang="scss">
.export-modal {
  width: 60%;
  padding: 5px 30px;
  border-radius: 20px;
  text-align: center;
  position: relative;
  overflow: visible;
  background-color: $background-white;
  box-shadow: none;
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
  background: $orange;
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
}

.modal-text {
  font-size: 16px;
  color: $gray;
  margin: 10px 0 20px;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
}
</style>
