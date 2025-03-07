<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="not-allowed-modal">
      <!-- Ícone de aviso centralizado -->
      <div class="icon-wrapper">
        <div class="icon-container">
          <img src="src/assets/icons/close.png" alt="Atenção" class="modal-icon" />
        </div>
      </div>

      <!-- Cabeçalho e mensagem -->
      <q-card-section class="modal-header">
        <h2 class="modal-title">Atenção!</h2>
        <p class="modal-text">
          Esse empregado não atende aos requisitos<br />
          necessários para ocupar esta posição no <br />
          momento
        </p>
      </q-card-section>

      <!-- Botões de ação -->
      <q-card-actions class="button-container">
        <ButtonComponent label="OK" variant="secondary" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import ButtonComponent from 'src/components/ButtonComponent.vue';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const isOpen = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
  },
  { immediate: true }
);

function closeModal() {
  emit('update:modelValue', false);
}

function confirm() {
  emit('confirm');
  closeModal();
}
</script>

<style scoped lang="scss">
.not-allowed-modal {
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

.modal-header {
  padding-top: 25px;
  padding-bottom: 10px;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: $gray;
  margin: 0;
}

.modal-text {
  font-size: 16px;
  color: $gray;
  margin-top: 5px;
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
