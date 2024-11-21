<template>
  <div ref="container" class="organogram-container">
    <svg ref="svg" class="organogram-svg">
      <!-- Renderizamos as linhas entre os nós -->
      <g class="links">
        <line
          v-for="link in links"
          :key="link.id"
          :x1="link.source.x"
          :y1="link.source.y"
          :x2="link.target.x"
          :y2="link.target.y"
          stroke="black"
          stroke-width="2"
        />
      </g>
      <!-- Renderizamos os nós -->
      <g class="nodes">
        <g
          v-for="node in nodes"
          :key="node.id"
          class="node"
          @mousedown="startDrag(node, $event)"
        >
          <circle :cx="node.x" :cy="node.y" r="20" fill="blue" />
          <text :x="node.x" :y="node.y + 35" text-anchor="middle" fill="black">
            {{ node.name }}
          </text>
        </g>
      </g>
    </svg>
    <div class="controls">
      <button @click="addNode">Adicionar</button>
      <button @click="zoomIn">Zoom In</button>
      <button @click="zoomOut">Zoom Out</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  setup() {
    const width = ref(window.innerWidth);
    const height = ref(window.innerHeight);

    const nodes = ref([
      { id: 1, name: "Dono", x: 400, y: 50 },
      { id: 2, name: "Chefe 1", x: 300, y: 150 },
      { id: 3, name: "Chefe 2", x: 500, y: 150 },
      { id: 4, name: "Funcionário 1", x: 250, y: 250 },
      { id: 5, name: "Funcionário 2", x: 350, y: 250 },
    ]);

    const links = ref([
      { id: "1-2", source: nodes.value[0], target: nodes.value[1] },
      { id: "1-3", source: nodes.value[0], target: nodes.value[2] },
      { id: "2-4", source: nodes.value[1], target: nodes.value[3] },
      { id: "2-5", source: nodes.value[1], target: nodes.value[4] },
    ]);

    const zoomLevel = ref(1);
    const draggingNode = ref(null);

    const addNode = () => {
      const newNode = {
        id: nodes.value.length + 1,
        name: `Novo ${nodes.value.length + 1}`,
        x: Math.random() * width.value,
        y: Math.random() * height.value,
      };
      nodes.value.push(newNode);

      links.value.push({
        id: `${newNode.id}-${nodes.value.length}`,
        source: nodes.value[0], // Liga ao "dono" por padrão
        target: newNode,
      });
    };

    const zoomIn = () => {
      zoomLevel.value += 0.1;
    };

    const zoomOut = () => {
      zoomLevel.value = Math.max(0.1, zoomLevel.value - 0.1);
    };

    const startDrag = (node, event) => {
      draggingNode.value = node;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", stopDrag);
    };

    const stopDrag = () => {
      draggingNode.value = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopDrag);
    };

    const onMouseMove = (event) => {
      if (draggingNode.value) {
        const rect = document.querySelector(".organogram-svg").getBoundingClientRect();
        draggingNode.value.x = event.clientX - rect.left;
        draggingNode.value.y = event.clientY - rect.top;
      }
    };

    // Remove event listeners ao desmontar
    onUnmounted(() => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopDrag);
    });

    return {
      width,
      height,
      nodes,
      links,
      addNode,
      zoomIn,
      zoomOut,
      startDrag,
    };
  },
};
</script>

<style>
.organogram-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* Remove barras de rolagem */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

.organogram-svg {
  width: 100vw;
  height: 100vh;
}

.controls {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 10px;
}

.node {
  cursor: grab;
}
</style>
