import Konva from "konva";
import loadImages from "image-promise";
import parse from "parse-css-color";
import { createNode, NodeContentRenderer, NodeOptionsBase } from "./NodeBase";
import { Pin, PinIcons, PinStyles, PinStyle } from "./Pins";

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

const reqImages = [
  PinIcons.get("Value").disconnected,
  PinIcons.get("Value").connected,
  PinIcons.get("Exec").disconnected,
  PinIcons.get("Exec").connected,
  PinIcons.get("Delegate").disconnected,
  PinIcons.get("Delegate").connected,
];
const vPin = new Konva.Image({ image: PinIcons.get("Value").disconnected });
const ePin = new Konva.Image({ image: PinIcons.get("Exec").disconnected });
vPin.cache();
ePin.cache();
const pinImgCaches = new Map<PinStyle, Konva.Image>();
const makeGraphPin = (style: PinStyle) => {
  // if (pinImgCaches.has(style)) {
  //   return pinImgCaches.get(style).clone();
  // }

  const p = (() => {
    switch (style.category) {
      case "Value":
        return vPin.clone() as Konva.Image;
      case "Exec":
        return ePin.clone() as Konva.Image;
      case "Delegate":
        return null;
    }
  })();

  p.cache();
  p.filters([Konva.Filters.RGB, Konva.Filters.Brighten]);
  const c = parse(style.color);
  p.red(c.values[0] + 10);
  p.green(c.values[1] + 10);
  p.blue(c.values[2] + 10);
  p.cache();
  // pinImgCaches.set(style, p);

  return p;
};

export const buildBasicNode = (options?: NodeOptions) => {
  const node = createNode(options);

  const container = new Konva.Group({
    x: node.x(),
    y: node.y(),
    draggable: true,
    width: node.width(),
    height: node.height(),
  });
  node.zIndex(0);
  container.className = "BPNode";
  node.position({ x: 0, y: 0 });
  container.add(node);

  const nodeTitle = new Konva.Text({
    x: 26,
    y: 7.5,
    text: options.nodeTitle ? options.nodeTitle : "Unknown",
    fontSize: 12,
    fontStyle: "bold",
    fontFamily: "san-serif",
    fill: "#EEEEEE",
  });
  nodeTitle.zIndex(10);
  container.add(nodeTitle);

  const headerH = node.getAttr("headerHeight") as number;

  const iPins = options.pins.filter((pin) => pin.direction === "Input");
  const iExecs = iPins.filter((pin) => pin.type === "Exec");
  const iValues = iPins.filter(
    (pin) => PinStyles.get(pin.type).category === "Value"
  );
  const oPins = options.pins.filter((pin) => pin.direction === "Output");
  const oValues = oPins.filter(
    (pin) => PinStyles.get(pin.type).category === "Value"
  );
  const oExecs = oPins.filter((pin) => pin.type === "Exec");

  const iPinMarginLeft = 10;
  const execPinHeight = 35;
  const pinName = new Konva.Text({
    fontSize: 11.5,
    fontFamily: "san-serif",
    fill: "#EEEEEE",
  });

  loadImages(reqImages).then(() => {
    const makePinText = (text: Konva.Text, pin: Pin, offset: number) => {
      return text
        .text(pin.name)
        .x(iPinMarginLeft + offset)
        .y(iOff - 1);
    };

    const iMaxWidth = Math.max(
      ...iValues.map((pin) => pinName.measureSize(pin.name).width)
    );
    const oMaxWidth =
      Math.max(...oValues.map((pin) => pinName.measureSize(pin.name).width)) *
      2;
    const pinMaxWidth =
      iMaxWidth + oMaxWidth + iPinMarginLeft + vPin.width() + ePin.width();
    const titleWidth = nodeTitle.measureSize(options.nodeTitle).width + 62;
    const nodeWidth = pinMaxWidth > titleWidth ? pinMaxWidth : titleWidth;

    node.width(nodeWidth);

    let iOff = 1;
    for (const pin of iExecs) {
      const pinImg = makeGraphPin(PinStyles.get(pin.type));
      container.add(pinImg);
      pinImg.x(iPinMarginLeft);
      pinImg.y(headerH + 10 + iOff);
      iOff += execPinHeight;
    }

    for (const pin of iValues) {
      const pinImg = makeGraphPin(PinStyles.get(pin.type));
      container.add(pinImg);
      pinImg.x(iPinMarginLeft);
      pinImg.y((iOff += 30));
      container.add(
        makePinText(pinName.clone(), pin, pinImg.width() + 20).y(iOff)
      );
    }

    let oOff = 0;
    for (const pin of oExecs) {
      const pinImg = makeGraphPin(PinStyles.get(pin.type));
      container.add(pinImg);
      pinImg.x(node.width() - 20);
      pinImg.y(headerH + 10 + oOff);
      oOff += execPinHeight;
    }

    for (const pin of oValues) {
      const pinImg = makeGraphPin(PinStyles.get(pin.type));
      container.add(pinImg);
      pinImg.x(node.width() - 20);
      pinImg.y((oOff += 30));
      const text = pinName.clone().align("right");
      container.add(
        makePinText(text, pin, node.width() - text.measureSize().width * 2).y(
          oOff
        )
      );
    }

    const bottomMargin = 20;
    node.height(oOff > iOff ? oOff + bottomMargin : iOff + bottomMargin);
  });

  return container;
};
