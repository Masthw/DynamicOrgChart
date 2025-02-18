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
          label="Análise de Impacto"
          icon="src/assets/icons/monitoring.png"
          variant="secondary"
        />
        <ButtonComponent
          label="Submeter Alterações"
          icon="src/assets/icons/send.png"
          variant="secondary"
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

export default {
  components: {
    OrgChart,
    ButtonComponent,
    EmployeeModal,
    AddDepartmentModal,
    AddJobModal,
    ViewSuccessionPlanModal,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const orgchart = ref(null);
    const showEmployeeModal = ref(false);
    const showAddDepartmentModal = ref(false);
    const showAddJobModal = ref(false);
    const showViewSuccessionPlanModal = ref(false);

    const successionPlanData = ref([]);
    const employeeData = ref({});

    const loadOrgChart = () => {
      const orgcharts = JSON.parse(localStorage.getItem('orgcharts')) || [];
      const orgChartId = Number(route.params.id);
      orgchart.value = orgcharts.find((o) => o.id === orgChartId);
    };

    const viewPdfAlteracoes = () => {
      if (orgchart.value && orgchart.value.id) {
        router.push(`/orgchart/${orgchart.value.id}/visualizar-alteracoes`);
      }
    };

    const viewPdfPortaria = () => {
      if (orgchart.value && orgchart.value.id) {
        router.push(`/orgchart/${orgchart.value.id}/visualizar-portaria`);
      }
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
          // Emite para a HomePage via emitter
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
  margin: 2rem 2rem 0rem 12rem;
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
  border-radius: 50%;
  display: inline-block;
}

.subtitle-allowed {
  background-color: $green;
}

.subtitle-allowed-with-reason {
  @include gradient;
}

.subtitle-not-allowed {
  background-color: $red;
}

.subtitle-label {
  font-size: 14px;
  color: $gray;
  font-weight: bold;
}
</style>
