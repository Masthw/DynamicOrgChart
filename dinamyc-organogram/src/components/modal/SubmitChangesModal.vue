<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="submit-modal">
      <!-- Ícone centralizado no topo -->
      <div class="icon-wrapper">
        <div class="icon-container">
          <img src="/src/assets/icons/send.png" alt="Submeter Alterações" class="modal-icon" />
        </div>
      </div>

      <!-- Cabeçalho do Modal -->
      <q-card-section class="modal-header">
        <h2 class="modal-title">Submeter Alterações</h2>
        <p class="modal-text">
          Você está prestes a enviar as alterações. <br />
          Revise as informações antes de continuar.
        </p>
      </q-card-section>

      <!-- Corpo do Modal: Campo para inserir o email -->
      <q-card-section class="input-container">
        <TextFieldComponent v-model="email" placeholder="rh@arcelor.com.br" required />
      </q-card-section>

      <!-- Rodapé do Modal: Botões de ação -->
      <q-card-actions class="button-container">
        <ButtonComponent label="Cancelar" variant="primary" @click="closeModal" />
        <ButtonComponent label="Enviar" variant="secondary" :disabled="!isFormValid" @click="submitChanges" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import TextFieldComponent from 'src/components/TextFieldComponent.vue';
import ButtonComponent from 'src/components/ButtonComponent.vue';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'submit']);

const isOpen = ref(props.modelValue);
const email = ref('');

const isFormValid = computed(() => {
  return email.value.trim().length > 0;
});

watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      email.value = '';
    }
  },
  { immediate: true }
);

const closeModal = () => {
  emit('update:modelValue', false);
};

const submitChanges = () => {
  emit('submit', email.value.trim());
  closeModal();
};
</script>

<style scoped lang="scss">
.submit-modal {
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

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: $gray;
  margin-bottom: 0;
}

.modal-text {
  font-size: 16px;
  color: $gray;
  margin-bottom: 0;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
}

.button-container {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.button-container > * {
  flex: 1;
}
</style>
