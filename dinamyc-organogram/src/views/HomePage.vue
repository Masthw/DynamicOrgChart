<template>
  <div class="home-page">
    <!-- Título -->
    <div class="title-container">
      <h1 class="title-text">
        GERENCIAR <br />
        ORGANOGRAMAS
      </h1>
      <ButtonComponent
        label="Criar Nova Simulação"
        icon="src/assets/icons/add.png"
        variant="primary"
        @click="addNewOrgChart"
      />
    </div>

    <!-- Área de interação -->
    <div class="content-area">
      <!-- Lista de Organogramas -->
      <div class="orgchart-list">
        <div v-if="orgcharts.length === 0" class="orgchart-empty-card">
          <p class="empty-text">
            Não existem <br />
            organogramas <br />
            cadastrados no <br />
            sistema.
          </p>
          <ButtonComponent
            label="Criar Nova Simulação"
            icon="src/assets/icons/add.png"
            variant="primary"
            @click="addNewOrgChart"
          />
        </div>

        <!-- Lista de organogramas existentes -->
        <div
          v-else
          v-for="orgchart in orgcharts"
          :key="orgchart.id"
          class="orgchart-card"
        >
          <!-- Status no canto superior direito -->
          <div class="status">
            <img
              src="../assets/icons/info.png"
              alt="Status"
              class="status-icon"
            />
          </div>

          <!-- Ícone centralizado -->
          <div
            class="orgchart-icon"
            @mouseover="setHoverIcon(orgchart.id, true)"
            @mouseleave="setHoverIcon(orgchart.id, false)"
            @click.stop="openOrgChart(orgchart.id)"
          >
            <img
              v-show="!hoverIcons[orgchart.id]"
              src="../assets/icons/lan.png"
              alt="Ícone do Organograma"
              class="icon"
            />
            <img
              v-show="hoverIcons[orgchart.id]"
              src="../assets/icons/arrow_forward.png"
              alt="Abrir Organograma"
              class="icon"
            />
          </div>

          <!-- Nome do Organograma -->
          <h2 class="orgchart-name">{{ orgchart.name }}</h2>

          <!-- Descrição do Organograma -->
          <p class="orgchart-description">
            {{ orgchart.description || 'Descrição do organograma.' }}
          </p>

          <!-- Data de Atualização -->
          <p class="modification-date">
            Atualizado em: {{ orgchart.modifiedDate }}
          </p>

          <!-- Ícones de Ação -->
          <div class="actions">
            <div
              class="action-icon-wrapper"
              @click.stop="editOrgChart(orgchart.id)"
            >
              <img
                src="../assets/icons/edit.png"
                alt="Editar"
                class="action-icon"
              />
            </div>
            <div
              class="action-icon-wrapper"
              @click.stop="copyOrgChart(orgchart.id)"
            >
              <img
                src="../assets/icons/copy.png"
                alt="Copiar"
                class="action-icon"
              />
            </div>
            <div
              class="action-icon-wrapper"
              @click.stop="shareOrgChart(orgchart.id)"
            >
              <img
                src="../assets/icons/share.png"
                alt="Compartilhar"
                class="action-icon"
              />
            </div>
            <div
              class="action-icon-wrapper"
              @click.stop="downloadOrgChart(orgchart.id)"
            >
              <img
                src="../assets/icons/download.png"
                alt="Baixar"
                class="action-icon"
              />
            </div>
            <div
              class="action-icon-wrapper"
              @click.stop="deleteOrgChart(orgchart.id)"
            >
              <img
                src="../assets/icons/delete.png"
                alt="Excluir"
                class="action-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { emitter } from 'src/eventBus';
import ButtonComponent from 'src/components/ButtonComponent.vue';

const orgcharts = ref([]);
const router = useRouter();
const hoverIcons = ref({});

// Carrega os organogramas do localStorage ao montar a página
onMounted(() => {
  const storedOrgCharts = JSON.parse(localStorage.getItem('orgcharts')) || [];
  orgcharts.value = storedOrgCharts.map((orgchart) => ({
    ...orgchart,
    modifiedDate: orgchart.modifiedDate || new Date().toLocaleDateString(),
    description: orgchart.description || '',
  }));
});

const updateOrgCharts = (newList) => {
  orgcharts.value = newList;
  localStorage.setItem('orgcharts', JSON.stringify(newList));
  emitter.emit('orgcharts-updated');
};

const setHoverIcon = (id, isHovered) => {
  hoverIcons.value[id] = isHovered;
};

const addNewOrgChart = () => {
  router.push('/orgchart/create');
};

// Abre um organograma
const openOrgChart = (id) => {
  console.log(`Abrindo organograma com ID: ${id}`);
  emitter.emit('orgchart-selected', id);
  router.push(`/orgchart/${id}`);
};

// Edita um organograma
const editOrgChart = (id) => {
  console.log(`Editando organograma com ID: ${id}`);
};

// Copia um organograma
const copyOrgChart = (id) => {
  console.log(`Copiando organograma com ID: ${id}`);
};

// Compartilha um organograma
const shareOrgChart = (id) => {
  console.log(`Compartilhando organograma com ID: ${id}`);
};

// Baixa um organograma
const downloadOrgChart = (id) => {
  console.log(`Baixando organograma com ID: ${id}`);
};

// Exclui um organograma
const deleteOrgChart = (id) => {
  const updatedOrgCharts = orgcharts.value.filter(
    (orgchart) => orgchart.id !== id
  );
  updateOrgCharts(updatedOrgCharts);
};
</script>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  background-color: $white;
  padding: 2rem;
  box-sizing: border-box;
}

.title-container {
  display: flex;
  align-items: center;
  border-left: 4px solid $blue;
  justify-content: space-between;
  padding-left: 0.5rem;
  margin-left: 10rem;
  margin-right: 10rem;
}

.title-text {
  font-size: 1rem;
  line-height: 1;
  font-weight: bold;
  color: $gray;
}

.content-area {
  flex-grow: 1;
  margin-top: 2rem;
  background-color: $white;
}

.orgchart-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.orgchart-card {
  max-width: 300px;
  border: 1px solid $background-gray;
  border-radius: 20px;
  padding: 1rem;
  text-align: center;
  position: relative;
}

.status {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.status-icon {
  width: 24px;
  height: 24px;
}

.orgchart-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  border: 1px solid $background-gray;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: $orange;
    border: none;
    .icon {
      filter: brightness(0) invert(1);
    }
  }
}

.orgchart-icon .icon {
  width: 35px;
  height: 35px;
  transition: filter 0.3s ease;
}

.orgchart-name {
  font-size: 1.5rem;
  font-weight: 500;
  color: $gray;
  margin: 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.orgchart-description {
  font-size: 0.875rem;
  color: $gray;
  margin: 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modification-date {
  font-size: 0.75rem;
  color: $gray;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.action-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: $orange;
    .action-icon {
      filter: brightness(0) invert(1);
    }
  }
}

.action-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: filter 0.1s ease;
}

.orgchart-empty-card {
  position: absolute;
  left: 40%;
  top: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: solid 1px $background-gray;
  border-radius: 10px;
  padding: 2rem;

  text-align: center;
  width: 100%;
  max-width: 400px;
  margin: auto;
}

.empty-text {
  font-size: 1rem;
  font-weight: bold;
  color: $gray;
  margin-bottom: 1rem;
}
</style>
