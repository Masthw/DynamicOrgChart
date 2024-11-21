<template>
  <div ref="container" class="organogram-container">
    <svg ref="svg" :width="width" :height="height">
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
          @mousedown="startDrag(node)"
          @mouseup="stopDrag"
          @mousemove="dragging(node, $event)"
          class="node"
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
import { ref } from "vue";

export default {
  setup() {
    const width = 800;
    const height = 600;

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

    const addNode = () => {
      const newNode = {
        id: nodes.value.length + 1,
        name: `Novo ${nodes.value.length + 1}`,
        x: 100 + Math.random() * 600,
        y: 400,
      };
      nodes.value.push(newNode);

      // Adiciona uma ligação com o último nó
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

    const startDrag = (node) => {
      node.isDragging = true;
    };

    const stopDrag = (node) => {
      node.isDragging = false;
    };

    const dragging = (node, event) => {
      if (node.isDragging) {
        const rect = event.target.closest("svg").getBoundingClientRect();
        node.x = event.clientX - rect.left;
        node.y = event.clientY - rect.top;

        // Atualiza os links
        links.value = links.value.map((link) => {
          if (link.source.id === node.id || link.target.id === node.id) {
            return {
              ...link,
              source: link.source,
              target: link.target,
            };
          }
          return link;
        });
      }
    };

    return {
      width,
      height,
      nodes,
      links,
      addNode,
      zoomIn,
      zoomOut,
      startDrag,
      stopDrag,
      dragging,
    };
  },
};
</script>

<style>
.organogram-container {
  position: relative;
}

.controls {
  margin-top: 10px;
}

.node {
  cursor: grab;
}
</style>
