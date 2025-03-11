<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2 class="modal-title">Empregados Não designados</h2>
      <q-btn flat dense round icon="close" class="close-button" @click="closeModal" />
      <div v-if="nodes.length === 0" class="empty-list-message">Não existem empregados não designados.</div>
      <div v-for="(node, index) in nodes" :key="node.id" class="node-item" :class="{ 'last-item': index === nodes.length - 1 }">
        <img :src="node.image" alt="Node Image" class="node-image" />
        <div class="node-info">
          <div class="node-name">{{ node.name }}</div>
          <div class="node-actions">
            <!-- Botões apenas com ícones e tooltip via title -->
            <div class="button-wrapper">
              <ButtonComponent class="icon-only" label="" icon="/src/assets/icons/arrow.png" variant="secondary" @click="handleReallocate(node)" />
              <span class="button-tooltip">Realocar</span>
            </div>
            <div class="button-wrapper">
              <ButtonComponent class="icon-only" label="" icon="/src/assets/icons/delete.png" variant="primary" @click="handleRemove(node)" />
              <span class="button-tooltip">Desligar</span>
            </div>
          </div>
        </div>
      </div>
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

const emit = defineEmits(['close', 'reallocate', 'remove']);

function closeModal() {
  emit('close');
}

function handleReallocate(node) {
  console.log('Realocar para node:', node);
  emit('reallocate', node);
}

function handleRemove(node) {
  console.log('Remover node:', node);
  emit('remove', node);
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
}

.modal {
  background: $white;
  padding: 20px;
  border-radius: 8px;
  width: 350px;
  margin-right: 20px;
  max-width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: $gray;
  text-align: center;
  margin-bottom: 15px;
}

.empty-list-message {
  font-size: 16px;
  color: $background-gray;
  text-align: center;
  margin-bottom: 15px;
}

.node-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid $background-gray;
}

.node-item.last-item {
  border-bottom: none;
}

.node-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.node-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-name {
  font-size: 14px;
  color: $gray;
}

.node-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.button-wrapper {
  position: relative;
  display: inline-block;
  text-align: center;
}

.button-tooltip {
  display: none;
  position: absolute;
  top: 110%;
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
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.button-wrapper:hover .button-tooltip {
  display: block;
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0px);
}

.custom-button.icon-only {
  padding: 0.5rem;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.custom-button.icon-only .button-icon) {
  margin-right: 0 !important;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 15px;
  color: $gray;
  &:hover {
    color: $orange;
  }
}
</style>
