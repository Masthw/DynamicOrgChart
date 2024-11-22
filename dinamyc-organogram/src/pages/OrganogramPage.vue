<template>
  <div class="organogram">
    <q-container>
      <q-row>
        <q-col
          v-for="(person, index) in people"
          :key="index"
          cols="12"
          sm="4"
          md="3"
        >
          <person-card
            :name="person.name"
            :jobTitle="person.jobTitle"
            :photo="person.photo"
          />
        </q-col>
      </q-row>
    </q-container>
  </div>
</template>

<script setup>
import PersonCard from 'components/PersonCard.vue';

// Dados fictícios das pessoas para mostrar no organograma
const people = [
  {
    name: 'João Silva',
    jobTitle: 'CEO',
  },
  {
    name: 'Maria Souza',
    jobTitle: 'CTO',
  },
  {
    name: 'Carlos Pereira',
    jobTitle: 'Developer',
  },
  // Adicione mais pessoas conforme necessário
];
</script>

<style scoped>
.organogram {
  padding: 20px;
}
</style>
