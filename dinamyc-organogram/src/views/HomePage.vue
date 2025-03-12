<template>
  <div class="home-page">
    <!-- Título -->
    <div class="title-container">
      <h1 class="title-text">
        GERENCIAR <br />
        SIMULAÇÕES
      </h1>
      <ButtonComponent label="Criar Nova Simulação" icon="src/assets/icons/add.png" variant="primary" @click="addNewOrgChart" />
    </div>

    <!-- Área de interação -->
    <div class="content-area">
      <!-- Lista de Organogramas -->
      <div class="orgchart-list">
        <div v-if="displayedOrgCharts.length === 0" class="orgchart-empty-card">
          <p class="empty-text">
            Não existem <br />
            simulações <br />
            cadastradas no <br />
            sistema.
          </p>
          <ButtonComponent label="Criar Nova Simulação" icon="src/assets/icons/add.png" variant="primary" @click="addNewOrgChart" />
        </div>

        <!-- Lista de organogramas existentes -->
        <div v-else v-for="orgchart in displayedOrgCharts" :key="orgchart.id" class="orgchart-card">
          <!-- Status no canto superior direito -->
          <div class="status" v-if="!orgchart.default">
            <img src="../assets/icons/info.png" alt="Status" class="status-icon" />
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
              :src="orgchart.default ? 'src/assets/icons/see.png' : 'src/assets/icons/lan.png'"
              alt="Ícone da Simulação"
              class="icon"
            />
            <img v-show="hoverIcons[orgchart.id]" src="../assets/icons/arrow_forward.png" alt="Abrir Simulação" class="icon" />
          </div>

          <!-- Nome do Organograma -->
          <h2 class="orgchart-name">{{ orgchart.name }}</h2>

          <!-- Descrição do Organograma -->
          <p class="orgchart-description">
            {{ orgchart.description }}
          </p>

          <!-- Data de Atualização -->
          <p class="modification-date">Atualizado em: {{ orgchart.modifiedDate }}</p>

          <!-- Ícones de Ação -->
          <div class="actions">
            <template v-if="orgchart.default">
              <div class="action-icon-wrapper" @click.stop="shareOrgChart(orgchart.id)">
                <img src="../assets/icons/share.png" alt="Compartilhar" class="action-icon" />
                <span class="tooltip">Compartilhar</span>
              </div>
              <div class="action-icon-wrapper" @click.stop="exportOrgChart(orgchart.id)">
                <img src="../assets/icons/download.png" alt="Baixar" class="action-icon" />
                <span class="tooltip">Download</span>
              </div>
            </template>
            <template v-else>
              <div class="action-icon-wrapper" @click.stop="editOrgChart(orgchart.id)">
                <img src="../assets/icons/edit.png" alt="Editar" class="action-icon" />
                <span class="tooltip">Editar</span>
              </div>
              <div class="action-icon-wrapper" @click.stop="duplicateOrgChart(orgchart.id)">
                <img src="../assets/icons/copy.png" alt="Copiar" class="action-icon" />
                <span class="tooltip">Duplicar</span>
              </div>
              <div class="action-icon-wrapper" @click.stop="shareOrgChart(orgchart.id)">
                <img src="../assets/icons/share.png" alt="Compartilhar" class="action-icon" />
                <span class="tooltip">Compartilhar</span>
              </div>
              <div class="action-icon-wrapper" @click.stop="exportOrgChart(orgchart.id)">
                <img src="../assets/icons/download.png" alt="Baixar" class="action-icon" />
                <span class="tooltip">Download</span>
              </div>
              <div class="action-icon-wrapper" @click.stop="deleteOrgChart(orgchart.id)">
                <img src="../assets/icons/delete.png" alt="Excluir" class="action-icon" />
                <span class="tooltip">Remover</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Modais -->
    <EditModal v-model="isEditModalOpen" :orgchart="selectedOrgChart" @save="updateOrgChart" />
    <DuplicateModal v-model="isDuplicateModalOpen" :orgchart="selectedOrgChart" @save="handleDuplicate" />
    <ShareModal v-model="isShareModalOpen" :orgchart="selectedOrgChart" @share="handleShare" />
    <ExportModal v-model="isExportModalOpen" :orgchart="selectedOrgChart" @export="handleExport" />
    <DeleteModal v-model="isDeleteModalOpen" :orgchart="selectedOrgChart" @confirm="handleDeleteConfirm" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { emitter } from 'src/eventBus';
import ButtonComponent from 'src/components/ButtonComponent.vue';
import EditModal from 'src/components/modal/EditModal.vue';
import DuplicateModal from 'src/components/modal/DuplicateModal.vue';
import ShareModal from 'src/components/modal/ShareModal.vue';
import ExportModal from 'src/components/modal/ExportModal.vue';
import DeleteModal from 'src/components/modal/DeleteModal.vue';

const orgcharts = ref([]);
const router = useRouter();
const hoverIcons = ref({});
const isEditModalOpen = ref(false);
const isDuplicateModalOpen = ref(false);
const isShareModalOpen = ref(false);
const isExportModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedOrgChart = ref(null);

onMounted(() => {
  const storedOrgCharts = JSON.parse(localStorage.getItem('orgcharts')) || [];
  const hasDefaultOrgChart = storedOrgCharts.some((org) => org.id === 1);
  if (!hasDefaultOrgChart) {
    storedOrgCharts.unshift({
      id: 1,
      name: 'Estrutura Atual',
      description: '',
      modifiedDate: new Date().toLocaleDateString(),
      default: true,
    });

    localStorage.setItem('orgcharts', JSON.stringify(storedOrgCharts));
  }

  orgcharts.value = storedOrgCharts.map((orgchart) => ({
    ...orgchart,
    modifiedDate: orgchart.modifiedDate || new Date().toLocaleDateString(),
    description: orgchart.description || '',
  }));
  console.log(storedOrgCharts);

  const handleOrgchartModified = (data) => {
    const { id, modifiedDate } = data;
    const numId = Number(id);
    const index = orgcharts.value.findIndex((org) => org.id === numId);
    if (index !== -1) {
      orgcharts.value[index].modifiedDate = modifiedDate;
      localStorage.setItem('orgcharts', JSON.stringify(orgcharts.value, null, 0));
    }
  };

  emitter.on('orgchart-modified', handleOrgchartModified);
});

const displayedOrgCharts = computed(() => {
  return [...orgcharts.value];
});

const updateOrgCharts = (newList) => {
  orgcharts.value = [...newList];
  localStorage.setItem('orgcharts', JSON.stringify(newList, null, 0));
  emitter.emit('orgcharts-updated');
};

const setHoverIcon = (id, isHovered) => {
  hoverIcons.value[id] = isHovered;
};

const addNewOrgChart = () => {
  router.push('/orgchart/create');
};

const openOrgChart = (id) => {
  console.log(`Abrindo organograma com ID: ${id}`);
  emitter.emit('orgchart-selected', id);
  router.push(`/orgchart/${id}`);
};

const editOrgChart = (id) => {
  selectedOrgChart.value = orgcharts.value.find((org) => org.id === id);
  isEditModalOpen.value = true;
};

const duplicateOrgChart = (id) => {
  selectedOrgChart.value = orgcharts.value.find((o) => o.id === id);
  isDuplicateModalOpen.value = true;
};

const shareOrgChart = (id) => {
  selectedOrgChart.value = orgcharts.value.find((org) => org.id === id);
  isShareModalOpen.value = true;
};

const exportOrgChart = (id) => {
  selectedOrgChart.value = orgcharts.value.find((org) => org.id === id);
  isExportModalOpen.value = true;
};

const deleteOrgChart = (id) => {
  selectedOrgChart.value = orgcharts.value.find((org) => org.id === id);
  isDeleteModalOpen.value = true;
};

const updateOrgChart = ({ name, description, modifiedDate }) => {
  if (selectedOrgChart.value) {
    selectedOrgChart.value.name = name;
    selectedOrgChart.value.description = description;
    selectedOrgChart.value.modifiedDate = modifiedDate;
    localStorage.setItem('orgcharts', JSON.stringify(orgcharts.value, null, 0));
  }
};

const handleDuplicate = (duplicatedOrgChart) => {
  console.log('handleDuplicate chamado com:', duplicatedOrgChart);
  const updatedOrgCharts = JSON.parse(localStorage.getItem('orgcharts')) || [];
  updateOrgCharts(updatedOrgCharts);
};

const handleShare = (email) => {
  console.log('Compartilhar organograma com o email:', email);
  isShareModalOpen.value = false;
  selectedOrgChart.value = null;
};

const handleExport = (id) => {
  console.log('Exportanto organograma', id);

  isExportModalOpen.value = false;
  selectedOrgChart.value = null;
};

const handleDeleteConfirm = (id) => {
  if (!id) return;
  const updatedOrgCharts = orgcharts.value.filter((org) => org.id !== id);
  localStorage.removeItem(`orgChartData_${id}`);
  localStorage.setItem('orgcharts', JSON.stringify(updatedOrgCharts));
  emitter.emit('orgcharts-updated');
  updateOrgCharts(updatedOrgCharts);
  selectedOrgChart.value = null;
  isDeleteModalOpen.value = false;
};
</script>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  background-color: $white;
  padding: 1rem 2rem;
  box-sizing: border-box;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: $background-gray transparent;
}

.title-container {
  display: flex;
  align-items: center;
  border-left: 4px solid $blue;
  justify-content: space-between;
  padding-left: 0.5rem;
  margin-left: 9rem;
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
  width: 280px;
  height: 316px;
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
  white-space: nowrap;
}

.orgchart-description {
  font-size: 0.875rem;
  color: $gray;
  margin: 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modification-date {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: $gray;
  white-space: nowrap;
}

.actions {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.action-icon-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-icon-wrapper:hover {
  background-color: $orange;
}

.action-icon-wrapper:hover .action-icon {
  filter: brightness(0) invert(1);
}

.action-icon-wrapper .tooltip {
  position: absolute;
  top: 125%;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  background-color: $orange;
  color: $white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.action-icon-wrapper:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0px);
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
