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
          {{ organogram?.name || 'Carregando...' }}
        </h3>
      </div>
    </div>
    <div class="orgchart-wrapper">
      <OrgChart v-if="organogram" :data="organogram.data" />
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
    const organogram = ref(null); // Dados do organograma

    // Carregar dados do organograma baseado no ID
    onMounted(() => {
      const organograms = JSON.parse(localStorage.getItem('organograms')) || [];
      const organogramId = route.params.id;
      organogram.value = organograms.find((o) => o.id === Number(organogramId));

      if (!organogram.value) {
        console.error(`Organograma com ID ${organogramId} não encontrado.`);
        router.push('/dashboard'); // Redireciona se o organograma não existir
      }
    });

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    return {
      organogram,
      goToDashboard,
    };
  },
};
</script>

<style scoped>
.header-wrapper {
  position: fixed;
  top: -3.5em;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: top 0.3s ease-in-out, opacity 0.3s ease-in-out;
  opacity: 0;
}

.header-wrapper:hover {
  top: 0;
  opacity: 1;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 1em;
  background-color: #b3b3b3;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s ease-in-out;
}

.header:hover {
  background-color: #a3a3a3;
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
