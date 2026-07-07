import { useState } from "react";
import { C, DISPLAY, inputStyle, addBtn, ghostInput } from "../theme.js";
import { Card, Eyebrow, XBtn } from "../components/ui.jsx";
import { uid } from "../utils/dates.js";

const STATUSES = ["Active", "Planning", "Paused", "Shipped"];
const statusColor = { Active: C.green, Planning: C.amber, Paused: C.sub, Shipped: C.cobalt };

export default function Projects({ state, update }) {
  const [name, setName] = useState("");
  const addProject = () => {
    if (!name.trim()) return;
    update((s) => { s.projects.unshift({ id: uid(), name: name.trim(), detail: "", status: "Planning", next: "" }); return s; });
    setName("");
  };
  return (
    <>
      <Card>
        <Eyebrow>New project</Eyebrow>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addProject()}
            placeholder="Project name…" style={{ ...inputStyle, flex: 1 }} />
          <button onClick={addProject} style={addBtn}>Add</button>
        </div>
      </Card>

      {state.projects.map((p) => (
        <Card key={p.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <input value={p.name}
              onChange={(e) => update((s) => { s.projects.find((y) => y.id === p.id).name = e.target.value; return s; })}
              style={{ ...ghostInput, fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, flex: 1 }} />
            <button onClick={() => update((s) => { const x = s.projects.find((y) => y.id === p.id); x.status = STATUSES[(STATUSES.indexOf(x.status) + 1) % STATUSES.length]; return s; })}
              style={{ border: "none", borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 800, cursor: "pointer", background: `${statusColor[p.status]}18`, color: statusColor[p.status], whiteSpace: "nowrap" }}>
              {p.status}
            </button>
            <XBtn label="Delete project" onClick={() => update((s) => { s.projects = s.projects.filter((y) => y.id !== p.id); return s; })} />
          </div>
          <input value={p.detail} placeholder="Description…"
            onChange={(e) => update((s) => { s.projects.find((y) => y.id === p.id).detail = e.target.value; return s; })}
            style={{ ...ghostInput, fontSize: 12, color: C.sub, margin: "4px 0 10px" }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.1em", color: C.sub }}>NEXT</span>
            <input value={p.next} placeholder="Next action…"
              onChange={(e) => update((s) => { s.projects.find((y) => y.id === p.id).next = e.target.value; return s; })}
              style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 10px", fontSize: 13, background: C.paper }} />
          </div>
        </Card>
      ))}
    </>
  );
}
