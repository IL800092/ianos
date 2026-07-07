// Design tokens — single source of truth for the look.
// "Training log meets mission control": cool paper, navy ink,
// cobalt for actions, red reserved for urgency (<30 days).
export const C = {
  paper: "#F2F4F0",
  card: "#FFFFFF",
  ink: "#101B2D",
  inkSoft: "#1A2A44",
  sub: "#5A6472",
  subOnInk: "#8FA0B8",
  line: "#DDE1DA",
  cobalt: "#2B59F0",
  cobaltSoft: "#E7EDFE",
  red: "#D92D20",
  redSoft: "#FDECEA",
  green: "#1E7A4E",
  greenSoft: "#E5F3EC",
  amber: "#B45309",
  amberSoft: "#FCF1E2",
};

export const DISPLAY = "'Archivo Expanded', Archivo, system-ui, sans-serif";
export const BODY = "Archivo, system-ui, sans-serif";

export const inputStyle = {
  border: `1px solid ${C.line}`,
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 14,
  background: C.paper,
};
export const addBtn = {
  background: C.cobalt,
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "0 16px",
  fontWeight: 800,
  cursor: "pointer",
};
export const ghostInput = {
  border: "none",
  background: "transparent",
  fontFamily: "inherit",
  color: C.ink,
  width: "100%",
  padding: 0,
};
export const navBtn = {
  border: `1px solid ${C.line}`,
  background: C.paper,
  borderRadius: 10,
  width: 36,
  height: 36,
  fontSize: 18,
  cursor: "pointer",
  color: C.ink,
};
