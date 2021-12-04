import Konva from "konva";
import { createNode, NodeContentRenderer, NodeOptionsBase } from "./NodeBase";
import { Pin, PinIcons, PinStyles } from "./Pins";

export interface NodeOptions extends NodeOptionsBase {
  pins: Pin[];
}

const findExec = (pins: Pin[]) => {
  return pins.find((pin) => pin.type === "Exec");
};

const valuePin = PinIcons.get("Value").disconnected;
const valuePinImg = new Konva.Image({
  width: 15,
  height: 11,
  image: valuePin,
});
valuePinImg.filters([Konva.Filters.RGB]);

const PinContentRenderer: NodeContentRenderer = {
  render: (ctx, shape) => {
    let inPinY = shape.getAttr("headerHeight") + 10;
    const inPinX = 10;
    let outPinY = shape.getAttr("headerHeight") + 10;
    const outPinX = shape.width() - 22;
    const ph = 50;

    const pins = shape.getAttr("pins") as Array<Pin>;
    const inputPins = pins.filter((pin) => {
      return pin.direction === "Input";
    });

    const outputPins = pins.filter((pin) => {
      return pin.direction === "Output";
    });

    const pinstacks =
      inputPins.length > outputPins.length
        ? inputPins.length
        : outputPins.length;

    shape.height(ph * pinstacks);

    const inExec = findExec(inputPins);
    if (inExec !== undefined) {
      const icon = PinIcons.get("Exec");
      const img = icon.disconnected;
      const y = inPinY;
      ctx.drawImage(img, inPinX, y);
      inPinY += ph - 20;
    }

    for (const pin of inputPins) {
      if (PinStyles.get(pin.type).category === "Value") {
        // valuePinImg.cache();
        // valuePinImg.blue(255);
        // ctx.drawImage(valuePinImg.toCanvas(), 10, inPinY);
        // inPinY += ph;
      }
    }

    const outExec = findExec(outputPins);
    if (outExec !== undefined) {
      const icon = PinIcons.get("Exec");
      const img = icon.disconnected;
      const y = outPinY;
      ctx.drawImage(img, outPinX, y);
      outPinY += ph;
    }
  },
};

export const buildBasicNode = (options?: NodeOptions) => {
  const node = createNode(options, PinContentRenderer);
  node.setAttr("pins", options.pins);
  return node;
};
