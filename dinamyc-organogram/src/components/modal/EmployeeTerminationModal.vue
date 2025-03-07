<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="terminate-modal">
      <div class="icon-wrapper">
        <div class="icon-container">
          <img src="src/assets/icons/delete.png" alt="Terminar" class="modal-icon" />
        </div>
      </div>
      <q-card-section class="modal-header">
        <h2 class="modal-title">Terminar Empregado</h2>
        <p class="modal-text">
          Deseja realmente encerrar o vínculo deste empregado com a empresa?<br />
          Informe a justificativa para essa decisão:
        </p>
      </q-card-section>
      <q-card-section class="input-container">
        <TextFieldComponent v-model="justification" placeholder="Justificativa" outlined dense />
      </q-card-section>
      <q-card-actions class="button-container">
        <ButtonComponent label="Cancelar" variant="primary" @click="closeModal" />
        <ButtonComponent label="Confirmar" variant="secondary" :disabled="!isFormValid" @click="confirmTermination" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import TextFieldComponent from 'src/components/TextFieldComponent.vue';
import ButtonComponent from 'src/components/ButtonComponent.vue';

const props = defineProps({
  modelValue: Boolean,
  employeeData: Object,
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const isOpen = ref(props.modelValue);
const justification = ref('');

const isFormValid = computed(() => justification.value.trim().length > 0);

watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      justification.value = '';
    }
  },
  { immediate: true }
);

function closeModal() {
  emit('update:modelValue', false);
}

function confirmTermination() {
  emit('confirm', { id: props.employeeData.id, justification: justification.value.trim() });
  closeModal();
}
</script>

<style scoped lang="scss">
.terminate-modal {
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

.modal-header {
  padding-top: 25px;
  padding-bottom: 10px;
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

.input-container {
  margin: 0px;
}

.button-container {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin-top: 15px;
}

.button-container > * {
  flex: 1;
}

q-card-section {
  padding: 0;
}
</style>
