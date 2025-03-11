<template>
  <div class="modal-overlay" v-if="true">
    <div class="modal">
      <div v-if="nodes.length === 0" class="empty-list-message">Não há nodes no pool.</div>
      <div v-for="node in nodes" :key="node.id" class="node-item">
        <img :src="node.image" alt="Node Image" class="node-image" />
        <div class="node-name">{{ node.name }}</div>
      </div>

      <!-- Usando ButtonComponent -->
      <q-card-actions class="button-container">
        <ButtonComponent label="Fechar" variant="secondary" @click="closeModal" :icon="'/src/assets/icons/close.png'" />
      </q-card-actions>
    </div>
  </div>
</template>

<script setup>
import ButtonComponent from '../ButtonComponent.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  nodes: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close']);

function closeModal() {
  emit('close');
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  right: 0; /* Modal fica à direita */
  bottom: 0;
  display: flex;
  justify-content: flex-end; /* Alinha o modal à direita */
  align-items: center;
  z-index: 1000;
}

.modal {
  background: $white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  margin-right: 20px;
  max-width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.empty-list-message {
  font-size: 16px;
  color: #888;
  text-align: center;
}

.node-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.node-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.node-name {
  font-size: 14px;
  color: #08011e;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
