<template>
  <div class="orgchart-container">
    <!-- Iframe que carrega o arquivo orgchart.html -->
    <iframe :key="orgChartId" :src="orgChartUrl" frameborder="0" title="Org Chart" @load="onIframeLoad"></iframe>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const orgChartId = ref(route.params.id);
const orgChartUrl = ref(`/orgchart.html#${orgChartId.value}`);
const iframeLoaded = ref(false);

watch(
  () => route.params.id,
  (newId) => {
    orgChartId.value = newId;
    orgChartUrl.value = `/orgchart.html#${newId}`;
  }
);

const onIframeLoad = () => {
  iframeLoaded.value = true;
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
  height: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
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
