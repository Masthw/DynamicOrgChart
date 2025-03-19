<template>
  <div class="app-bar">
    <router-link to="/" class="logo-link">
      <img src="../assets/images/organiza_ai_logo.png" alt="Logo" class="logo" @click="clearSelection" />
    </router-link>
    <router-link to="/" class="home-icon">
      <div class="icon-button">
        <img src="../assets/icons/home_white.png" alt="Home" class="icon" @click="clearSelection" />
        <span class="tooltip">Home</span>
      </div>
    </router-link>
    <SelectComponent v-model="selectedOption" :options="options" placeholder="Selecione a Simulação" />
    <SearchComponent v-if="showSearch && shouldShowSearch" @search-input="onSearchInput" />
    <div class="icons">
      <div class="icon-button">
        <img src="../assets/icons/notifications_white.png" alt="Notificações" class="icon" @click="toggleNotifications" />
        <span class="tooltip">Notificações</span>
        <div class="notifications-menu-container">
          <q-menu v-model="showNotifications" anchor="bottom right" self="top right" class="relative-position" style="border-radius: 18px">
            <q-card class="notifications-menu">
              <!-- Cabeçalho geral do menu -->
              <q-card-section class="notifications-menu-header">
                <div class="header-content">
                  <span class="notifications-title">Notificações</span>
                </div>
                <q-btn flat dense round icon="close" class="close-button" @click="showNotifications = false" />
              </q-card-section>

              <!-- Tabela de Notificações -->
              <q-card-section class="notifications-table">
                <!-- Cabeçalho das colunas -->
                <div class="notification-row header-row">
                  <div class="col col-name">Nome do Arquivo</div>
                  <div class="col col-download">Download</div>
                  <div class="col col-delete">Excluir</div>
                </div>
                <!-- Linhas de dados -->
                <div class="notification-list">
                  <div class="notification-row" v-for="(item, index) in notifications" :key="index">
                    <div class="col col-name">{{ item.fileName }}</div>
                    <div class="col col-download">
                      <img src="../assets/icons/download_green.png" alt="Download" class="action-icon" @click.stop="downloadFile(item)" />
                    </div>
                    <div class="col col-delete">
                      <img src="../assets/icons/delete_red.png" alt="Excluir" class="action-icon" @click.stop="deleteFile(item)" />
                    </div>
                  </div>
                </div>
              </q-card-section>

              <!-- Ações -->
              <q-card-actions class="notifications-actions" align="center">
                <ButtonComponent label="OK" @click="closeNotifications" class="ok-button" />
              </q-card-actions>
            </q-card>
          </q-menu>
        </div>
      </div>
    </div>
    <div class="icon-button">
      <img src="../assets/icons/account_circle_white.png" alt="Usuário" class="user-icon" @click="toggleUserMenu" />
      <span class="tooltip">Usuário</span>

      <div class="user-menu-container">
        <q-menu v-model="showUserMenu" anchor="bottom right" self="top right" class="relative-position" style="border-radius: 14px">
          <q-card class="user-menu">
            <q-card-section class="user-menu-section">
              <span class="user-name">Nome Usuário</span>
              <q-btn flat dense round icon="close" class="close-button" @click="showUserMenu = false" />
            </q-card-section>
            <q-card-section class="user-menu-section">
              <p class="user-email">nomeusuario@arcellor.org.br</p>
            </q-card-section>
            <q-separator />
            <q-card-actions align="left" style="padding: 0">
              <q-btn flat @click="logout" class="logout-btn">
                <img src="../assets/icons/logout.png" alt="Sair" class="logout-icon" />
                <span class="logout-text">Sair</span>
              </q-btn>
            </q-card-actions>
          </q-card>
        </q-menu>
      </div>
    </div>
  </div>
</template>

<script>
import SearchComponent from './SearchComponent.vue';
import SelectComponent from './SelectComponent.vue';
import ButtonComponent from './ButtonComponent.vue';
import { emitter } from 'src/eventBus';

export default {
  components: {
    SearchComponent,
    SelectComponent,
    ButtonComponent,
  },
  data() {
    return {
      selectedOption: '',
      options: [],
      showSearch: false,
      showUserMenu: false,
      showNotifications: false,
      notifications: [
        { fileName: 'Arquivo1' },
        { fileName: 'Relatório' },
        { fileName: 'Simulação' },
        { fileName: 'Arquivo1' },
        { fileName: 'Arquivo1' },
        { fileName: 'Arquivo1' },
        { fileName: 'Arquivo1' },
        { fileName: 'Arquivo1' },
        { fileName: 'Arquivo1' },
        { fileName: 'Arquivo1' },
        { fileName: 'Arquivo1' },
      ],
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
      this.selectedOption = Number(id);
    });
    if (this.$route.params.id) {
      this.selectedOption = Number(this.$route.params.id);
    }
  },
  methods: {
    loadOrgCharts() {
      const storedOrgCharts = JSON.parse(localStorage.getItem('orgcharts')) || [];
      if (storedOrgCharts.length > 0) {
        this.options = storedOrgCharts.map((orgchart) => ({
          value: Number(orgchart.id),
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
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    logout() {
      console.log('logout');
      this.showUserMenu = false;
    },
    downloadFile(item) {
      console.log('Download do arquivo:', item.fileName);
    },
    deleteFile(item) {
      console.log('Excluir o arquivo:', item.fileName);
    },
    closeNotifications() {
      this.showNotifications = false;
    },
  },
  watch: {
    selectedOption(newVal) {
      this.showSearch = newVal !== '';
      if (newVal && this.$route.params.id != newVal) {
        this.$router.push({ path: `/orgchart/${newVal}`, force: true });
      }
    },
    '$route.params.id'(newId) {
      if (newId) {
        this.selectedOption = Number(newId);
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
  padding: 25px;
  @include app-bar-gradient;
}

.logo {
  height: 50px;
  width: 170px;
  margin-right: 20px;
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
  margin-right: 20px;
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
  padding: 2px;
}

.close-button {
  position: absolute;
  font-size: 10px;
  top: 0;
  right: 10px;
  color: $gray;

  &:hover {
    color: $orange;
  }
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

  &:hover {
    background-color: $orange;
    color: $white;

    .logout-icon {
      filter: brightness(0) invert(1);
    }
  }
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

.notifications-menu {
  width: 500px;
  background: $white;
  padding: 10px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.notifications-menu-header {
  flex-shrink: 0;
  position: relative;
  padding: 8px 0;
  text-align: center;

  .header-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .notifications-title {
    font-size: 1.2em;
    font-weight: bold;
    color: $gray;
  }

  .close-button {
    position: absolute;
    top: 0;
    right: 10px;
    color: $gray;

    &:hover {
      color: $orange;
    }
  }
}

.notifications-table {
  overflow: hidden;
  margin-top: 10px;
  display: flex;
  flex-direction: column;

  > .header-row {
    flex-shrink: 0;
  }
}

.notification-row {
  display: flex;
  align-items: center;
  padding: 6px 0;

  &.header-row {
    border-bottom: 1px solid $background-white;
    font-weight: bold;
    color: $gray;
    font-size: 13px;
    padding: 8px 0;

    .col-name {
      color: $gray;
      font-weight: bold;
      font-size: 13px;
    }
  }

  &:not(.header-row) {
    overflow-y: auto;
    max-height: calc(100% - 40px);
    flex-grow: 1;
    border-bottom: 1px solid $background-white;

    .col-name {
      color: $gray;
      font-weight: 400;
    }
  }
}

.notifications-table > :not(.header-row) {
  overflow-y: auto;
  flex-grow: 1;
  padding-right: 0;

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: $background-white;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: $orange;
    border-radius: 3px;
  }
}

.col {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-sizing: border-box;

  &-name {
    justify-content: flex-start;
    text-align: left;
    font-size: 12px;
    padding-left: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-download,
  &-delete {
    width: 60px;
    min-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.action-icon {
  width: 18px;
  height: 18px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.notifications-actions {
  flex-shrink: 0;
  padding: 8px 0;
  margin-top: 10px;
}
</style>
