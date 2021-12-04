export type PinDirection = "Input" | "Output";

const PinTypes = [
  "Exec",
  "Boolean",
  "Byte",
  "Class",
  "SoftClass",
  "Int",
  "Int64",
  "Float",
  "Double",
  "Name",
  "Vector",
  "Rotator",
  "Transform",
  "Delegate",
  "MCDelegate",
  "Object",
  "Interface",
  "SoftObject",
  "String",
  "Text",
  "Struct",
  "Wildcard",
  "Enum",
  "FieldPath",
] as const;

export type PinType = typeof PinTypes[number];

const pathToImg = (path: string) => {
  const img = new Image();
  img.src = path;
  return img;
};

export type PinCategory = "Delegate" | "Value" | "Exec";
export const PinIcons = new Map<PinCategory, PinIcon>([
  [
    "Delegate",
    {
      connected: pathToImg(require("../../assets/Pin_connected_VarA.png")),
      disconnected: pathToImg(
        require("../../assets/Pin_disconnected_VarA.png")
      ),
    },
  ],
  [
    "Value",
    {
      connected: pathToImg(require("../../assets/Pin_connected_VarA.png")),
      disconnected: pathToImg(
        require("../../assets/Pin_disconnected_VarA.png")
      ),
    },
  ],
  [
    "Exec",
    {
      connected: pathToImg(require("../../assets/ExecPin_Connected.png")),
      disconnected: pathToImg(require("../../assets/ExecPin_Disconnected.png")),
    },
  ],
]);

export interface PinIcon {
  connected: HTMLImageElement;
  disconnected: HTMLImageElement;
}

export interface PinStyle {
  category: PinCategory;
  color: string;
}

export const PinStyles = new Map<PinType, PinStyle>([
  ["Exec", { category: "Exec", color: "white" }],
  ["Boolean", { category: "Value", color: "rgba(76.5, 0.0, 0.0, 255.0)" }],
  [
    "Byte",
    {
      category: "Value",
      color: "rgba(0.0, 40.800000000000004, 33.47385, 255.0)",
    },
  ],
  ["Class", { category: "Value", color: "rgba(25.5, 0.0, 127.5, 255.0)" }],
  [
    "Int",
    { category: "Value", color: "rgba(3.461625, 196.35, 109.550295, 255.0)" },
  ],
  [
    "Int64",
    {
      category: "Value",
      color: "rgba(105.46162500000001, 196.35, 109.550295, 255.0)",
    },
  ],
  [
    "Float",
    {
      category: "Value",
      color: "rgba(91.205085, 255.0, 15.299999999999999, 255.0)",
    },
  ],
  [
    "Name",
    {
      category: "Value",
      color: "rgba(154.96783499999998, 57.37092, 255.0, 255.0)",
    },
  ],
  [
    "Delegate",
    {
      category: "Delegate",
      color: "rgba(255.0, 10.200000000000001, 10.200000000000001, 255.0)",
    },
  ],
  ["Object", { category: "Value", color: "rgba(0.0, 102.0, 232.05, 255.0)" }],
  [
    "SoftObject",
    { category: "Value", color: "rgba(76.5, 255.0, 255.0, 255.0)" },
  ],
  [
    "SoftClass",
    { category: "Value", color: "rgba(255.0, 76.5, 255.0, 255.0)" },
  ],
  [
    "Interface",
    { category: "Value", color: "rgba(223.992, 255.0, 102.0, 255.0)" },
  ],
  [
    "String",
    { category: "Value", color: "rgba(255.0, 0.0, 168.436935, 255.0)" },
  ],
  ["Text", { category: "Value", color: "rgba(204.0, 51.0, 102.0, 255.0)" }],
  ["Struct", { category: "Value", color: "rgba(0.0, 25.5, 153.0, 255.0)" }],
  [
    "Wildcard",
    { category: "Value", color: "rgba(56.1, 49.929, 49.929, 255.0)" },
  ],
  [
    "Vector",
    { category: "Value", color: "rgba(255.0, 150.770025, 4.21056, 255.0)" },
  ],
  [
    "Rotator",
    {
      category: "Value",
      color: "rgba(90.115215, 115.81462499999999, 255.0, 255.0)",
    },
  ],
  [
    "Transform",
    { category: "Value", color: "rgba(255.0, 44.009175, 0.0, 255.0)" },
  ],
]);

export interface Pin {
  name: string;
  direction: PinDirection;
  type: PinType;
}
