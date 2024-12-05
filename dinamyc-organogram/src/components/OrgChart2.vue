<template>
  <div class="orgchart-container">
    <!-- Iframe que carrega o arquivo orgchart.html -->
    <iframe
      v-bind:src="orgChartUrl"
      width="100%"
      height="600px"
      frameborder="0"
      title="Org Chart"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'OrgChart2',
  setup() {
    const orgChartUrl = '/orgchart.html';
    return {
      orgChartUrl,
    };
  },
};
</script>

<style scoped>
.orgchart-container {
  width: 100%;
  height: 100%;
}
</style>
