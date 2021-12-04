import Konva from "konva";
import { createUETransformer } from "./UETransformer";
import { createGrid } from "./Grid";

interface Point {
  x: number;
  y: number;
}
interface PanInfo {
  panning: boolean;
  startPoint: Point;
  prevPoint: Point;
  startLookPoint: Point;
}

export class Graph {
  public stage: Konva.Stage;
  private nodeLayer: Konva.Layer;
  private grid: Konva.Shape;
  private transformer: Konva.Transformer;
  private panInfo: PanInfo;
  private looking: { x: number; y: number };
  private scale: number;

  constructor(elementId: string) {
    this.looking = { x: 0, y: 0 };
    this.panInfo = {
      panning: false,
      startPoint: { x: 0, y: 0 },
      prevPoint: { x: 0, y: 0 },
      startLookPoint: { x: 0, y: 0 },
    };
    this.scale = 1;

    this.stage = new Konva.Stage({
      container: elementId,
    });
    this.nodeLayer = new Konva.Layer({});
    this.stage.add(this.nodeLayer);

    this.grid = createGrid({ x: 0, y: 0 });
    this.grid.setAttr("looking", this.looking);
    this.nodeLayer.add(this.grid);
    this.grid.moveToBottom();

    this.transformer = createUETransformer();
    this.nodeLayer.add(this.transformer);

    const initStage = () => {
      const elm = document.getElementById(elementId) as HTMLDivElement;
      elm.style.backgroundColor = "#272726";
      elm.addEventListener("contextmenu", (e) => e.preventDefault());
      this.grid.width(this.stage.width());
      this.grid.height(this.stage.height());
    };
    if (document.readyState === "complete") {
      initStage();
    } else {
      window.addEventListener("DOMContentLoaded", () => initStage());
    }

    window.addEventListener("resize", () => {
      this.grid.width(this.stage.width());
      this.grid.height(this.stage.height());
    });

    this.initEvents();
  }

  private initEvents() {
    this.initNodeSelectEvent();
    this.initGraphDragEvent();
    this.initZoomEvent();
  }

  private initNodeSelectEvent() {
    this.stage.on("mousedown touchstart", (e) => {
      if (e.evt.button === 0) {
        if (e.target.className === "BPNode") {
          this.transformer.nodes([e.target]);
          // this.transformer.moveToTop();
          // e.target.moveToTop();
          return;
        }
        this.transformer.nodes([]);
      }
    });
  }
  private initGraphDragEvent() {
    const mouseButton = 2;
    this.stage.on("mousedown touchstart", (e) => {
      if (e.evt.button === mouseButton) {
        this.panInfo.panning = true;
        this.panInfo.startPoint = this.stage.getPointerPosition();
        this.panInfo.prevPoint = this.panInfo.startPoint;
        this.panInfo.startLookPoint = this.looking;
      }
    });
    this.stage.on("mousemove touchmove", (_e) => {
      if (this.panInfo.panning) {
        document.body.style.cursor = "grabbing";
        const currPoint = this.stage.getPointerPosition();
        const dx = currPoint.x - this.panInfo.prevPoint.x;
        const dy = currPoint.y - this.panInfo.prevPoint.y;

        this.setLookPoint({
          x: this.looking.x + dx,
          y: this.looking.y + dy,
        });
        this.panInfo.prevPoint = currPoint;
      }
    });
    this.stage.on("mouseup touchend", (e) => {
      if (e.evt.button === mouseButton) {
        document.body.style.cursor = "default";
        this.panInfo.panning = false;
      }
    });
  }
  private initZoomEvent() {
    this.stage.on("wheel", (e) => {
      const d = e.evt.deltaY;
      const zoom = this.scale * 0.999 ** d;
      this.toZoom(
        this.stage.getPointerPosition(),
        zoom >= 2 ? 2 : zoom <= 0.3 ? 0.3 : zoom
      );
    });
  }

  setLookPoint(point: Point) {
    const gl = this.grid.getAttr("looking");
    this.grid.setAttr("looking", {
      x: gl.x + (point.x - this.looking.x) / this.scale,
      y: gl.y + (point.y - this.looking.y) / this.scale,
    });
    for (const node of this.nodeLayer.getChildren()) {
      if (node.className === "BPNode") {
        node.x(node.x() + point.x - this.looking.x);
        node.y(node.y() + point.y - this.looking.y);
      }
    }
    this.looking = point;
  }

  addNode(node: Konva.Shape) {
    this.nodeLayer.add(node);
  }

  toZoom(point: Point, scale: number) {
    const offset = {
      x: (scale / this.scale - 1) * point.x,
      y: (scale / this.scale - 1) * point.y,
    };
    this.setLookPoint({
      x: this.looking.x - offset.x,
      y: this.looking.y - offset.y,
    });
    this.setScale(scale);
  }

  setScale(scale: number) {
    this.grid.setAttr("drawScale", scale);
    for (const node of this.nodeLayer.getChildren()) {
      if (node.className === "BPNode") {
        node.x(node.x() * (scale / this.scale));
        node.y(node.y() * (scale / this.scale));
        node.scale({ x: scale, y: scale });
      }
    }
    this.scale = scale;
  }
}
