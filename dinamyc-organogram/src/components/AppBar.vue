<template>
  <div class="app-bar">
    <img src="../assets/images/organiza_ai_logo.png" alt="Logo" class="logo" />
    <router-link to="/" class="home-icon">
      <img src="../assets/icons/home_white.png" alt="Home" class="icon" />
    </router-link>
    <select v-model="selectedOption" @change="onSelectChange">
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <SearchComponent v-if="showSearch" />
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

export default {
  components: {
    SearchComponent,
  },
  data() {
    return {
      selectedOption: '',
      options: [
        { value: 'option1', label: 'Opção 1' },
        { value: 'option2', label: 'Opção 2' },
        { value: 'option3', label: 'Opção 3' },
      ],
      showSearch: false,
    };
  },
  methods: {
    onSelectChange() {
      this.showSearch = this.selectedOption !== '';
    },
  },
};
</script>

<style lang="scss" scoped>
.app-bar {
  display: flex;
  align-items: center;
  justify-content: center;
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
