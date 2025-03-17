<template>
  <div class="create-orgchart-page">
    <!-- Área do formulário -->
    <div class="form-container">
      <!-- Botão de fechar -->
      <q-btn flat dense round icon="close" class="close-button" @click="goBack" />

      <!-- Logo -->
      <img src="../assets/images/organiza_ai_logo2.png" alt="Logo" class="logo" />
      <TextFieldComponent
        v-model="orgchartName"
        label="Nome da Simulação"
        placeholder="exemplo: Planta Tubarão"
        :rules="[(val) => !!val || 'Campo obrigatório']"
        :required="true"
      />
      <TextFieldComponent v-model="orgchartDescription" label="Descrição" placeholder="exemplo: Simulação de cenários de reorganização" />

      <!-- Botão OK -->
      <ButtonComponent label="OK" class="create-button" :disable="!orgchartName" @click="createOrgChart" />
    </div>

    <!-- Área da imagem -->
    <div class="image-container">
      <img src="../assets/images/createorgchart.png" alt="Simulação Ilustrativa" class="illustration" />

      <!-- Máscara de gradiente -->
      <div class="image-mask"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ButtonComponent from 'src/components/ButtonComponent.vue';
import TextFieldComponent from 'src/components/TextFieldComponent.vue';
import { emitter } from 'src/eventBus';

const router = useRouter();
const orgchartName = ref('');
const orgchartDescription = ref('');
const isCreating = ref(false);

function generateUniqueName(name, orgcharts, currentId) {
  let base = name;
  let counter = 1;
  let newName = base;
  while (orgcharts.some((o) => o.id !== currentId && o.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
    newName = `${base}(${counter})`;
    counter++;
  }
  return newName;
}

const createOrgChart = () => {
  if (isCreating.value) return;
  if (!orgchartName.value.trim()) return;

  const storedOrgCharts = JSON.parse(localStorage.getItem('orgcharts')) || [];

  const uniqueName = generateUniqueName(orgchartName.value.trim(), storedOrgCharts, -1);

  isCreating.value = true;
  const newId = Date.now();

  const newOrgChart = {
    id: newId,
    name: uniqueName,
    description: orgchartDescription.value || '',
    modifiedDate: new Date().toLocaleDateString(),
  };

  storedOrgCharts.push(newOrgChart);
  localStorage.setItem('orgcharts', JSON.stringify(storedOrgCharts));
  setTimeout(() => {
    emitter.emit('orgcharts-updated');
    emitter.emit('orgchart-selected', newId);
  }, 100);
  router.push(`/orgchart/${newId}`);
};

const goBack = () => {
  router.push('/');
};
</script>

<style scoped lang="scss">
.create-orgchart-page {
  display: flex;
  height: 100vh;
}

.form-container {
  width: 40%;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  position: relative;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  color: $gray;

  &:hover {
    color: $orange;
  }
}

.logo {
  display: block;
  margin-bottom: 120px;
}

.create-button {
  margin-top: 3rem;
  align-self: center;
  width: 50%;
}

.image-container {
  width: 60%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.illustration {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #460a78 13%, #e63c41 50%, #f58746 100%);
  opacity: 0.6;
}
</style>
