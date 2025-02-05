<template>
  <div>
    <div class="orgchart-wrapper">
      <OrgChart v-if="orgchart" :data="orgchart.data" />
    </div>
  </div>
</template>

<script>
import OrgChart from 'components/OrgChart.vue';
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';

export default {
  components: {
    OrgChart,
  },
  setup() {
    const route = useRoute();
    const orgchart = ref(null);
    // Carregar dados do organograma baseado no ID
    onMounted(() => {
      const orgcharts = JSON.parse(localStorage.getItem('orgcharts')) || [];
      const orgChartId = route.params.id;
      orgchart.value = orgcharts.find((o) => o.id === Number(orgChartId));
    });

    return {
      orgchart,
    };
  },
};
</script>

<style scoped lang="scss"></style>
