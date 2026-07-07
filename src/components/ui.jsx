import { C } from "../theme.js";

export const Card = ({ children, style }) => (
  <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 16, ...style }}>
    {children}
  </div>
);

export const Eyebrow = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: C.sub, marginBottom: 8 }}>
    {children}
  </div>
);

export const Check = ({ done, onClick }) => (
  <button onClick={onClick} aria-label={done ? "Mark incomplete" : "Mark complete"} style={{
    width: 22, height: 22, minWidth: 22, borderRadius: 7, cursor: "pointer",
    border: `2px solid ${done ? C.green : C.line}`, background: done ? C.green : "transparent",
    color: "#fff", fontSize: 13, fontWeight: 900, lineHeight: 1,
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>{done ? "✓" : ""}</button>
);

export const XBtn = ({ onClick, label = "Delete" }) => (
  <button onClick={onClick} aria-label={label}
    style={{ border: "none", background: "none", color: C.sub, cursor: "pointer", fontSize: 16, padding: "0 4px" }}>×</button>
);
