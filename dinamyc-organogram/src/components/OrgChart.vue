<template>
  <div class="orgchart-container">
    <!-- Iframe que carrega o arquivo orgchart.html -->
    <iframe
      v-bind:src="orgChartUrl"
      width="100%"
      height="100%"
      frameborder="0"
      title="Org Chart"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'OrgChart',
  setup() {
    const orgChartUrl = '/orgchart.html';
    return {
      orgChartUrl,
    };
  },
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.orgchart-container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  display: flex;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
  padding: 0;
}
</style>
