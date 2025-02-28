<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="filter-modal">
      <div class="icon-wrapper">
        <div class="icon-container">
          <img
            src="/src/assets/icons/search.png"
            alt="Filtros"
            class="modal-icon"
          />
        </div>
      </div>
      <q-card-section class="modal-header">
        <h2 class="modal-title">Aplicar Filtros</h2>
        <q-btn
          flat
          dense
          round
          icon="close"
          class="close-button"
          @click="closeModal"
        />
        <p class="modal-text">
          Para continuar, selecione abaixo as opções de <br />
          filtros de pesquisa.
        </p>
      </q-card-section>

      <q-card-section class="filter-content">
        <div class="filter-row">
          <label class="filter-label">Cargo:</label>
          <MultipleSelectComponent
            v-model="selectedPositions"
            :options="positionsOptions"
            class="filter-select"
          />
        </div>

        <div class="filter-row">
          <label class="filter-label">Departamento:</label>
          <MultipleSelectComponent
            v-model="selectedDepartments"
            :options="departmentsOptions"
            class="filter-select"
          />
        </div>
        <div class="filter-row">
          <label class="filter-label">Estado:</label>
          <MultipleSelectComponent
            v-model="selectedLocations"
            :options="locationsOptions"
            class="filter-select"
          />
        </div>
      </q-card-section>

      <q-card-actions class="button-container">
        <ButtonComponent
          label="Limpar"
          variant="primary"
          @click="clearFilters"
        />
        <ButtonComponent
          label="Aplicar"
          variant="secondary"
          :disabled="!isFormValid"
          @click="applyFilters"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ButtonComponent from '../ButtonComponent.vue';
import MultipleSelectComponent from '../MultipleSelectComponent.vue';

const props = defineProps({
  modelValue: Boolean,
  positions: {
    type: Array,
    default: () => [],
  },
  departments: {
    type: Array,
    default: () => [],
  },
  locations: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'apply', 'clear']);

const isOpen = ref(props.modelValue);
const selectedPositions = ref([]);
const selectedDepartments = ref([]);
const selectedLocations = ref([]);

const positionsOptions = computed(() =>
  props.positions.map((p) => ({ label: p, value: p }))
);
const departmentsOptions = computed(() =>
  props.departments.map((d) => ({ label: d, value: d }))
);
const locationsOptions = computed(() =>
  props.locations.map((l) => ({ label: l, value: l }))
);

const isFormValid = computed(() => {
  // Exemplo: formulário é válido mesmo sem seleção; ajuste conforme sua regra
  return true;
});

// Atualiza o estado do diálogo conforme a prop modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      // Ao abrir, você pode redefinir os filtros se necessário
      selectedPositions.value = [];
      selectedDepartments.value = [];
      selectedLocations.value = [];
    }
  },
  { immediate: true }
);

// Emite os filtros aplicados para o componente pai
function applyFilters() {
  const filters = {
    positions: selectedPositions.value,
    departments: selectedDepartments.value,
    locations: selectedLocations.value,
  };
  emit('apply', filters);
  closeModal();
}

// Emite o evento para limpar os filtros
function clearFilters() {
  selectedPositions.value = [];
  selectedDepartments.value = [];
  selectedLocations.value = [];
  emit('clear');
}

// Fecha o modal
function closeModal() {
  emit('update:modelValue', false);
}
</script>

<style scoped lang="scss">
.filter-modal {
  width: 500px;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  position: relative;
  background-color: $background-white;
  overflow: visible;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 14px;
  color: $gray;
  &:hover {
    color: $orange;
  }
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
  margin: 0;
}

.filter-content {
  padding: 20px 0;
  .filter-row {
    margin-bottom: 15px;
    .filter-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: $gray;
      text-align: start;
    }
    .filter-select {
      width: 100%;
    }
  }
}

.button-container {
  display: flex;
  gap: 20px;
  justify-content: space-evenly;
}

.button-container button {
  flex: 1;
}
</style>
