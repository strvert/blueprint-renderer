import Konva from "konva";

export const createUETransformer = () => {
  return new Konva.Transformer({
    borderStroke: "#EAA500",
    borderStrokeWidth: 8,
    resizeEnabled: false,
    rotateEnabled: false,
  });
};
