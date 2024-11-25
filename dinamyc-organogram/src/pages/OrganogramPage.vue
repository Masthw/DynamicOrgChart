<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="organogram">
        <svg class="connections" xmlns="http://www.w3.org/2000/svg">
          <line
            v-for="connection in connections"
            :key="connection.id"
            :x1="connection.x1"
            :y1="connection.y1"
            :x2="connection.x2"
            :y2="connection.y2"
            :stroke="connection.color"
            stroke-width="2"
          />
        </svg>
        <q-container>
          <q-row>
            <q-col
              v-for="(person, index) in people"
              :key="index"
              :style="getPositionStyle(person)"
            >
              <person-card
                :id="person.id"
                :parent-id="person.parentId"
                :name="person.name"
                :jobTitle="person.jobTitle"
                :photo="person.photo"
              />
            </q-col>
          </q-row>
        </q-container>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue';
import PersonCard from 'components/PersonCard.vue';

// Dados fictícios das pessoas para mostrar no organograma
const people = [
  { id: 1, name: 'João Silva', jobTitle: 'CEO' },
  { id: 2, name: 'Maria Souza', jobTitle: 'CTO', parentId: 1 },
  { id: 3, name: 'Carlos Pereira', jobTitle: 'Developer', parentId: 1 },
  { id: 4, name: 'Ana Costa', jobTitle: 'Designer', parentId: 2 },
  { id: 5, name: 'Ana Costa', jobTitle: 'Designer', parentId: 3 },
  { id: 6, name: 'Ana Costa', jobTitle: 'Designer', parentId: 4 },
];

const levelHeight = 350;
const nodeWidth = 250;
const screenWidth = window.innerWidth;

const connections = computed(() => {
  return people
    .filter((person) => person.parentId) // Apenas quem tem um pai
    .map((child) => {
      const parent = people.find((p) => p.id === child.parentId);
      return {
        id: `${parent.id}-${child.id}`,
        x1: getX(parent.id) + nodeWidth / 2,
        y1: getY(parent.id) + 180,
        x2: getX(child.id) + nodeWidth / 2,
        y2: getY(child.id),
        color: 'black', // Exemplo: cor azul para filhos diretos do CEO
      };
    });
});

const getX = (id) => {
  const level = getLevel(id);
  const levelNodes = people.filter((p) => getLevel(p.id) === level);
  const totalWidth =
    levelNodes.length * nodeWidth + (levelNodes.length - 1) * 50; // 50px de gap
  const startX = (screenWidth - totalWidth) / 2;
  const nodeIndex = levelNodes.findIndex((p) => p.id === id);
  return startX + nodeIndex * (nodeWidth + 50);
};
const getY = (id) => {
  const level = getLevel(id);
  return level * levelHeight;
};
const getLevel = (id) => {
  let level = 0;
  let currentNode = people.find((p) => p.id === id);
  while (currentNode && currentNode.parentId) {
    level++;
    currentNode = people.find((p) => p.id === currentNode.parentId);
  }
  return level;
};
const getPositionStyle = (person) => ({
  position: 'absolute',
  left: `${getX(person.id)}px`,
  top: `${getY(person.id)}px`,
});
</script>

<style scoped>
.organogram {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  background-color: #666;
}

.connections {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.q-col {
  text-align: center;
}
</style>
