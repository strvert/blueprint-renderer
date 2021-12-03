import { Graph, createNode } from './index';

window.addEventListener("DOMContentLoaded", () => fitCanvas());
window.addEventListener("resize", () => fitCanvas());

const node1 = createNode({ x: 0, y: 0, nodeTitle: "Awesome" });
const node2 = createNode({
  x: 200,
  y: 600,
  nodeColor: "#FF0000",
  nodeTitle: "Awesome Event",
});

const graph = new Graph("graph");
graph.addNode(node1);
graph.addNode(node2);

const fitCanvas = () => {
  const canvasWrapper = document.querySelector(
    ".canvas-wrapper"
  ) as HTMLDivElement;

  graph.stage.width(canvasWrapper.clientWidth);
  graph.stage.height(canvasWrapper.clientHeight);
};

