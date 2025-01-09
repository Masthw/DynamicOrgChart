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
      <div class="orgchart-grid">
        <div
          v-for="orgchart in orgcharts"
          :key="orgchart.id"
          class="orgchart-card"
          @click="toggleActions(orgchart.id)"
        >
          <p class="orgchart-name">{{ orgchart.name }}</p>
          <div v-if="orgchart.showActions" class="actions">
            <q-btn
              flat
              icon="open_in_new"
              @click.stop="openOrgChart(orgchart.id)"
              class="action-btn"
            />
            <q-btn
              flat
              icon="compare_arrows"
              @click.stop="compareOrgChart(orgchart.id)"
              class="action-btn"
            />
            <q-btn
              flat
              icon="delete"
              @click.stop="deleteOrgChart(orgchart.id)"
              class="action-btn"
            />
          </div>
        </div>
        <div class="orgchart-card add-new" @click="addNewOrgChart">
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

const orgcharts = ref([]);
const userName = ref('Usuário'); // Simula o nome do usuário logado
const router = useRouter();

onMounted(() => {
  const storedOrgCharts = JSON.parse(localStorage.getItem('orgcharts')) || [];
  orgcharts.value = storedOrgCharts;
  orgcharts.value.forEach((orgchart) => {
    orgchart.showActions = false;
  });
});

const handleLogout = () => {
  console.log('Usuário deslogado');
  router.push('/');
};

const addNewOrgChart = () => {
  const newId = Date.now();
  let baseName = 'Organograma';
  let nameIndex = 1;
  let newName = `${baseName} ${nameIndex}`;
  const existingNames = orgcharts.value.map((o) => o.name);

  while (existingNames.includes(newName)) {
    nameIndex += 1;
    newName = `${baseName} ${nameIndex}`;
  }

  const newOrgChart = {
    id: newId,
    name: newName,
    showActions: false,
  };

  orgcharts.value.push(newOrgChart);
  localStorage.setItem('orgcharts', JSON.stringify(orgcharts.value));

  openOrgChart(newId);
};

const openOrgChart = (id) => {
  console.log(`Abrindo organograma com ID: ${id}`);
  router.push(`/orgchart/${id}`);
};
const compareOrgChart = (id) => {
  console.log(`Comparando organograma com ID: ${id}`);
};

const deleteOrgChart = (id) => {
  const updatedOrgCharts = orgcharts.value.filter(
    (orgchart) => orgchart.id !== id
  );
  orgcharts.value = updatedOrgCharts;
  localStorage.setItem('orgcharts', JSON.stringify(updatedOrgCharts));
  console.log(`Organograma com ID ${id} excluído`);
};

const toggleActions = (id) => {
  const orgchart = orgcharts.value.find((o) => o.id === id);
  if (orgchart) {
    orgchart.showActions = !orgchart.showActions;
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

.orgchart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.orgchart-card {
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

.orgchart-card:hover {
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

.orgchart-name {
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
