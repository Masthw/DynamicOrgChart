<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page
        class="organogram"
        :style="{ minHeight: `${minHeight}px`, minWidth: `${minWidth}px` }"
      >
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
        <div
          v-for="(person, index) in sortedPeople"
          :key="index"
          :style="getPositionStyle(person)"
        >
          <person-card
            :id="person.id"
            :parentId="person.parentId"
            :name="person.name"
            :jobTitle="person.jobTitle"
            :photo="person.photo"
            :hasChildren="person.hasChildren"
            :isVisible="visiblePeople.includes(person.id)"
            @toggle-visibility="toggleChildrenVisibility(person.id)"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue';
import PersonCard from 'components/PersonCard.vue';

const people = [
  { id: 1, name: 'João Silva', jobTitle: 'CEO', hasChildren: true },
  { id: 2, name: 'Maria Souza', jobTitle: 'CTO', parentId: 1 },
  { id: 3, name: 'Carlos Pereira', jobTitle: 'Developer', parentId: 1 },
  { id: 4, name: 'Ana Costa', jobTitle: 'Designer', parentId: 2 },
  { id: 5, name: 'Pedro Lima', jobTitle: 'Analyst', parentId: 3 },
  { id: 6, name: 'Laura Campos', jobTitle: 'Intern', parentId: 4 },
  { id: 7, name: 'Fernanda Nunes', jobTitle: 'Designer', parentId: 2 },
  { id: 8, name: 'Fernanda Nunes', jobTitle: 'Designer', parentId: 3 },
  { id: 9, name: 'Teu pai', jobTitle: 'Designer', parentId: 1 },
  { id: 10, name: 'Mago', jobTitle: 'Designer', parentId: 9 },
  { id: 11, name: 'Fernnes', jobTitle: 'Designer', parentId: 10 },
];

const visiblePeople = ref([...people.map((person) => person.id)]);

const levelHeight = 300;
const nodeWidth = 250;
const spacing = 50;
const screenWidth = window.innerWidth;

const groupedByParentId = computed(() => {
  return people.reduce((acc, person) => {
    const parentId = person.parentId || 'root'; // 'root' para a pessoa sem pai
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(person);
    return acc;
  }, {});
});

// Ordenar as pessoas por grupo, começando pela raiz
const sortedPeople = computed(() => {
  const sorted = [];

  const sortGroup = (parentId, yOffset) => {
    const group = groupedByParentId.value[parentId] || [];
    let xOffset = (screenWidth - group.length * (nodeWidth + spacing)) / 2;

    group.forEach((person) => {
      if (visiblePeople.value.includes(person.id)) {
        sorted.push({
          ...person,
          hasChildren: groupedByParentId.value[person.id]?.length > 0,
          x: xOffset,
          y: yOffset,
        });
      }
      xOffset += nodeWidth + spacing;

      if (groupedByParentId.value[person.id]) {
        sortGroup(person.id, yOffset + levelHeight);
      }
    });
  };

  sortGroup('root', 0);
  return sorted;
});

const toggleChildrenVisibility = (id) => {
  const isCurrentlyVisible = visiblePeople.value.includes(id);
  const descendants = getDescendants(id);

  if (isCurrentlyVisible) {
    descendants.forEach((descendantId) => {
      const index = visiblePeople.value.indexOf(descendantId);
      if (index > -1) {
        visiblePeople.value.splice(index, 1); // Remove do array
      }
    });
  } else {
    descendants.forEach((descendantId) => {
      if (!visiblePeople.value.includes(descendantId)) {
        visiblePeople.value.push(descendantId); // Adiciona ao array
      }
    });
  }
};

const getDescendants = (id) => {
  const descendants = [];
  const findDescendants = (parentId) => {
    const children = groupedByParentId.value[parentId] || [];
    children.forEach((child) => {
      descendants.push(child.id);
      findDescendants(child.id);
    });
  };
  findDescendants(id);
  return descendants;
};

const getX = (id) => {
  const level = getLevel(id);
  const levelNodes = sortedPeople.value.filter((p) => getLevel(p.id) === level);
  const totalWidth =
    levelNodes.length * nodeWidth + (levelNodes.length - 1) * spacing; // 50px de gap
  const startX = (screenWidth - totalWidth) / 2;
  const nodeIndex = levelNodes.findIndex((p) => p.id === id);
  return startX + nodeIndex * (nodeWidth + spacing);
};

const getY = (id) => {
  const person = sortedPeople.value.find((p) => p.id === id);
  return person ? person.y : 0;
};

const getLevel = (id) => {
  let level = 0;
  let currentNode = sortedPeople.value.find((p) => p.id === id);
  while (currentNode?.parentId) {
    level++;
    currentNode = sortedPeople.value.find((p) => p.id === currentNode.parentId);
  }
  return level;
};

const getPositionStyle = (person) => ({
  position: 'absolute',
  left: `${getX(person.id)}px`,
  top: `${getY(person.id)}px`,
});

const connections = computed(() => {
  const result = [];
  sortedPeople.value.forEach((person) => {
    if (person.parentId) {
      const parent = sortedPeople.value.find((p) => p.id === person.parentId);
      result.push({
        id: `${parent.id}-${person.id}`,
        x1: getX(parent.id) + nodeWidth / 2,
        y1: getY(parent.id) + 180,
        x2: getX(person.id) + nodeWidth / 2,
        y2: getY(person.id),
        color: 'black',
      });
    }
  });
  return result;
});

const minWidth = computed(() => {
  const levels = Array.from(
    {
      length:
        Math.max(...sortedPeople.value.map((person) => getLevel(person.id))) +
        1,
    },
    (_, level) =>
      sortedPeople.value.filter((p) => getLevel(p.id) === level).length
  );

  const maxNodesInLevel = Math.max(...levels);
  return maxNodesInLevel * nodeWidth + (maxNodesInLevel - 1) * spacing;
});

const minHeight = computed(() => {
  const maxLevel = Math.max(
    ...sortedPeople.value.map((person) => getLevel(person.id))
  );
  return (maxLevel + 2) * levelHeight;
});
</script>

<style scoped>
.organogram {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;
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
