// import { Graph, createNode, buildBasicNode } from "./index";
import { buildBasicNode, Graph } from "./../dist/index";

window.addEventListener("DOMContentLoaded", () => fitCanvas());
window.addEventListener("resize", () => fitCanvas());

const node1 = buildBasicNode({
  x: 0,
  y: 0,
  nodeTitle: "Spawn Emitter at Location",
  pins: [
    { name: "Exec", direction: "Input", type: "Exec" },
    { name: "Exec", direction: "Output", type: "Exec" },
    { name: "World Context Object", direction: "Input", type: "Object" },
    { name: "Emitter Template", direction: "Input", type: "Object" },
    { name: "Location", direction: "Input", type: "Vector" },
    { name: "Rotation", direction: "Input", type: "Rotator" },
    { name: "Scale", direction: "Input", type: "Vector" },
    { name: "Auto Destroy", direction: "Input", type: "Boolean" },
    { name: "Return Value", direction: "Output", type: "Object" },
  ],
});
const node2 = buildBasicNode({
  x: 200,
  y: 600,
  nodeTitle: "Spawn Force Feedback at Location",
  pins: [
    { name: "Exec", direction: "Input", type: "Exec" },
    { name: "Exec", direction: "Output", type: "Exec" },
    { name: "Force Feedback Effect", direction: "Input", type: "Object" },
    { name: "Location", direction: "Input", type: "Vector" },
    { name: "Return Value", direction: "Output", type: "Object" },
  ],
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
