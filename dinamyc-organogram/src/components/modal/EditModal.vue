<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="edit-modal">
      <!-- Ícone de edição centralizado -->
      <div class="icon-wrapper">
        <div class="icon-container">
          <img src="src/assets/icons/edit.png" alt="Editar" class="edit-icon" />
        </div>
      </div>

      <!-- Conteúdo do modal -->
      <q-card-section>
        <h2 class="modal-title">Editar Organograma</h2>
        <p class="modal-text">
          Digite o novo nome ou descrição abaixo e salve <br />
          para confirmar a alteração.
        </p>
      </q-card-section>

      <q-card-section class="input-container">
        <TextFieldComponent v-model="editedName" class="custom-input" />
        <TextFieldComponent v-model="editedDescription" class="custom-input" />
      </q-card-section>

      <q-card-actions class="button-container">
        <ButtonComponent
          label="Cancelar"
          variant="primary"
          @click="closeModal"
        />
        <ButtonComponent
          label="OK"
          variant="secondary"
          :disabled="!isFormValid"
          @click="saveChanges"
        />
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
  orgchart: Object,
});

const emit = defineEmits(['update:modelValue', 'save']);

const isOpen = ref(props.modelValue);
const editedName = ref(props.orgchart?.name || '');
const editedDescription = ref(props.orgchart?.description || '');

const isFormValid = computed(() => {
  return editedName.value.trim().length > 0;
});

// Sincroniza abertura do modal
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      editedName.value = props.orgchart?.name || '';
      editedDescription.value = props.orgchart?.description || '';
    }
  },
  { immediate: true }
);

function generateUniqueName(name, orgcharts, currentId) {
  let base = name;
  let counter = 1;
  let newName = base;
  while (
    orgcharts.some(
      (o) =>
        o.id !== currentId &&
        o.name.trim().toLowerCase() === newName.trim().toLowerCase()
    )
  ) {
    newName = `${base}(${counter})`;
    counter++;
  }
  return newName;
}

// Fecha o modal
const closeModal = () => {
  emit('update:modelValue', false);
};

// Salva as alterações
const saveChanges = () => {
  const storedOrgCharts = JSON.parse(localStorage.getItem('orgcharts')) || [];
  const currentId = props.orgchart.id; // ID do organograma que está sendo editado

  // Gera um nome único caso já exista um organograma com o mesmo nome
  const uniqueName = generateUniqueName(
    editedName.value.trim(),
    storedOrgCharts,
    currentId
  );

  // Emite os dados editados, incluindo o modifiedDate atualizado
  emit('save', {
    name: uniqueName,
    description: editedDescription.value,
    modifiedDate: new Date().toLocaleDateString(),
  });
  closeModal();
};
</script>

<style scoped lang="scss">
.edit-modal {
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

.edit-icon {
  width: 30px;
  height: 30px;
  filter: brightness(0) invert(1);
}

/* Título e texto */
.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: $gray;
  margin-bottom: 0px;
}

.modal-text {
  font-size: 16px;
  color: $gray;
  margin-bottom: 5px;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

q-card-section {
  padding: 0;
}
</style>
