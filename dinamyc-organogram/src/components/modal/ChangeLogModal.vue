<template>
  <div v-if="true">
    <div class="modal-overlay" @click="close"></div>
    <div class="side-modal">
      <div class="side-modal-header">
        <h2>Registro de Alterações</h2>
        <q-btn flat dense round icon="close" class="close-button" @click="close" />
      </div>
      <div class="side-modal-body">
        <div class="timeline">
          <div v-for="(event, index) in events" :key="index" class="timeline-event">
            <div class="timeline-icon">
              <img src="src/assets/icons/box.png" alt="Ícone do evento" />
            </div>
            <div class="timeline-content">
              <template v-if="event.type === 'position_change'">
                <p class="event-description">
                  <strong>{{ event.name }}</strong> passou a ocupar a vaga de <strong>{{ event.position }}</strong
                  >.
                </p>
                <p v-if="event.justification"><strong>Justificativa:</strong> {{ event.justification }}</p>
              </template>
              <template v-else-if="event.type === 'awaiting_position'">
                <p class="event-description">
                  Aguardando definição de funcionário para ocupar a cadeira de
                  <strong>{{ event.position }}</strong
                  >.
                </p>
              </template>
              <template v-else-if="event.type === 'termination'">
                <p class="event-description">
                  <strong>{{ event.name }}</strong> foi desligado(a) da empresa.
                </p>
              </template>
              <p class="event-date">{{ event.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChangeLogModal',
  data() {
    return {
      events: [
        {
          type: 'position_change',
          name: 'Pedro',
          position: 'Analista de Infraestrutura',
          justification: 'Não houve alteração salarial',
          date: '2025-02-15 10:00',
        },
        {
          type: 'termination',
          name: 'Flávia Silva',
          details: 'Detalhes adicionais sobre o desligamento.',
          date: '2025-02-16 14:30',
        },
        {
          type: 'awaiting_position',
          position: 'Analista de Mídias Sociais',
          date: '2025-02-17 09:00',
        },
        {
          type: 'position_change',
          name: 'Ana Paula',
          position: 'Coordenadora de Marketing',
          justification: 'Possui os pré-requisitos.',
          date: '2025-02-18 11:15',
        },
      ],
    };
  },
  methods: {
    close() {
      this.$emit('close');
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
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.side-modal {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 450px;
  height: 600px;
  background: $white;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid $background-white;
  overflow: hidden;
}

.side-modal-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $white;
  border-bottom: 1px solid $background-white;
}

.side-modal-header h2 {
  margin: 0;
  font-size: 18px;
}

.close-button {
  color: $background-gray;
}

.close-button:hover {
  color: $orange;
}

.header-divider {
  margin: 0;
  border: none;
  border-bottom: 1px solid $background-white;
}

.side-modal-body {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.timeline {
  position: relative;
  margin-left: 20px;
  padding-left: 20px;
  height: 100%;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background-color: $background-white;
}

.timeline-event {
  position: relative;
  margin-bottom: 20px;
}

.timeline-icon {
  position: absolute;
  left: -30px;
  top: 0;
  width: 20px;
  height: 20px;
  background-color: $orange;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-icon img {
  width: 12px;
  height: 12px;
  filter: brightness(0) invert(1);
}

.timeline-content {
  padding-left: 10px;
}

.event-description {
  margin: 0;
}

.event-date {
  margin: 0;
  font-size: 12px;
  color: $background-gray;
}

p {
  margin: 0;
}
</style>
