<template>
  <q-dialog v-model="isOpen">
    <q-card class="modal-card">
      <q-card-section class="modal-header">
        <span class="modal-title">Realocar Empregado</span>
        <q-btn flat dense round icon="close" class="close-button" @click="closeModal" />
      </q-card-section>

      <q-card-section class="modal-body">
        <p class="modal-text">
          Para qual vaga deseja realocar <strong>{{ employee.name }}</strong
          >?
        </p>

        <!-- Container para a rolagem das opções -->
        <div class="select-container">
          <SelectComponent v-model="selectedVacancy" :options="vacancyOptions" placeholder="Selecionar Vaga" customClass="q-mb-md" />
        </div>

        <!-- Botão Confirmar sempre na parte inferior -->
        <div class="button-container">
          <ButtonComponent label="Confirmar" variant="secondary" :disabled="!selectedVacancy" @click="confirmReallocation" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import SelectComponent from '../SelectComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';

const props = defineProps({
  modelValue: Boolean,
  employee: Object,
  vacancies: Array,
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const selectedVacancy = ref(null);

const vacancyOptions = computed(() => {
  return props.vacancies.map((vacancy) => ({
    label: vacancy.position || 'Vaga Sem Nome',
    value: vacancy.id,
  }));
});

function closeModal() {
  emit('update:modelValue', false);
}

function confirmReallocation() {
  if (selectedVacancy.value) {
    emit('confirm', { employee: props.employee, vacancyId: selectedVacancy.value });
    closeModal();
  }
}
</script>

<style scoped lang="scss">
.modal-card {
  width: 400px;
  max-width: 90vw;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: $gray;
}

.modal-text {
  font-size: 16px;
  margin-top: 10px;
  color: $gray;
}

.close-button {
  color: $gray;
  &:hover {
    color: $orange;
  }
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-grow: 1;
}

.select-container {
  margin-top: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.button-container {
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
