<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="relocate-modal">
      <div class="icon-wrapper">
        <div class="icon-container">
          <img src="src/assets/icons/info.png" alt="Realocar" class="modal-icon" />
        </div>
      </div>
      <q-card-section class="modal-header">
        <h2 class="modal-title">Realocar Empregado</h2>
        <p class="modal-text">
          Para qual vaga deseja realocar <strong>{{ employee.name }}</strong
          >?
        </p>
      </q-card-section>
      <q-card-section class="input-container">
        <SelectComponent v-model="selectedVacancy" :options="vacancyOptions" placeholder="Selecionar Vaga" customClass="q-mb-md" />
      </q-card-section>
      <q-card-actions class="button-container">
        <ButtonComponent label="Cancelar" variant="primary" @click="closeModal" />
        <ButtonComponent label="Confirmar" variant="secondary" :disabled="!selectedVacancy" @click="confirmReallocation" />
      </q-card-actions>
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
.relocate-modal {
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
  margin: 0;
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
