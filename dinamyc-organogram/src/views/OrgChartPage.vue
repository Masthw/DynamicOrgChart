<template>
  <div>
    <!-- Cabeçalho -->
    <div class="title-container" v-if="orgchart">
      <h1 class="title-text">
        Gestão do<br />
        <strong>{{ orgchart.name }}</strong>
      </h1>
      <div class="button-group">
        <ButtonComponent
          label="Visualizar Alterações"
          icon="src/assets/icons/view.png"
          variant="secondary"
          @click="viewPdfAlteracoes"
        />
        <ButtonComponent
          label="Registro de Alterações"
          icon="src/assets/icons/monitoring.png"
          variant="secondary"
          @click="openChangeLogModal"
        />
        <ButtonComponent
          label="Submeter Alterações"
          icon="src/assets/icons/send.png"
          variant="secondary"
          @click="openSubmitChangesModal"
        />
        <ButtonComponent
          label="Visualizar Portaria"
          icon="src/assets/icons/inventory.png"
          variant="secondary"
          @click="viewPdfPortaria"
        />
      </div>
    </div>
    <!-- Área do Organograma -->
    <div class="orgchart-wrapper">
      <OrgChart v-if="orgchart" :key="orgchart.id" :data="orgchart.data" />
      <EmployeeModal
        v-if="showEmployeeModal"
        :employeeData="employeeData"
        @close="closeEmployeeModal"
        @confirm="handleEmployeeConfirm"
      />
      <AddDepartmentModal
        v-if="showAddDepartmentModal"
        @close="closeAddDepartmentModal"
        @confirm="handleAddDepartmentConfirm"
      />
      <AddJobModal
        v-if="showAddJobModal"
        :initialData="addJobInitialData"
        :departments="addJobInitialData.departments"
        @close="closeAddJobModal"
        @confirm="handleAddJobConfirm"
      />
      <ViewSuccessionPlanModal
        v-if="showViewSuccessionPlanModal"
        :successionPlan="
          Array.isArray(successionPlanData) ? successionPlanData : []
        "
        @close="closeViewSuccessionPlanModal"
        @confirm="handleViewSuccessionPlanConfirm"
      />
      <ChangeLogModal
        v-if="showChangeLogModal"
        @close="showChangeLogModal = false"
      />
    </div>
    <div class="subtitle-container">
      <div class="subtitle-item">
        <span class="subtitle-color subtitle-allowed"></span>
        <span class="subtitle-label">Simulação Permitida</span>
      </div>
      <div class="subtitle-item">
        <span class="subtitle-color subtitle-allowed-with-reason"></span>
        <span class="subtitle-label"
          >Simulação Permitida com Justificativa</span
        >
      </div>
      <div class="subtitle-item">
        <span class="subtitle-color subtitle-not-allowed"></span>
        <span class="subtitle-label">Simulação Não Permitida</span>
      </div>
    </div>
    <SubmitChangesModal
      v-model="showSubmitChangesModal"
      @submit="handleSubmitChanges"
    />
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

    const successionPlanData = ref([]);
    const employeeData = ref({});
    const addJobInitialData = ref({});

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

    onMounted(() => {
      loadOrgChart();

      window.addEventListener('message', (event) => {
        console.log('Mensagem recebida no OrgChartPage:', event.data);
        if (
          event.data.type === 'openModal' &&
          event.data.action === 'employee'
        ) {
          console.log(
            'Evento openModal para Employee detectado. Dados:',
            event.data.employee
          );
          employeeData.value = event.data.employee;
          showEmployeeModal.value = true;
        }
        if (event.data.action === 'addDepartment') {
          console.log(
            'Evento openModal para addDepartment detectado. NodeId:',
            event.data.nodeId
          );
          showAddDepartmentModal.value = true;
        }
        if (event.data.action === 'addJob') {
          console.log(
            'Evento openModal para addJob detectado. NodeId:',
            event.data.nodeId
          );
          addJobInitialData.value = {
            jobImmediateSuperior: event.data.name,
            nodeId: event.data.nodeId,
            departments: event.data.departments,
          };
          showAddJobModal.value = true;
        }
        if (event.data.action === 'viewSuccessionPlan') {
          console.log(
            'Evento openModal para succession detectado. NodeId:',
            event.data.nodeId
          );
          successionPlanData.value = Array.isArray(event.data.children)
            ? event.data.children.slice(0, 4)
            : [];
          console.log(successionPlanData.value);
          showViewSuccessionPlanModal.value = true;
        }
        if (event.data && event.data.type === 'orgchart-modified') {
          const { id, modifiedDate } = event.data;
          console.log('OrgChartPage recebeu mensagem:', event.data);
          emitter.emit('orgchart-modified', { id, modifiedDate });
        }
      });
    });

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
  border-image: linear-gradient(
      to right,
      $purple-gradient,
      $red-gradient,
      $orange-gradient
    )
    1;
}

.subtitle-not-allowed {
  border-color: $red;
}

.subtitle-label {
  font-size: 14px;
  color: $gray;
  font-weight: bold;
}
</style>
