import Konva from "konva";
import { ShapeConfig } from "konva/cmj/Shape";
import parse from "parse-css-color";

const pathRoundRect = (
  ctx: Konva.Context,
  left: number,
  top: number,
  width: number,
  height: number,
  rounds: { lt: number; rt: number; rb: number; lb: number }
) => {
  const l = left;
  const t = top;
  const r = left + width;
  const b = t + height;
  ctx.beginPath();
  ctx.moveTo(l + rounds.lt, t);
  ctx.arcTo(r, t, r, b - rounds.rb, rounds.rt);
  ctx.arcTo(r, b, l + rounds.lb, b, rounds.rb);
  ctx.arcTo(l, b, l, t + rounds.lt, rounds.lb);
  ctx.arcTo(l, t, r, t, rounds.lt);
};

export interface NodeContentRenderer {
  render: (ctx: Konva.Context, shape: Konva.Shape) => void;
}

export interface NodeOptionsBase {
  x: number;
  y: number;
  width?: number;
  height?: number;
  nodeColor?: string;
  nodeTitle?: string;
}

const createNode = (
  options: NodeOptionsBase,
  contentRenderer?: NodeContentRenderer
) => {
  const defaultOptions: NodeOptions = {
    nodeColor: "rgb(31, 149, 255)",
    nodeTitle: "unknown",
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  };
  const opts = { ...defaultOptions, ...options };
  const nodeHeaderHeight = 27;
  const nodeOpacity = 0.95;

  const renderBase = (ctx: Konva.Context, shape: Konva.Shape) => {
    const width = shape.width();
    const height = shape.height();
    const headerH = shape.getAttr("headerHeight");
    const inColor = parse(opts.nodeColor);
    const headColor = `rgba(${inColor.values[0]}, ${inColor.values[1]}, ${inColor.values[2]}, ${nodeOpacity})`;
    const baseColor = `rgba(17, 17, 17, ${nodeOpacity})`;

    // Head
    ctx.save();
    const g = ctx.createLinearGradient(0, -headerH * 2, width, headerH * 2);
    g.addColorStop(0, headColor);
    g.addColorStop(0.7, headColor);
    g.addColorStop(1, baseColor);

    ctx.fillStyle = g;
    pathRoundRect(ctx, 0, 0, width, headerH, {
      lt: 10,
      rt: 10,
      rb: 0,
      lb: 0,
    });
    ctx.fill();
    ctx.restore();

    // Body
    ctx.save();
    ctx.fillStyle = baseColor;
    pathRoundRect(ctx, 0, headerH, width, height - headerH, {
      lt: 0,
      rt: 0,
      rb: 10,
      lb: 10,
    });
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "#030303";
    ctx.lineWidth = 2;
    pathRoundRect(ctx, 0, 0, width, height, {
      lt: 10,
      rt: 10,
      rb: 10,
      lb: 10,
    });
    ctx.stroke();
    ctx.restore();
  };

  const renderContent = (ctx: Konva.Context, shape: Konva.Shape) => {
    const renderer = shape.getAttr("contentRenderer");
    if (renderer) {
      renderer.render(ctx, shape);
    }
  };

  const node = new Konva.Shape({
    x: opts.x,
    y: opts.y,
    width: opts.width,
    height: opts.height,
    draggable: true,

    sceneFunc: function (ctx, shape) {
      ctx.save();

      const nodeTitle = shape.getAttr("nodeTitle");
      const titlePosX = 26;
      ctx.font = "bold 12px san-serif";
      ctx.textAlign = "left";
      const mt = ctx.measureText(nodeTitle);
      this.width(titlePosX + mt.width + 32);
      // this.set({ width: titlePosX + mt.width + 32 });

      renderBase(ctx, this);
      renderContent(ctx, this);

      ctx.fillStyle = "#fefefe";
      ctx.fillText(nodeTitle, titlePosX, 18);

      ctx.restore();

      ctx.fillStrokeShape(shape);
    },
    getSelfRect: function () {
      return {
        x: this.x(),
        y: this.y(),
        width: this.width(),
        height: this.height(),
      };
    },
  });
  node.setAttr("nodeTitle", opts.nodeTitle);
  node.setAttr("contentRenderer", contentRenderer);
  node.setAttr("headerHeight", nodeHeaderHeight);
  node.className = "BPNode";
  node.on("mouseover", () => {
    document.body.style.cursor = "move";
  });
  node.on("mousemove", () => {
    document.body.style.cursor = "move";
  });
  node.on("mouseout", () => {
    document.body.style.cursor = "default";
  });
  return node;
};

export { createNode };
