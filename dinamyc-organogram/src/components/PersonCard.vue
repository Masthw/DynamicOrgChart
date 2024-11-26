<template>
  <q-card class="person-card">
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
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  name: { type: String, required: true },
  id: { type: Number, required: true },
  parentId: { type: Number, required: false },
  jobTitle: { type: String, required: true },
  photo: { type: String, required: false },
});
</script>

<style scoped>
.person-card {
  width: 250px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
</style>
