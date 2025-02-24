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
          class="user-icon"
          @click="toggleUserMenu"
        />
        <span class="tooltip">Usuário</span>

        <div class="user-menu-container">
          <q-menu
            v-model="showUserMenu"
            anchor="bottom right"
            self="top right"
            class="relative-position"
          >
            <q-card class="user-menu">
              <q-card-section class="user-menu-section">
                <span class="user-name">Nome Usuário</span>
                <img
                  src="../assets/icons/close.png"
                  alt="Fechar"
                  class="close-icon"
                  @click="showUserMenu = false"
                />
              </q-card-section>
              <q-card-section class="user-menu-section">
                <p class="user-email">nomeusuario@arcellor.org.br</p>
              </q-card-section>
              <q-separator />
              <q-card-actions align="left" style="padding: 0">
                <q-btn flat @click="logout" class="logout-btn">
                  <img
                    src="../assets/icons/logout.png"
                    alt="Sair"
                    class="logout-icon"
                  />
                  <span class="logout-text">Sair</span>
                </q-btn>
              </q-card-actions>
            </q-card>
          </q-menu>
        </div>
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
      showUserMenu: false,
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
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
      console.log('showUserMenu:', this.showUserMenu);
    },

    logout() {
      console.log('logout');
      this.showUserMenu = false;
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

<style scoped lang="scss">
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
  background-color: $orange;
  color: $white;
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

.user-menu {
  min-width: 240px;
  background: $white;
  padding: 7px;
}

.user-menu .close-icon {
  position: absolute;
  top: 2px;
  right: 10px;
  width: 15px;
  height: 15px;
  cursor: pointer;
  transition: color 0.3s ease !important;
}

.user-menu-section {
  padding: 1px;
}

.user-menu .close-icon:hover {
  color: $orange !important;
}

.logout-icon {
  cursor: pointer;
  transition: color 0.3s ease !important;
}

.logout-icon:hover {
  color: $orange !important;
}

.logout-icon {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}
.logout-btn {
  margin-top: 2px;
  font-weight: normal;
  font-size: 0.8em;
}

.user-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}
.user-menu-container {
  height: min-content;
}

.user-name {
  font-weight: 600;
  margin-left: 5px;
  color: $gray;
}

.user-email {
  color: $gray;
  font-size: 0.9em;
  margin: 0 0 0 05px;
}

.q-separator {
  margin-left: 5px;
  margin-right: 5px;
}

.logout-text {
  text-transform: capitalize;
}
</style>
