<template>
  <div class="app-bar">
    <img src="../assets/images/organiza_ai_logo.png" alt="Logo" class="logo" />
    <router-link to="/" class="home-icon">
      <div class="icon-button">
        <img
          src="../assets/icons/home_white.png"
          alt="Home"
          class="icon"
          @click="clearSelection"
        />
        <span class="tooltip">Home</span>
      </div>
    </router-link>
    <SelectComponent
      v-model="selectedOption"
      :options="options"
      placeholder="Selecione a Simulação"
    />
    <SearchComponent
      v-if="showSearch && shouldShowSearch"
      @search-input="onSearchInput"
    />
    <div class="icons">
      <div class="icon-button">
        <img
          src="../assets/icons/notifications_white.png"
          alt="Notificações"
          class="icon"
        />
        <span class="tooltip">Notificações</span>
      </div>
      <div class="icon-button">
        <img
          src="../assets/icons/account_circle_white.png"
          alt="Usuário"
          class="icon"
        />
        <span class="tooltip">Usuário</span>
      </div>
    </div>
  </div>
</template>

<script>
import SearchComponent from './SearchComponent.vue';
import SelectComponent from './SelectComponent.vue';
import { emitter } from 'src/eventBus';

export default {
  components: {
    SearchComponent,
    SelectComponent,
  },
  data() {
    return {
      selectedOption: '',
      options: [],
      showSearch: false,
    };
  },
  computed: {
    shouldShowSearch() {
      const pdfRoutes = ['VisualizarAlteracoes', 'VisualizarPortaria'];
      return !pdfRoutes.includes(this.$route.name);
    },
  },
  created() {
    this.loadOrgCharts();
    emitter.on('orgcharts-updated', this.loadOrgCharts);
    emitter.on('orgchart-selected', (id) => {
      this.selectedOption = id;
    });
  },

  methods: {
    loadOrgCharts() {
      const storedOrgCharts =
        JSON.parse(localStorage.getItem('orgcharts')) || [];
      if (storedOrgCharts.length > 0) {
        this.options = storedOrgCharts.map((orgchart) => ({
          value: orgchart.id,
          label: orgchart.name,
        }));
      } else {
        this.options = [];
      }
    },
    clearSelection() {
      this.selectedOption = '';
    },
    onSearchInput(searchTerm) {
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(searchTerm, '*');
      }
    },
  },
  watch: {
    selectedOption(newVal) {
      this.showSearch = newVal !== '';
      if (newVal && this.$route.params.id !== newVal) {
        this.$router.push({ path: `/orgchart/${newVal}`, force: true });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 75px;
  padding: 15px;
  @include app-bar-gradient;
}

.logo {
  height: 40px;
  margin-right: 20px;
  margin-bottom: 5px;
}

.home-icon {
  margin-right: 20px;
  font-size: 24px;
}

select {
  padding: 5px;
  margin-right: 20px;
}

.icons {
  margin-left: auto;
  display: flex;
  gap: 20px;
}

.notification-icon,
.user-icon {
  font-size: 24px;
}

.icon-button {
  position: relative;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button .tooltip {
  position: absolute;
  bottom: -150%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff3700;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s;
  pointer-events: none;
  margin-bottom: 4px;
}

.icon-button:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

.icon {
  width: 25px;
  height: 25px;
  cursor: pointer;
}
</style>
