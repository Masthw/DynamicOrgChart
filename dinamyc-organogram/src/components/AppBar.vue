<template>
  <div class="app-bar">
    <img src="../assets/images/organiza_ai_logo.png" alt="Logo" class="logo" />
    <router-link to="/" class="home-icon">
      <img
        src="../assets/icons/home_white.png"
        alt="Home"
        class="icon"
        @click="clearSelection"
      />
    </router-link>
    <SelectComponent
      v-model="selectedOption"
      :options="options"
      placeholder="Selecione a Simulação"
    />
    <SearchComponent v-if="showSearch" @search-input="onSearchInput" />
    <div class="icons">
      <img
        src="../assets/icons/notifications_white.png"
        alt="Notificações"
        class="icon"
      />
      <img
        src="../assets/icons/account_circle_white.png"
        alt="Usuário"
        class="icon"
      />
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

.icon {
  width: 25px;
  height: 25px;
  cursor: pointer;
}
</style>
