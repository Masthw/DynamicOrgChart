<template>
  <q-card v-if="isVisible" class="person-card">
    <q-img
      v-if="photo"
      :src="photo"
      alt="Person's photo"
      class="person-card__image"
    />
    <q-icon v-else name="account_circle" class="person-card__image icon" />
    <q-card-section>
      <div class="text-h6">{{ name }}</div>
      <div class="text-subtitle2">{{ jobTitle }}</div>
      <q-btn
        class="options-btn"
        flat
        icon="more_vert"
        size="md"
        ref="menuButton"
        @click="toggleMenu"
      />
      <q-menu v-if="isMenuOpen" anchor="top right" self="top left" fit>
        <q-list>
          <q-item clickable @click="handleInfoClick">
            <q-item-section>Informações</q-item-section>
          </q-item>
          <q-item clickable @click="handleAddClick">
            <q-item-section>Adicionar</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      <div v-if="hasChildren" class="toggle-children" @click="toggleVisibility">
        <q-icon
          class="toggle-icon"
          :name="isChildrenVisible ? 'remove' : 'add'"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  name: { type: String, required: true },
  id: { type: String, required: true },
  parentId: { type: String, required: false },
  jobTitle: { type: String, required: true },
  photo: { type: String, required: false },
  hasChildren: { type: Boolean, required: true },
  isVisible: { type: Boolean, required: true },
  isChildrenVisible: { type: Boolean, required: true },
});

const emit = defineEmits(['toggle-visibility', 'info-click', 'add-click']);

const toggleVisibility = () => {
  emit('toggle-visibility', props.id);
};

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleInfoClick = () => {
  emit('info-click', props.id);
  isMenuOpen.value = false;
};

const handleAddClick = () => {
  emit('add-click', props.id);
  isMenuOpen.value = false;
};
</script>

<style scoped>
.person-card {
  width: 250px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: visible;
}

.person-card__image {
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.person-card__image.icon {
  font-size: 80px;
  color: #bbb;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100%;
  background-color: #f0f0f0;
}

.q-card-section {
  text-align: center;
}

.text-h6 {
  font-weight: bold;
}

.text-subtitle2 {
  color: gray;
}

.options-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.toggle-children {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: #0a5aa5;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.toggle-icon {
  font-size: 18px;
  color: white;
}
</style>
