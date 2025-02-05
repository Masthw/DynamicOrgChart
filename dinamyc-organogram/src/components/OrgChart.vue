<template>
  <div class="orgchart-container">
    <!-- Iframe que carrega o arquivo orgchart.html -->
    <iframe :src="orgChartUrl" frameborder="0" title="Org Chart"></iframe>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  name: 'OrgChart',
  setup() {
    const route = useRoute();
    const orgChartId = route.params.id;

    const orgChartUrl = `/orgchart.html#${orgChartId}`;
    return {
      orgChartUrl,
    };
  },
};
</script>

<style scoped lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.orgchart-container {
  margin-top: 3rem;
  padding: 0;
  width: 100%;
  height: calc(100vh - 48px);
  display: flex;
  overflow: hidden;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%; /* Faz com que a chart-container ocupe toda a altura disponível */
  display: flex;
  justify-content: center; /* Alinha o conteúdo do SVG no centro */
  overflow: hidden; /* Impede barra de rolagem lateral */
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
  padding: 0;
  background-color: $white;
  box-sizing: border-box;
}

svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
