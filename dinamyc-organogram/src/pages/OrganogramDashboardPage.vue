<template>
  <div class="dashboard-page">
    <h1 class="q-mb-lg">Gerenciar Organogramas</h1>
    <div class="organogram-grid">
      <!-- Card para adicionar novo organograma -->
      <div class="organogram-card add-new" @click="addNewOrganogram">
        <p class="plus-sign">+</p>
        <p>Novo Organograma</p>
      </div>
      <!-- Lista de organogramas existentes -->
      <div
        v-for="organogram in organograms"
        :key="organogram.id"
        class="organogram-card"
        @click="openOrganogram(organogram.id)"
      >
        <p>{{ organogram.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const organograms = ref([]); // Lista de organogramas
const router = useRouter();

// Carregar organogramas do localStorage ao montar o componente
onMounted(() => {
  const storedOrganograms =
    JSON.parse(localStorage.getItem('organograms')) || [];
  organograms.value = storedOrganograms;
});

// Função para adicionar novo organograma
const addNewOrganogram = () => {
  const newId = Date.now(); // ID único baseado no timestamp
  const newOrganogram = {
    id: newId,
    name: `Organograma ${organograms.value.length + 1}`,
  };
  organograms.value.push(newOrganogram);

  localStorage.setItem('organograms', JSON.stringify(organograms.value));

  openOrganogram(newId);
};

// Função para abrir organograma
const openOrganogram = (id) => {
  console.log(`Abrindo organograma com ID: ${id}`);
  router.push(`/organogram/${id}`);
};
</script>

<style scoped>
.dashboard-page {
  padding: 20px;
}

.organogram-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.organogram-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  height: 150px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.organogram-card:hover {
  background: #e6e6e6;
}

.add-new {
  background: #d9f7d9;
  color: #34a853;
  font-weight: bold;
}

.plus-sign {
  font-size: 2rem;
  margin-bottom: 10px;
}
</style>
