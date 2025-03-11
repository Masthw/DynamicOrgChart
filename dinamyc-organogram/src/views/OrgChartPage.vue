<template>
  <div>
    <!-- Cabeçalho -->
    <div class="title-container" v-if="orgchart">
      <h1 class="title-text">
        Gestão do<br />
        <strong>{{ orgchart.name }}</strong>
      </h1>
      <div class="button-group" v-if="orgchart.id !== 1">
        <ButtonComponent label="Visualizar Alterações" icon="src/assets/icons/view.png" variant="secondary" @click="viewPdfAlteracoes" />
        <ButtonComponent label="Registro de Alterações" icon="src/assets/icons/monitoring.png" variant="secondary" @click="openChangeLogModal" />
        <ButtonComponent label="Submeter Alterações" icon="src/assets/icons/send.png" variant="secondary" @click="openSubmitChangesModal" />
        <ButtonComponent label="Visualizar Portaria" icon="src/assets/icons/inventory.png" variant="secondary" @click="viewPdfPortaria" />
      </div>
      <div class="button-group" v-else>
        <ButtonComponent label="Compartilhar" icon="src/assets/icons/share.png" variant="secondary" @click="isShareModalOpen = true" />
        <ButtonComponent label="Download" icon="src/assets/icons/download.png" variant="secondary" @click="isExportModalOpen = true" />
      </div>
    </div>
    <!-- Área do Organograma -->
    <div class="orgchart-wrapper">
      <OrgChart v-if="orgchart" :key="orgchart.id" :data="orgchart.data" />
      <EmployeeModal v-if="showEmployeeModal" :employeeData="employeeData" @close="closeEmployeeModal" @confirm="handleEmployeeConfirm" />
      <AddDepartmentModal v-if="showAddDepartmentModal" @close="closeAddDepartmentModal" @confirm="handleAddDepartmentConfirm" />
      <AddJobModal
        v-if="showAddJobModal"
        :initialData="addJobInitialData"
        :departments="addJobInitialData.departments"
        @close="closeAddJobModal"
        @confirm="handleAddJobConfirm"
      />
      <ViewSuccessionPlanModal
        v-if="showViewSuccessionPlanModal"
        :successionPlan="Array.isArray(successionPlanData) ? successionPlanData : []"
        @close="closeViewSuccessionPlanModal"
        @confirm="handleViewSuccessionPlanConfirm"
      />
      <ChangeLogModal v-if="showChangeLogModal" @close="showChangeLogModal = false" />
      <FilterModal
        v-model:modelValue="showFilterModal"
        :positions="filterData.positions"
        :departments="filterData.departments"
        :job_ids="filterData.job_ids"
        @apply="handleApplyFilters"
        @clear="handleClearFilters"
        @update:modelValue="showFilterModal = $event"
      />
      <DeleteVacancyModal v-model:modelValue="showDeleteVacancyModal" :nodeData="vacancyToDelete" @confirm="handleDeleteVacancyConfirm" />
      <DeleteEmployeeModal v-model:modelValue="showDeleteEmployeeModal" :nodeData="employeeToDelete" @confirm="handleDeleteEmployeeConfirm" />
      <ShareModal v-model="isShareModalOpen" :orgchart="orgchart" @share="handleShare" />
      <ExportModal v-model="isExportModalOpen" :orgchart="orgchart" @export="handleExport" />
      <TutorialModal v-model:modelValue="showTutorialModal" @finish="handleTutorialFinish" />
      <div id="nodePool" @click="openPoolList" :class="{ active: poolActive }"><img src="src/assets/icons/box.png" alt="Pool Icon" /></div>
      <NodeModal v-if="modalVisible" :nodes="poolNodes" @close="closePoolModal" />
    </div>
    <div class="subtitle-container">
      <div class="subtitle-item">
        <span class="subtitle-color subtitle-allowed"></span>
        <span class="subtitle-label">Simulação Permitida</span>
      </div>
      <div class="subtitle-item">
        <span class="subtitle-color subtitle-allowed-with-reason"></span>
        <span class="subtitle-label">Simulação Permitida com Justificativa</span>
      </div>
      <div class="subtitle-item">
        <span class="subtitle-color subtitle-not-allowed"></span>
        <span class="subtitle-label">Simulação Não Permitida</span>
      </div>
    </div>
    <SubmitChangesModal v-model="showSubmitChangesModal" @submit="handleSubmitChanges" />
  </div>
</template>

<script>
import OrgChart from 'components/OrgChart.vue';
import { emitter } from 'src/eventBus';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import ButtonComponent from 'src/components/ButtonComponent.vue';
import EmployeeModal from 'src/components/modal/EmployeeModal.vue';
import AddDepartmentModal from 'src/components/modal/AddDepartmentModal.vue';
import AddJobModal from 'src/components/modal/AddJobModal.vue';
import ViewSuccessionPlanModal from 'src/components/modal/ViewSuccessionPlanModal.vue';
import SubmitChangesModal from 'src/components/modal/SubmitChangesModal.vue';
import ChangeLogModal from 'src/components/modal/ChangeLogModal.vue';
import FilterModal from 'src/components/modal/FilterModal.vue';
import DeleteVacancyModal from 'src/components/modal/DeleteVacancyModal.vue';
import DeleteEmployeeModal from 'src/components/modal/DeleteEmployeeModal.vue';
import ShareModal from 'src/components/modal/ShareModal.vue';
import ExportModal from 'src/components/modal/ExportModal.vue';
import TutorialModal from 'src/components/modal/TutorialModal.vue';
import NodeModal from 'src/components/modal/NodeModal.vue';

export default {
  components: {
    OrgChart,
    ButtonComponent,
    EmployeeModal,
    AddDepartmentModal,
    AddJobModal,
    ViewSuccessionPlanModal,
    SubmitChangesModal,
    ChangeLogModal,
    FilterModal,
    DeleteEmployeeModal,
    DeleteVacancyModal,
    ShareModal,
    ExportModal,
    TutorialModal,
    NodeModal,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const orgchart = ref(null);
    const showEmployeeModal = ref(false);
    const showAddDepartmentModal = ref(false);
    const showAddJobModal = ref(false);
    const showViewSuccessionPlanModal = ref(false);
    const showSubmitChangesModal = ref(false);
    const showChangeLogModal = ref(false);
    const showDeleteVacancyModal = ref(false);
    const showDeleteEmployeeModal = ref(false);
    const isShareModalOpen = ref(false);
    const isExportModalOpen = ref(false);
    const showTutorialModal = ref(false);

    const successionPlanData = ref([]);
    const employeeData = ref({});
    const addJobInitialData = ref({});
    const vacancyToDelete = ref({});
    const employeeToDelete = ref({});

    //poolNode
    const poolNodes = ref([]);
    const poolActive = ref(false);
    const modalVisible = ref(false);

    function openPoolList() {
      modalVisible.value = true;
    }
    function closePoolModal() {
      modalVisible.value = false;
    }

    function addNodeToPool(nodeData) {
      const completeData = {
        id: nodeData.id,
        name: nodeData.name,
        image: nodeData.image,
        ...nodeData,
      };

      poolNodes.value.push(completeData);
      console.log('Pool atualizado:', poolNodes.value);
    }
    const showFilterModal = ref(false);
    const filterData = ref({
      positions: [],
      departments: [],
      job_ids: [],
    });

    const loadOrgChart = () => {
      const orgcharts = JSON.parse(localStorage.getItem('orgcharts')) || [];
      const orgChartId = Number(route.params.id);
      orgchart.value = orgcharts.find((o) => o.id === orgChartId);
    };

    const viewPdfAlteracoes = () => {
      if (orgchart.value && orgchart.value.id) {
        router.push(`/orgchart/${orgchart.value.id}/view-changes`);
      }
    };

    const viewPdfPortaria = () => {
      if (orgchart.value && orgchart.value.id) {
        router.push(`/orgchart/${orgchart.value.id}/view-ordinance`);
      }
    };

    const openSubmitChangesModal = () => {
      showSubmitChangesModal.value = true;
    };

    const openChangeLogModal = () => {
      showChangeLogModal.value = true;
      console.log('estado do log modal:', showChangeLogModal.value);
    };

    const handleSubmitChanges = (email) => {
      console.log('Submeter alterações para o email:', email);
    };

    const closeEmployeeModal = () => {
      showEmployeeModal.value = false;
      console.log('Modal de Employee fechado');
    };

    const handleEmployeeConfirm = (data) => {
      console.log('Dados do EmployeeModal:', data);
      closeEmployeeModal();
    };

    const closeAddDepartmentModal = () => {
      showAddDepartmentModal.value = false;
      console.log('Modal de AddDepartment fechado');
    };

    const handleAddDepartmentConfirm = (data) => {
      console.log('Dados do AddDepartmentModal:', data);
      closeAddDepartmentModal();
    };

    const closeAddJobModal = () => {
      showAddJobModal.value = false;
      console.log('Modal de AddJob fechado');
    };

    const handleAddJobConfirm = (data) => {
      console.log('Dados do AddJobModal:', data);
      closeAddJobModal();
    };

    const closeViewSuccessionPlanModal = () => {
      showViewSuccessionPlanModal.value = false;
      console.log('Modal succession fechado');
    };

    const handleViewSuccessionPlanConfirm = (data) => {
      console.log('dados do plano de sucessão:', data);
      closeViewSuccessionPlanModal();
    };

    const handleDeleteVacancyConfirm = (nodeId) => {
      console.log('chamando delete para vaga com ID:', nodeId);
    };

    const handleDeleteEmployeeConfirm = (nodeId) => {
      console.log('Exclusão confirmada para funcionário com ID:', nodeId);
    };

    const handleShare = (email) => {
      console.log('Compartilhar organograma com o email:', email);
      isShareModalOpen.value = false;
    };

    const handleExport = (id) => {
      console.log('Exportando organograma', id);
      isExportModalOpen.value = false;
    };

    function getOrgChartIdFromURL() {
      return route.params.id;
    }

    onMounted(() => {
      loadOrgChart();

      const orgChartId = getOrgChartIdFromURL();
      if (orgChartId && localStorage.getItem(`tutorialShown_${orgChartId}`) !== 'true') {
        showTutorialModal.value = true;
      }

      window.addEventListener('message', (event) => {
        console.log('Mensagem recebida no OrgChartPage:', event.data);
        if (event.data.type === 'openModal' && event.data.action === 'employee') {
          console.log('Evento openModal para Employee detectado. Dados:', event.data.employee);
          employeeData.value = event.data.employee;
          showEmployeeModal.value = true;
        }
        if (event.data.action === 'addDepartment') {
          console.log('Evento openModal para addDepartment detectado. NodeId:', event.data.nodeId);
          showAddDepartmentModal.value = true;
        }
        if (event.data.action === 'addJob') {
          console.log('Evento openModal para addJob detectado. NodeId:', event.data.nodeId);
          addJobInitialData.value = {
            jobImmediateSuperior: event.data.name,
            nodeId: event.data.nodeId,
            departments: event.data.departments,
          };
          showAddJobModal.value = true;
        }
        if (event.data.action === 'viewSuccessionPlan') {
          console.log('Evento openModal para succession detectado. NodeId:', event.data.nodeId);
          successionPlanData.value = Array.isArray(event.data.children) ? event.data.children.slice(0, 4) : [];
          console.log(successionPlanData.value);
          showViewSuccessionPlanModal.value = true;
        }
        if (event.data.action === 'filter') {
          filterData.value = {
            positions: event.data.positions,
            departments: event.data.departments,
            job_ids: event.data.job_ids,
          };
          showFilterModal.value = true;
        }

        if (event.data.type === 'openModal' && event.data.action === 'deleteVacancy') {
          showDeleteVacancyModal.value = true;
          vacancyToDelete.value = {
            id: event.data.nodeId,
            name: event.data.nodeName,
            position: event.data.position,
          };
        }

        if (event.data.type === 'openModal' && event.data.action === 'deleteEmployee') {
          showDeleteEmployeeModal.value = true;
          employeeToDelete.value = {
            id: event.data.nodeId,
            name: event.data.nodeName,
            position: event.data.position,
          };
        }
        if (event.data && event.data.type === 'nodeDropped') {
          const { nodeData, nodeLeft, nodeRight, nodeTop, nodeBottom } = event.data;
          const nodePoolEl = document.getElementById('nodePool');

          if (nodePoolEl) {
            const poolRect = nodePoolEl.getBoundingClientRect();
            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;

            const extraWidth = 120;
            const extraHeight = 50;

            const poolLeft = poolRect.left + scrollX - extraWidth / 2;
            const poolRight = poolRect.right + scrollX + extraWidth / 2;
            const poolTop = poolRect.top + scrollY - extraHeight / 2;
            const poolBottom = poolRect.bottom + scrollY + extraHeight / 2;

            const iframeEl = document.querySelector('iframe.orgchart-iframe');
            let absoluteNodeLeft = nodeLeft;
            let absoluteNodeRight = nodeRight;
            let absoluteNodeTop = nodeTop;
            let absoluteNodeBottom = nodeBottom;

            if (iframeEl) {
              const iframeRect = iframeEl.getBoundingClientRect();
              absoluteNodeLeft += iframeRect.left;
              absoluteNodeRight += iframeRect.left;
              absoluteNodeTop += iframeRect.top;
              absoluteNodeBottom += iframeRect.top;
            }

            if (absoluteNodeRight >= poolLeft && absoluteNodeLeft <= poolRight && absoluteNodeBottom >= poolTop && absoluteNodeTop <= poolBottom) {
              poolActive.value = true;
              addNodeToPool(nodeData);
              setTimeout(() => {
                poolActive.value = false;
              }, 1500);
            }
          }
        }

        if (event.data && event.data.type === 'orgchart-modified') {
          const { id, modifiedDate } = event.data;
          console.log('OrgChartPage recebeu mensagem:', event.data);
          emitter.emit('orgchart-modified', { id, modifiedDate });
        }
      });
    });

    const handleTutorialFinish = () => {
      const orgChartId = getOrgChartIdFromURL();
      if (orgChartId) {
        localStorage.setItem(`tutorialShown_${orgChartId}`, 'true');
      }
      showTutorialModal.value = false;
    };

    const handleApplyFilters = (filters) => {
      const iframe = document.querySelector('iframe.orgchart-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            type: 'applyFilters',
            filters,
          },
          '*'
        );
      }
    };

    const handleClearFilters = () => {
      const iframe = document.querySelector('iframe.orgchart-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            type: 'clearFilters',
          },
          '*'
        );
      }
    };

    watch(
      () => route.params.id,
      () => {
        loadOrgChart();
      }
    );

    return {
      orgchart,
      handleEmployeeConfirm,
      closeEmployeeModal,
      showEmployeeModal,
      showAddDepartmentModal,
      closeAddDepartmentModal,
      handleAddDepartmentConfirm,
      showAddJobModal,
      closeAddJobModal,
      handleAddJobConfirm,
      showViewSuccessionPlanModal,
      closeViewSuccessionPlanModal,
      handleViewSuccessionPlanConfirm,
      successionPlanData,
      employeeData,
      viewPdfAlteracoes,
      viewPdfPortaria,
      openSubmitChangesModal,
      showSubmitChangesModal,
      handleSubmitChanges,
      openChangeLogModal,
      showChangeLogModal,
      addJobInitialData,
      showFilterModal,
      filterData,
      handleApplyFilters,
      handleClearFilters,
      showDeleteVacancyModal,
      vacancyToDelete,
      showDeleteEmployeeModal,
      employeeToDelete,
      handleDeleteEmployeeConfirm,
      handleDeleteVacancyConfirm,
      isShareModalOpen,
      isExportModalOpen,
      handleShare,
      handleExport,
      showTutorialModal,
      handleTutorialFinish,
      modalVisible,
      openPoolList,
      closePoolModal,
      poolNodes,
      poolActive,
    };
  },
};
</script>

<style scoped lang="scss">
.title-container {
  display: flex;
  align-items: center;
  border-left: 4px solid $blue;
  justify-content: space-between;
  padding-left: 0.5rem;
  margin: 1rem 0.5rem 0rem 10rem;
}

.title-text {
  font-size: 1rem;
  line-height: 1;
  color: $gray;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.subtitle-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
}

.subtitle-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.subtitle-color {
  width: 20px;
  height: 20px;
  background-color: transparent;
  display: inline-block;
  border: 2px solid transparent;
}

.subtitle-allowed {
  border-color: $green;
}

.subtitle-allowed-with-reason {
  border-image: linear-gradient(to right, $purple-gradient, $red-gradient, $orange-gradient) 1;
}

.subtitle-not-allowed {
  border-color: $red;
}

.subtitle-label {
  font-size: 14px;
  color: $gray;
  font-weight: bold;
}

#nodePool {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 100px;
  background-color: $orange;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $white;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  font-weight: bold;
}

#nodePool.active {
  background-color: $white;
  border: 1px solid $orange;
  animation: rotatePulse 1.5s ease-in-out infinite;

  img {
    filter: brightness(0) saturate(100%) invert(28%) sepia(81%) saturate(4237%) hue-rotate(3deg) brightness(104%) contrast(106%);
  }
}

@keyframes rotatePulse {
  0% {
    transform: scale(1.1) rotate(0deg);
    background-color: $white;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    background-color: $white;
  }
  100% {
    transform: scale(1.1) rotate(360deg);
    background-color: $orange;
  }
}

img {
  height: 35px;
  width: 35px;
  filter: brightness(0) invert(1);
}
</style>
