<template>
  <div>
    <div class="header-wrapper">
      <div class="header">
        <q-btn
          label="Voltar ao Dashboard"
          icon="arrow_back"
          color="secondary"
          unelevated
          @click="goToDashboard"
        />
        <h3 class="header-title">
          {{ orgchart?.name || 'Carregando...' }}
        </h3>
      </div>
    </div>
    <div class="orgchart-wrapper">
      <OrgChart v-if="orgchart" :data="orgchart.data" />
    </div>
  </div>
</template>

<script>
import OrgChart from 'components/OrgChart.vue';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';

export default {
  components: {
    OrgChart,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const orgchart = ref(null);
    // Carregar dados do organograma baseado no ID
    onMounted(() => {
      const orgcharts = JSON.parse(localStorage.getItem('orgcharts')) || [];
      const orgChartId = route.params.id;
      orgchart.value = orgcharts.find((o) => o.id === Number(orgChartId));

      if (!orgchart.value) {
        console.error(`Organograma com ID ${orgChartId} não encontrado.`);
        router.push('/dashboard'); // Redireciona se o organograma não existir
      }
    });

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    return {
      orgchart,
      goToDashboard,
    };
  },
};
</script>

<style scoped lang="scss">
.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: $background-gray;
  height: 50px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 1em;
  background-color: $background-gray;
  height: 100%;
}

.header q-btn {
  margin-left: 10px;
}

.header-title {
  font-size: 1rem;
  margin-right: 10px;
  color: #333;
  font-weight: normal;
}
</style>
