import Konva from "konva";
import { ShapeConfig } from "konva/cmj/Shape";

interface GridOptions extends ShapeConfig {
  span?: number; // 16
  gridRegularColor?: string; // "#363636";
  gridRulerColor?: string; // "#020202";
  backgroundColor?: string; // "#272726";
  drawScale?: number;
  looking?: { x: number; y: number };
}

const createGrid = (options?: GridOptions) => {
  const defaults: GridOptions = {
    span: 16,
    gridRegularColor: "#363636",
    gridRulerColor: "#020202",
    backgroundColor: "#272726",
    drawScale: 1,
    looking: { x: 0, y: 0 },
  };

  const drawLine = (
    ctx: Konva.Context,
    _shape: Konva.Shape,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    width: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  const drawGrid = (ctx: Konva.Context, shape: Konva.Shape) => {
    const regSpan = 8;
    const drawScale = shape.getAttr("drawScale");
    const span = shape.getAttr("span");
    const scaledSpan = span * drawScale;
    const looking = shape.getAttr("looking");
    const calcOffset = (p: number) => {
      if (p < 0) {
        return (span * regSpan + (p % (span * regSpan))) * drawScale;
      } else {
        return (p % (span * regSpan)) * drawScale;
      }
    };
    const offset = {
      x: calcOffset(looking.x),
      y: calcOffset(looking.y),
    };

    for (
      let x = Math.floor(-offset.x);
      x <= Math.floor((shape.width() - offset.x) / scaledSpan);
      x += 1
    ) {
      drawLine(
        ctx,
        shape,
        x * scaledSpan + offset.x,
        0,
        x * scaledSpan + offset.x,
        shape.height(),
        x % regSpan === 0
          ? shape.getAttr("gridRulerColor")
          : shape.getAttr("gridRegularColor"),
        drawScale
      );
    }
    for (
      let y = Math.floor(-offset.y);
      y <= Math.floor((shape.height() - offset.y) / scaledSpan);
      y += 1
    ) {
      drawLine(
        ctx,
        shape,
        0,
        y * scaledSpan + offset.y,
        shape.width(),
        y * scaledSpan + offset.y,
        y % regSpan === 0
          ? shape.getAttr("gridRulerColor")
          : shape.getAttr("gridRegularColor"),
        drawScale
      );
    }
  };

  const config = { ...defaults, ...options };
  const grid = new Konva.Shape({
    sceneFunc: function (ctx, shape) {
      ctx.save();
      drawGrid(ctx, shape);
      ctx.fillStrokeShape(shape);
      ctx.restore();
    },
  });

  grid.setAttr("drawScale", config.drawScale);
  grid.setAttr("span", config.span);
  grid.setAttr("backgroundColor", config.backgroundColor);
  grid.setAttr("gridRulerColor", config.gridRulerColor);
  grid.setAttr("gridRegularColor", config.gridRegularColor);
  grid.setAttr("looking", config.looking);

  grid.className = "BPGrid";
  return grid;
};

export { createGrid };
