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
            @add-click="openAddChildDrawer"
          />
        </div>
      </q-page>
    </q-page-container>
    <q-drawer v-model="infoDrawer" side="right" overlay>
      <div class="person-info">
        <q-img
          v-if="selectedPerson.photo"
          :src="photo"
          alt="Person's photo"
          class="selected-person-photo"
        />
        <q-icon
          v-else
          name="account_circle"
          class="selected-person-image icon"
        />

        <div class="person-details">
          <div class="person-name">{{ selectedPerson.name }}</div>
          <div class="person-job">{{ selectedPerson.jobTitle }}</div>
        </div>
        <q-btn icon="edit" flat @click="isEditing = true" />
        <q-form v-if="isEditing" @submit.prevent="updateInfo">
          <q-input v-model="selectedPerson.name" label="Nome" />
          <q-input v-model="selectedPerson.jobTitle" label="Cargo" />
          <div class="q-mt-md">
            <q-btn type="submit" label="Salvar alterações" color="secondary" />
          </div>
        </q-form>
      </div>
    </q-drawer>
    <q-drawer v-model="addChildDrawer" side="right" overlay>
      <div class="add-child-form">
        <div class="child-photo">
          <q-img
            v-if="newChild.photo"
            :src="newChild.photo"
            alt="Foto do novo filho"
            class="photo-img"
          />
          <q-icon v-else name="account_circle" class="default-photo-icon" />
        </div>
        <q-form @submit.prevent="addChild">
          <q-input v-model="newChild.name" label="Nome" />
          <q-input v-model="newChild.jobTitle" label="Cargo" />
          <div class="q-mt-md">
            <q-btn type="submit" label="Adicionar Filho" color="secondary" />
          </div>
        </q-form>
      </div>
    </q-drawer>
  </q-layout>
</template>

<script setup>
import { computed, reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import PersonCard from 'components/PersonCard.vue';

const people = reactive([
  { id: '1', name: 'João Silva', jobTitle: 'CEO', isChildrenVisible: true },
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
    jobTitle: 'CFO',
    parentId: '1',
    isChildrenVisible: true,
  },
  {
    id: '4',
    name: 'Ana Costa',
    jobTitle: 'Design Lead',
    parentId: '2',
    isChildrenVisible: true,
  },
  {
    id: '5',
    name: 'Pedro Lima',
    jobTitle: 'Tech Lead',
    parentId: '2',
    isChildrenVisible: true,
  },
  {
    id: '6',
    name: 'Laura Campos',
    jobTitle: 'Software Engineer',
    parentId: '5',
    isChildrenVisible: true,
  },
  {
    id: '7',
    name: 'Fernanda Nunes',
    jobTitle: 'UX Designer',
    parentId: '4',
    isChildrenVisible: true,
  },
  {
    id: '8',
    name: 'Lucas Martins',
    jobTitle: 'Data Scientist',
    parentId: '3',
    isChildrenVisible: true,
  },
  {
    id: '9',
    name: 'Julia Rocha',
    jobTitle: 'Marketing Manager',
    parentId: '1',
    isChildrenVisible: true,
  },
  {
    id: '10',
    name: 'Rafael Mendes',
    jobTitle: 'Social Media Analyst',
    parentId: '9',
    isChildrenVisible: true,
  },
  {
    id: '11',
    name: 'Clara Almeida',
    jobTitle: 'HR Manager',
    parentId: '1',
    isChildrenVisible: true,
  },
  {
    id: '12',
    name: 'Ricardo Lopes',
    jobTitle: 'HR Specialist',
    parentId: '11',
    isChildrenVisible: true,
  },
  {
    id: '13',
    name: 'Beatriz Santos',
    jobTitle: 'Recruiter',
    parentId: '12',
    isChildrenVisible: true,
  },
  {
    id: '14',
    name: 'Eduardo Farias',
    jobTitle: 'Intern',
    parentId: '6',
    isChildrenVisible: true,
  },
  {
    id: '15',
    name: 'Mariana Oliveira',
    jobTitle: 'Finance Analyst',
    parentId: '3',
    isChildrenVisible: true,
  },
  {
    id: '16',
    name: 'Gustavo Ribeiro',
    jobTitle: 'DevOps Engineer',
    parentId: '5',
    isChildrenVisible: true,
  },
  {
    id: '17',
    name: 'Renata Carvalho',
    jobTitle: 'QA Engineer',
    parentId: '6',
    isChildrenVisible: true,
  },
  {
    id: '18',
    name: 'Bruno Fernandes',
    jobTitle: 'Product Manager',
    parentId: '2',
    isChildrenVisible: true,
  },
  {
    id: '19',
    name: 'Isabela Souza',
    jobTitle: 'Graphic Designer',
    parentId: '4',
    isChildrenVisible: true,
  },
  {
    id: '20',
    name: 'Felipe Santos',
    jobTitle: 'Backend Developer',
    parentId: '5',
    isChildrenVisible: true,
  },
  {
    id: '21',
    name: 'Sofia Lima',
    jobTitle: 'Frontend Developer',
    parentId: '5',
    isChildrenVisible: true,
  },
  {
    id: '22',
    name: 'Gabriel Costa',
    jobTitle: 'Machine Learning Engineer',
    parentId: '8',
    isChildrenVisible: true,
  },
  {
    id: '23',
    name: 'Alice Ribeiro',
    jobTitle: 'Content Strategist',
    parentId: '9',
    isChildrenVisible: true,
  },
  {
    id: '24',
    name: 'Thiago Nunes',
    jobTitle: 'Customer Success Manager',
    parentId: '11',
    isChildrenVisible: true,
  },
  {
    id: '25',
    name: 'Victor Amaral',
    jobTitle: 'Sales Manager',
    parentId: '1',
    isChildrenVisible: true,
  },
  {
    id: '26',
    name: 'Carolina Vieira',
    jobTitle: 'Account Executive',
    parentId: '25',
    isChildrenVisible: true,
  },
  {
    id: '27',
    name: 'Roberto Cruz',
    jobTitle: 'Sales Representative',
    parentId: '25',
    isChildrenVisible: true,
  },
  {
    id: '28',
    name: 'Debora Torres',
    jobTitle: 'UI Designer',
    parentId: '4',
    isChildrenVisible: true,
  },
  {
    id: '29',
    name: 'André Rocha',
    jobTitle: 'Marketing Analyst',
    parentId: '9',
    isChildrenVisible: true,
  },
  {
    id: '30',
    name: 'Patricia Barros',
    jobTitle: 'PR Specialist',
    parentId: '9',
    isChildrenVisible: true,
  },
  {
    id: '31',
    name: 'Joana Neves',
    jobTitle: 'Scrum Master',
    parentId: '2',
    isChildrenVisible: true,
  },
  {
    id: '32',
    name: 'Vinicius Guedes',
    jobTitle: 'Technical Writer',
    parentId: '3',
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
  const person = sortedPeople.value.find((p) => p.id === id);
  if (!person) return 0;

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

const generateRandomColor = () => {
  const base = 150;
  const range = 100;

  const randomChannel = () =>
    Math.min(
      255,
      Math.max(0, base + Math.floor(Math.random() * range - range / 2))
    );
  const r = randomChannel();
  const g = randomChannel();
  const b = randomChannel();

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const getColorForParent = (parentId) => {
  if (!parentColors.value[parentId]) {
    parentColors.value[parentId] = generateRandomColor();
  }
  return parentColors.value[parentId];
};

const parentColors = ref({});

const connections = computed(() => {
  const result = [];
  sortedPeople.value.forEach((person) => {
    if (
      person.parentId &&
      visiblePeople.value.includes(person.id) &&
      visiblePeople.value.includes(person.parentId)
    ) {
      const parent = sortedPeople.value.find((p) => p.id === person.parentId);

      const color = getColorForParent(person.parentId);

      result.push({
        id: `${parent.id}-${person.id}`,
        x1: getX(parent.id) + nodeWidth / 2,
        y1: getY(parent.id) + levelHeight / 2,
        x2: getX(person.id) + nodeWidth / 2,
        y2: getY(person.id),
        color,
      });
    }
  });
  return result;
});

const infoDrawer = ref(false);
const addChildDrawer = ref(false);
const isEditing = ref(false);
const selectedPerson = ref({
  id: null,
  name: '',
  jobTitle: '',
  photo: '',
});
const newChild = ref({
  name: '',
  jobTitle: '',
  photo: '',
});

const showInfo = (id) => {
  selectedPerson.value = people.find((person) => person.id === id);
  infoDrawer.value = true;
};

const openAddChildDrawer = (id) => {
  selectedPerson.value = people.find((person) => person.id === id);
  addChildDrawer.value = true;
};

const addChild = () => {
  const newId = `person-${Date.now()}`;
  const newPerson = {
    ...newChild.value,
    id: newId,
    parentId: selectedPerson.value.id,
    hasChildren: false,
    photo: newChild.value.photo || '',
    isChildrenVisible: true,
  };

  people.push(newPerson);
  visiblePeople.value.push(newId);

  newChild.value = {
    name: '',
    jobTitle: '',
    photo: '',
  };
  addChildDrawer.value = false;
};

const updateInfo = () => {
  isEditing.value = false;
  if (selectedPerson.value) {
    const person = people.find(
      (person) => person.id === selectedPerson.value.id
    );
    if (person) {
      person.name = selectedPerson.value.name;
      person.jobTitle = selectedPerson.value.jobTitle;
      person.photo = selectedPerson.value.photo;
    }
  }
  infoDrawer.value = false;
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
    container.addEventListener('wheel', handleWheelZoom, { passive: false });
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
  if (zoomLevel.value < 1.1) {
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
  for (let level = 0; level <= getLevel(); level++) {
    const levelNodes = sortedPeople.value.filter(
      (p) => getLevel(p.id) === level
    );
    const totalWidth =
      levelNodes.length * nodeWidth + (levelNodes.length - 1) * spacing;
    levelWidths.push(totalWidth);
  }

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

  const walkX = (x - startX.value) * -1;
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
  height: 0;
}

.connections {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.q-col {
  text-align: center;
}

.person-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.selected-person-photo {
  margin-bottom: 16px;
}
.selected-person-image {
  font-size: 80px;
  color: #bbb;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100%;
  background-color: #f0f0f0;
  margin-bottom: 16px;
}

.photo-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
}

.person-details {
  text-align: center;
  margin-bottom: 16px;
}

.person-name {
  font-size: 18px;
  font-weight: bold;
}

.person-job {
  font-size: 14px;
  color: gray;
}

.add-child-form {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.child-photo {
  margin-bottom: 16px;
}
.default-photo-icon {
  font-size: 80px;
  color: #bbb;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100%;
  background-color: #f0f0f0;
  margin-bottom: 16px;
}

.q-btn {
  margin-top: 16px;
}
</style>
