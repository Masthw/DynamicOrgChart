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
import {} from 'vue';
const props = defineProps({
  name: { type: String, required: true },
  id: { type: Number, required: true },
  parentId: { type: Number, required: false },
  jobTitle: { type: String, required: true },
  photo: { type: String, required: false },
  hasChildren: { type: Boolean, required: true },
  isVisible: { type: Boolean, required: true },
  isChildrenVisible: { type: Boolean, required: true },
});

const emit = defineEmits(['toggle-visibility']);

const toggleVisibility = () => {
  emit('toggle-visibility', props.id);
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
