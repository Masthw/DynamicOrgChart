<template>
  <q-layout view="lHh Lpr lFf">
    <!-- QPageContainer como filho direto de QLayout -->
    <q-page-container>
      <!-- QPage como filho direto de QPageContainer -->
      <q-page class="full-height full-width flex flex-center">
        <div
          class="organogram full-width full-height flex-center"
          ref="organogram"
        >
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
      </q-page>
    </q-page-container>
  </q-layout>
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
.full-width {
  width: 100%;
}

.full-height {
  height: 100%;
}
.organogram {
  padding: 20px;
  display: flex;
}

.q-page {
  background-color: #666;
}
</style>
