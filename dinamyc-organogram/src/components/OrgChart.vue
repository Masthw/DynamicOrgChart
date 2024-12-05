<template>
  <div>
    <button v-if="!dragEnabled" @click="enableDrag">Organize</button>
    <div id="dragActions" v-if="dragEnabled">
      <button @click="disableDrag">Done</button>
      <button :disabled="undoActions.length === 0" @click="undo">Undo</button>
      <button :disabled="redoActions.length === 0" @click="redo">Redo</button>
      <button @click="cancelDrag">Cancel</button>
    </div>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';

export default {
  name: 'OrgChart',
  data() {
    return {
      chart: null,
      dragNode: null,
      dropNode: null,
      dragEnabled: false,
      undoActions: [],
      redoActions: [],
      dragStartX: 0,
      dragStartY: 0,
      isDragStarting: false,
    };
  },
  mounted() {
    this.loadChartData();
  },
  methods: {
    loadChartData() {
      d3.csv(
        'https://raw.githubusercontent.com/bumbeishvili/sample-data/main/data-oracle.csv'
      ).then((data) => {
        console.log('dados carregados: ', data);
        this.chart = new OrgChart()
          .nodeHeight(() => 110)
          .nodeWidth(() => 222)
          .childrenMargin(() => 50)
          .compactMarginBetween(() => 35)
          .compactMarginPair(() => 30)
          .neighbourMargin(() => 20)
          .nodeContent(this.generateContent)

          .container(this.$refs.chartContainer)
          .data(data)
          .render();
      });
    },

    onDragStart(element, dragEvent) {
      this.dragNode = dragEvent.subject;
      const width = dragEvent.subject.width;
      const half = width / 2;
      this.dragStartX = dragEvent.x - half;
      this.dragStartY = parseFloat(dragEvent.y);
      this.isDragStarting = true;

      d3.select(element).classed('dragging', true);
    },
    onDrag(element, dragEvent) {
      if (!this.dragNode) return;

      const state = this.chart.getChartState();
      const g = d3.select(element);

      if (this.isDragStarting) {
        this.isDragStarting = false;
        document
          .querySelector('.chart-container')
          .classList.add('dragging-active');
        g.raise();

        const descendants = dragEvent.subject.descendants();
        const linksToRemove = [...(descendants || []), dragEvent.subject];
        const nodesToRemove = descendants.filter(
          (x) => x.data.id !== dragEvent.subject.id
        );

        state.linksWrapper
          .selectAll('path.link')
          .data(linksToRemove, (d) => state.nodeId(d))
          .remove();

        if (nodesToRemove) {
          state.nodesWrapper
            .selectAll('g.node')
            .data(nodesToRemove, (d) => state.nodeId(d))
            .remove();
        }
      }

      this.dropNode = null;
      const cP = {
        width: dragEvent.subject.width,
        height: dragEvent.subject.height,
        left: dragEvent.x,
        right: dragEvent.x + dragEvent.subject.width,
        top: dragEvent.y,
        bottom: dragEvent.y + dragEvent.subject.height,
        midX: dragEvent.x + dragEvent.subject.width / 2,
        midY: dragEvent.y + dragEvent.subject.height / 2,
      };

      const allNodes = d3.selectAll('g.node:not(.dragging)');
      allNodes.select('rect').attr('fill', 'none');

      allNodes
        .filter(function (d2) {
          const cPInner = {
            left: d2.x,
            right: d2.x + d2.width,
            top: d2.y,
            bottom: d2.y + d2.height,
          };

          if (
            cP.midX > cPInner.left &&
            cP.midX < cPInner.right &&
            cP.midY > cPInner.top &&
            cP.midY < cPInner.bottom &&
            this.classList.contains('droppable')
          ) {
            this.dropNode = d2;
            return d2;
          }
        })
        .select('rect')
        .attr('fill', '#e4e1e1');

      this.dragStartX += parseFloat(dragEvent.dx);
      this.dragStartY += parseFloat(dragEvent.dy);
      g.attr('transform', `translate(${this.dragStartX}, ${this.dragStartY})`);
    },
    onDragEnd(element) {
      if (!this.dragNode || !this.dropNode) {
        d3.select(element).classed('dragging', false);
        document
          .querySelector('.chart-container')
          .classList.remove('dragging-active');
        return;
      }

      const action = {
        id: this.dragNode.data.id,
        parentId: this.dragNode.parent?.data.id || null,
      };

      this.undoActions.push(action);
      this.dragNode.parentId = this.dropNode.data.id;
      this.chart.render();
      this.dropNode = null;
      this.dragNode = null;

      d3.select(element).classed('dragging', false);
      document
        .querySelector('.chart-container')
        .classList.remove('dragging-active');
    },
    enableDrag() {
      this.dragEnabled = true;
    },
    disableDrag() {
      this.dragEnabled = false;
      this.undoActions = [];
      this.redoActions = [];
    },
    cancelDrag() {
      if (this.undoActions.length === 0) {
        this.disableDrag();
        return;
      }
      const data = this.chart.getChartState().data;
      this.undoActions.reverse().forEach((action) => {
        const node = data.find((x) => x.id === action.id);
        node.parentId = action.parentId;
      });
      this.disableDrag();
      this.chart.render();
    },
    undo() {
      const action = this.undoActions.pop();
      if (action) {
        const node = this.chart
          .getChartState()
          .data.find((x) => x.id === action.id);
        const currentParentId = node.parentId;
        const previousParentId = action.parentId;
        action.parentId = currentParentId;
        node.parentId = previousParentId;

        this.redoActions.push(action);
        this.chart.render();
      }
    },
    redo() {
      const action = this.redoActions.pop();
      if (action) {
        const node = this.chart
          .getChartState()
          .data.find((x) => x.id === action.id);
        const currentParentId = node.parentId;
        const previousParentId = action.parentId;
        action.parentId = currentParentId;
        node.parentId = previousParentId;

        this.undoActions.push(action);
        this.chart.render();
      }
    },
    generateContent(d) {
      return `
         <div class="person-card" style="width:${d.width}px;height:${d.height}px;">
      <div class="person-name" style="font-size:15px;color:#08011E;">${d.data.name}</div>
      <div class="person-position" style="color:#716E7B;font-size:10px;">${d.data.position}</div>
    </div>`;
    },
  },
};
</script>

<style>
.person-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin: 5px;
}

.person-name {
  font-size: 15px;
  font-weight: bold;
  color: #08011e;
}

.person-position {
  color: #716e7b;
  font-size: 12px;
}

.hide {
  display: none;
}

.chart-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.drag-enabled:not(.dragging-active) .node.draggable {
  stroke: grey;
  stroke-width: 3px;
  stroke-dasharray: 2px;
}

.drag-enabled.dragging-active .droppable {
  stroke: green;
  stroke-width: 3px;
  stroke-dasharray: 5px;
}

.node.dragging {
  stroke-dasharray: 0 !important;
  stroke-width: 0 !important;
}

.node.dragging .content-container {
  background-color: #ffffff;
}
</style>
