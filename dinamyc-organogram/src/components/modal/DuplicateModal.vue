<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="duplicate-modal">
      <!-- Ícone de duplicação centralizado -->
      <div class="icon-wrapper">
        <div class="icon-container">
          <img src="/src/assets/icons/copy.png" alt="Duplicar" class="modal-icon" />
        </div>
      </div>

      <!-- Cabeçalho do Modal -->
      <q-card-section class="modal-header">
        <h2 class="modal-title">Duplicar Simulação</h2>
        <p class="modal-text">
          Esta ação copiará a simulação selecionada. <br />
          Informe abaixo o nome da nova simulação.
        </p>
      </q-card-section>

      <q-card-section class="input-container">
        <TextFieldComponent v-model="newName" required />
      </q-card-section>

      <q-card-actions class="button-container">
        <ButtonComponent label="Cancelar" variant="primary" @click="closeModal" />
        <ButtonComponent label="OK" variant="secondary" :disabled="!isFormValid || isSaving" @click="saveChanges" />
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
  orgchart: Object,
});

const emit = defineEmits(['update:modelValue', 'save']);

const isOpen = ref(props.modelValue);
const newName = ref(props.orgchart?.name || '');
const isSaving = ref(false);
const hasSaved = ref(false);

const isFormValid = computed(() => {
  return newName.value.trim().length > 0;
});

watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      newName.value = props.orgchart?.name || '';
      hasSaved.value = false;
    }
  },
  { immediate: true }
);

function generateUniqueName(name, orgcharts, currentId) {
  let base = name;
  let counter = 1;
  let newNameCandidate = base;
  while (orgcharts.some((o) => o.id !== currentId && o.name.trim().toLowerCase() === newNameCandidate.trim().toLowerCase())) {
    newNameCandidate = `${base}(${counter})`;
    counter++;
  }
  return newNameCandidate;
}

const saveChanges = () => {
  if (hasSaved.value) return;
  hasSaved.value = true;

  if (isSaving.value) return;
  isSaving.value = true;

  const storedOrgCharts = JSON.parse(localStorage.getItem('orgcharts')) || [];
  const newId = Date.now();
  const uniqueName = generateUniqueName(newName.value.trim(), storedOrgCharts, -1);

  const originalData = JSON.parse(localStorage.getItem(`orgChartData_${props.orgchart.id}`));
  if (!originalData) {
    isSaving.value = false;
    return;
  }

  const duplicatedOrgChart = {
    ...props.orgchart,
    id: newId,
    name: uniqueName,
    modifiedDate: new Date().toLocaleDateString(),
  };

  localStorage.setItem(`orgChartData_${newId}`, JSON.stringify(originalData));
  storedOrgCharts.push(duplicatedOrgChart);
  localStorage.setItem('orgcharts', JSON.stringify(storedOrgCharts));

  console.log('Org chart duplicado:', duplicatedOrgChart);
  emit('save', duplicatedOrgChart);
  closeModal();
  isSaving.value = false;
};

const closeModal = () => {
  emit('update:modelValue', false);
};
</script>

<style scoped lang="scss">
.duplicate-modal {
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
  margin-bottom: 0px;
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
