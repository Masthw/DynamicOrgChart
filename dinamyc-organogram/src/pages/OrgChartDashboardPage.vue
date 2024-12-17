<template>
  <div class="dashboard-page">
    <!-- Barra Superior -->
    <q-toolbar class="top-bar">
      <q-toolbar-title>Bem-vindo, {{ userName }}</q-toolbar-title>
      <q-btn
        label="Sair"
        flat
        icon="logout"
        color="white"
        @click="handleLogout"
      />
    </q-toolbar>

    <div class="content">
      <h1 class="q-mb-lg">Gerenciar Organogramas</h1>
      <div class="organogram-grid">
        <!-- Lista de organogramas existentes -->
        <div
          v-for="organogram in organograms"
          :key="organogram.id"
          class="organogram-card"
          @click="toggleActions(organogram.id)"
        >
          <!-- Nome do Organograma sempre visível -->
          <p class="organogram-name">{{ organogram.name }}</p>

          <!-- Ícones de Ação - Exibidos somente após o clique -->
          <div v-if="organogram.showActions" class="actions">
            <q-btn
              flat
              icon="open_in_new"
              @click.stop="openOrganogram(organogram.id)"
              class="action-btn"
            />
            <q-btn
              flat
              icon="compare_arrows"
              @click.stop="compareOrganogram(organogram.id)"
              class="action-btn"
            />
            <q-btn
              flat
              icon="delete"
              @click.stop="deleteOrganogram(organogram.id)"
              class="action-btn"
            />
          </div>
        </div>

        <!-- Card para adicionar novo organograma -->
        <div class="organogram-card add-new" @click="addNewOrganogram">
          <p class="plus-sign">+</p>
          <p>Adicionar Organograma</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const organograms = ref([]);
const userName = ref('Usuário'); // Simula o nome do usuário logado
const router = useRouter();

onMounted(() => {
  const storedOrganograms =
    JSON.parse(localStorage.getItem('organograms')) || [];
  organograms.value = storedOrganograms;
  organograms.value.forEach((organogram) => {
    organogram.showActions = false;
  });
});

const handleLogout = () => {
  console.log('Usuário deslogado');
  router.push('/');
};

const addNewOrganogram = () => {
  const newId = Date.now();
  let baseName = 'Organograma';
  let nameIndex = 1;
  let newName = `${baseName} ${nameIndex}`;
  const existingNames = organograms.value.map((o) => o.name);

  while (existingNames.includes(newName)) {
    nameIndex += 1;
    newName = `${baseName} ${nameIndex}`;
  }

  const newOrganogram = {
    id: newId,
    name: newName,
    showActions: false,
  };

  organograms.value.push(newOrganogram);
  localStorage.setItem('organograms', JSON.stringify(organograms.value));

  openOrganogram(newId);
};

const openOrganogram = (id) => {
  console.log(`Abrindo organograma com ID: ${id}`);
  router.push(`/organogram/${id}`);
};
const compareOrganogram = (id) => {
  console.log(`Comparando organograma com ID: ${id}`);
};

const deleteOrganogram = (id) => {
  const updatedOrganograms = organograms.value.filter(
    (organogram) => organogram.id !== id
  );
  organograms.value = updatedOrganograms;
  localStorage.setItem('organograms', JSON.stringify(updatedOrganograms));
  console.log(`Organograma com ID ${id} excluído`);
};

const toggleActions = (id) => {
  const organogram = organograms.value.find((o) => o.id === id);
  if (organogram) {
    organogram.showActions = !organogram.showActions;
  }
};
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.top-bar {
  background-color: #6676ce;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.organogram-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.organogram-card {
  position: relative;
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

.organogram-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 0;
}

.actions {
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin-top: 5px;
}

.action-btn {
  font-size: 1rem;
  color: #666;
}

.q-mb-lg {
  font-size: 40px;
}
</style>
