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
        />
      </div>
    </div>
    <!-- Área do Organograma -->
    <div class="orgchart-wrapper">
      <OrgChart v-if="orgchart" :key="orgchart.id" :data="orgchart.data" />
    </div>
  </div>
</template>

<script>
import OrgChart from 'components/OrgChart.vue';
import { useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import ButtonComponent from 'src/components/ButtonComponent.vue';

export default {
  components: {
    OrgChart,
    ButtonComponent,
  },
  setup() {
    const route = useRoute();
    const orgchart = ref(null);

    const loadOrgChart = () => {
      const orgcharts = JSON.parse(localStorage.getItem('orgcharts')) || [];
      const orgChartId = Number(route.params.id);
      orgchart.value = orgcharts.find((o) => o.id === orgChartId);
    };

    onMounted(loadOrgChart);

    watch(
      () => route.params.id,
      (orgChartId) => {
        loadOrgChart(orgChartId);
      }
    );

    return {
      orgchart,
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
</style>
