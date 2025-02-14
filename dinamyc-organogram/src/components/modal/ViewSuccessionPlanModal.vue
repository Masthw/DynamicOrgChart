<template>
  <div class="modal-overlay" v-if="true">
    <q-card class="side-modal">
      <!-- Ícone centralizado -->
      <div class="icon-wrapper">
        <div class="icon-container">
          <img src="/src/assets/icons/lan.png" alt="Ícone" class="modal-icon" />
        </div>
      </div>

      <!-- Cabeçalho do Modal -->
      <q-card-section class="modal-header">
        <h2 class="modal-title">PLANO DE SUCESSÃO</h2>
        <p class="modal-text">
          Visualize os sucessores estratégicos para este cargo.
        </p>
      </q-card-section>

      <!-- Cards de Candidatos -->
      <q-card-section class="candidate-cards">
        <div
          v-for="candidate in successionPlan"
          :key="candidate.id"
          class="candidate-card"
        >
          <!-- Foto do Candidato -->
          <div class="candidate-icon">
            <img :src="candidate.image" alt="Candidato" />
          </div>

          <!-- Nome e Cargo -->
          <div class="candidate-info">
            <h4>{{ candidate.name }} {{ candidate.lastName }}</h4>
            <p>{{ candidate.position }}</p>
            <p class="salary">R$ {{ candidate.salary }}</p>
          </div>
        </div>
      </q-card-section>

      <!-- Botão OK -->
      <q-card-actions class="button-container">
        <ButtonComponent
          label="OK"
          variant="secondary"
          @click="confirm"
          class="ok-button"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import ButtonComponent from '../ButtonComponent.vue';

export default {
  name: 'ViewSuccessionPlanModal',
  components: {
    ButtonComponent,
  },
  props: {
    successionPlan: {
      type: Array,
      required: true,
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
  },
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-title {
  font-size: 22px;
  line-height: normal;
  font-weight: bold;
}

.side-modal {
  background: $background-white;
  border-radius: 20px;
  padding: 20px;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.icon-wrapper {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  background: $background-white;
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container {
  width: 60px;
  height: 60px;
  background: $orange;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon {
  width: 30px;
  height: 30px;
  filter: brightness(0) invert(1);
}

.modal-header {
  font-size: 20px;
  font-weight: bold;
  color: $gray;
  margin-bottom: 10px;
}

.modal-text {
  font-size: 16px;
  color: $gray;
  font-weight: normal;
}

.candidate-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
}

.candidate-card {
  width: 200px;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid $background-gray;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.candidate-icon {
  position: absolute;
  top: -25px;
  left: 25px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.candidate-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.candidate-info {
  font-size: 14px;
  margin-top: 15px;
}

.candidate-info h4 {
  font-size: 16px;
  margin: 0;
  margin-left: 10px;
}

.candidate-info p {
  color: $gray;
  font-size: 12px;
  margin: 0;
}

.salary {
  font-weight: bold;
  color: $background-gray;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.ok-button {
  width: 300px;
}
</style>
