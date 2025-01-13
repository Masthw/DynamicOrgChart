<template>
  <div class="orgchart-container">
    <!-- Iframe que carrega o arquivo orgchart.html -->
    <iframe
      :src="orgChartUrl"
      width="100%"
      height="100%"
      frameborder="0"
      title="Org Chart"
    ></iframe>
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

iframe {
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
  padding: 0;
  background-color: $background-blue;
}
</style>
