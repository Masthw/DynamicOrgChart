<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="organogram-container">
      <div class="zoom-controls">
        <q-btn icon="zoom_in" flat round @click="zoomIn" />
        <q-btn icon="zoom_out" flat round @click="zoomOut" />
        <q-btn icon="fullscreen_exit" flat round @click="resetZoom" />
      </div>
      <q-page class="organogram" :style="organogramStyle">
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
          v-for="(person, index) in visibleSortedPeople"
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
            :isChildrenVisible="getChildrenVisibility(person.id)"
            :isVisible="visiblePeople.includes(person.id)"
            @toggle-visibility="toggleChildrenVisibility(person.id)"
            @info-click="showInfo"
            @add-click="addChild"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import PersonCard from 'components/PersonCard.vue';

const people = reactive([
  {
    id: '1',
    name: 'João Silva',
    jobTitle: 'CEO',
    isChildrenVisible: true,
  },
  {
    id: '2',
    name: 'Maria Souza',
    jobTitle: 'CTO',
    parentId: '1',
    isChildrenVisible: true,
  },
  {
    id: '3',
    name: 'Carlos Pereira',
    jobTitle: 'Developer',
    parentId: '1',
    isChildrenVisible: true,
  },
  {
    id: '4',
    name: 'Ana Costa',
    jobTitle: 'Designer',
    parentId: '2',
    isChildrenVisible: true,
  },
  {
    id: '5',
    name: 'Pedro Lima',
    jobTitle: 'Analyst',
    parentId: '3',
    isChildrenVisible: true,
  },
  {
    id: '6',
    name: 'Laura Campos',
    jobTitle: 'Intern',
    parentId: '4',
    isChildrenVisible: true,
  },
  {
    id: '7',
    name: 'Fernanda Nunes',
    jobTitle: 'Designer',
    parentId: '2',
    isChildrenVisible: true,
  },
  {
    id: '8',
    name: 'Fernanda Nunes',
    jobTitle: 'Designer',
    parentId: '3',
    isChildrenVisible: true,
  },
  {
    id: '9',
    name: 'Teu pai',
    jobTitle: 'Designer',
    parentId: '1',
    isChildrenVisible: true,
  },
  {
    id: '10',
    name: 'Mago',
    jobTitle: 'Designer',
    parentId: '9',
    isChildrenVisible: true,
  },
  {
    id: '11',
    name: 'Fernnes',
    jobTitle: 'Designer',
    parentId: '10',
    isChildrenVisible: true,
  },
]);

const visiblePeople = ref([...people.map((person) => person.id)]);

const levelHeight = 300;
const nodeWidth = 250;
const spacing = 50;
const screenWidth = window.innerWidth;

const groupedByParentId = computed(() => {
  return people.reduce((acc, person) => {
    const parentId = person.parentId || 'root';
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(person);
    return acc;
  }, {});
});

const sortedPeople = computed(() => {
  const sorted = [];

  const sortGroup = (parentId, yOffset) => {
    const group = groupedByParentId.value[parentId] || [];
    let xOffset = (screenWidth - group.length * (nodeWidth + spacing)) / 2;

    xOffset = Math.max(0, xOffset - 500);

    group.forEach((person) => {
      const hasChildren = groupedByParentId.value[person.id]?.length > 0;
      if (visiblePeople.value.includes(person.id)) {
        sorted.push({
          ...person,
          hasChildren,
          isVisible: visiblePeople.value.includes(person.id),
          isChildrenVisible: true,
          x: xOffset,
          y: yOffset,
        });
        if (groupedByParentId.value[person.id]) {
          sortGroup(person.id, yOffset + levelHeight);
        }
      }

      xOffset += nodeWidth + spacing;
    });
  };
  sortGroup('root', 0);
  return sorted;
});

const visibleSortedPeople = computed(() =>
  sortedPeople.value.filter((person) => visiblePeople.value.includes(person.id))
);

const getChildrenVisibility = (id) => {
  const person = people.find((p) => p.id === id);
  const visibility = person ? person.isChildrenVisible : true;
  return visibility;
};

const toggleChildrenVisibility = (id) => {
  const parentPerson = people.find((person) => person.id === id);
  if (!parentPerson) return;
  const descendants = getDescendants(id);

  if (parentPerson.isChildrenVisible) {
    descendants.forEach((descendantId) => {
      const index = visiblePeople.value.indexOf(descendantId);
      console.log('Descendants for ID:', id, descendants);

      if (index > -1) {
        visiblePeople.value.splice(index, 1);
      }
      const descendant = people.find((person) => person.id === descendantId);
      if (descendant) {
        descendant.isChildrenVisible = false;
      }
    });
  } else {
    descendants.forEach((descendantId) => {
      if (!visiblePeople.value.includes(descendantId)) {
        visiblePeople.value.push(descendantId);
      }
      const descendant = people.find((person) => person.id === descendantId);
      if (descendant) {
        descendant.isChildrenVisible = true;
      }
    });
  }

  parentPerson.isChildrenVisible = !parentPerson.isChildrenVisible;
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
    levelNodes.length * nodeWidth + (levelNodes.length - 1) * spacing;
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
    if (
      person.parentId &&
      visiblePeople.value.includes(person.id) &&
      visiblePeople.value.includes(person.parentId)
    ) {
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

const showInfo = (id) => {
  console.log('Mostrar informações do usuário com ID:', id);
};

const addChild = (id) => {
  console.log('Adicionar filho ao usuário com ID:', id);
};

const zoomLevel = ref(1);

const handleWheelZoom = (event) => {
  event.preventDefault();

  if (event.deltaY < 0 && zoomLevel.value < 2) {
    zoomIn();
  } else if (event.deltaY > 0 && zoomLevel.value > 0.2) {
    zoomOut();
  }
};

onMounted(() => {
  const container = document.querySelector('.organogram-container');
  if (container) {
    container.addEventListener('wheel', handleWheelZoom);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
  }
});

onBeforeUnmount(() => {
  const container = document.querySelector('.organogram-container');
  if (container) {
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
    container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;

    container.removeEventListener('wheel', handleWheelZoom);
    container.removeEventListener('mousedown', handleMouseDown);
    container.removeEventListener('mousemove', handleMouseMove);
    container.removeEventListener('mouseup', handleMouseUp);
    container.removeEventListener('mouseleave', handleMouseUp);
  }
});

const zoomIn = () => {
  if (zoomLevel.value < 2) {
    zoomLevel.value += 0.1;
  }
};

const zoomOut = () => {
  if (zoomLevel.value > 0.2) {
    zoomLevel.value -= 0.1;
  }
};

const resetZoom = () => {
  zoomLevel.value = 1;
};

const getMaxLevelWidth = () => {
  const levelWidths = [];

  // Obter a largura total de cada nível
  for (let level = 0; level <= getLevel(); level++) {
    const levelNodes = sortedPeople.value.filter(
      (p) => getLevel(p.id) === level
    );
    const totalWidth =
      levelNodes.length * nodeWidth + (levelNodes.length - 1) * spacing;
    levelWidths.push(totalWidth);
  }

  // Retornar a maior largura
  return Math.max(...levelWidths);
};

const organogramStyle = computed(() => {
  const scaledHeight = window.innerHeight / zoomLevel.value;

  const maxLevelWidth = getMaxLevelWidth();
  const scaledWidth = Math.max(
    window.innerWidth / zoomLevel.value,
    maxLevelWidth
  );

  return {
    transform: `scale(${zoomLevel.value})`,
    transformOrigin: 'center top',
    transition: 'transform 0.1s ease-in-out',
    height: `${scaledHeight}px`,
    width: `${scaledWidth}px`,
    overflow: 'visible',
  };
});

const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const scrollLeft = ref(0);
const scrollTop = ref(0);

const handleMouseDown = (event) => {
  isDragging.value = true;

  const container = event.currentTarget;
  startX.value = event.pageX - container.offsetLeft;
  startY.value = event.pageY - container.offsetTop;
  scrollLeft.value = container.scrollLeft;
  scrollTop.value = container.scrollTop;
};

const handleMouseMove = (event) => {
  if (!isDragging.value) return;

  const container = document.querySelector('.organogram-container');
  const x = event.pageX - container.offsetLeft;
  const y = event.pageY - container.offsetTop;

  const walkX = (x - startX.value) * -1; // Inverter para mover na direção certa
  const walkY = (y - startY.value) * -1;

  container.scrollLeft = scrollLeft.value + walkX;
  container.scrollTop = scrollTop.value + walkY;
};

const handleMouseUp = () => {
  isDragging.value = false;
};
</script>

<style scoped>
.organogram-container {
  background-color: #666;
  overflow: auto;
  min-width: 100vw;
  min-height: 100vh;
  padding: 0;
  display: flex;
  position: relative;
  z-index: 1;
  cursor: grab;
}

.organogram-container:active {
  cursor: grabbing;
}

.zoom-controls {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 100;
  display: flex;
  gap: 5px;
  color: white;
}

.organogram-container::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.organogram {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: max-content;
  min-width: max-content;
  position: relative;
  overflow: visible;
  scrollbar-width: none;
  -ms-overflow-style: none;
  z-index: 2;
  background-color: #666;
  box-sizing: border-box;
}

.organogram::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0; /* Chrome, Safari e Edge moderno */
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
