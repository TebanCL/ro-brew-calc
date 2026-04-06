import type { CSSProperties } from "react";

export const RO = {
  // Window panels — cool blue-gray
  panelBg:   "#b8c8dc",   // main window body
  panelAlt:  "#9aaabf",   // secondary / darker areas

  // Title bar — medium blue gradient (solid mid)
  titleBg:   "#4070b8",
  titleText: "#ffffff",

  // 3-D bevel edges
  hilight:   "#dff0ff",   // top-left light edge
  shadow:    "#304870",   // bottom-right dark edge

  // Text
  text:      "#080c18",
  textMid:   "#202840",
  textMuted: "#5070a0",

  // Inputs — almost-white, light blue tint
  inputBg:   "#eaf2fc",
  inputText: "#101828",

  // Table rows
  row1:      "#c8d8ec",
  row2:      "#aabace",
  rowBorder: "#7898b8",

  // Functional status colors
  profit:    "#005010",
  loss:      "#780010",
  rateGood:  "#007020",
  rateMed:   "#806000",
  rateBad:   "#801020",
  cost:      "#780010",
  ingColor:  "#304870",

  // MiniBar chart colors
  barPess:   "#902020",
  barAvg:    "#887010",
  barOpt:    "#087020",
  barTrack:  "#182030",
} as const;

export const raised: CSSProperties = {
  borderTop:    `2px solid #dff0ff`,
  borderLeft:   `2px solid #dff0ff`,
  borderBottom: `2px solid #304870`,
  borderRight:  `2px solid #304870`,
};

export const sunken: CSSProperties = {
  borderTop:    `2px solid #304870`,
  borderLeft:   `2px solid #304870`,
  borderBottom: `2px solid #dff0ff`,
  borderRight:  `2px solid #dff0ff`,
};

export const thS: CSSProperties = { padding: "4px 6px", textAlign: "left", background: "#4070b8", color: "#ffffff", borderBottom: "2px solid #304870", borderRight: "1px solid #304870", fontSize: 11, whiteSpace: "nowrap", fontWeight: 700 };
export const tdS: CSSProperties = { padding: "4px 6px", verticalAlign: "middle" };
