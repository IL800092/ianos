import { useState } from "react";
import { C, DISPLAY, inputStyle, addBtn, ghostInput } from "../theme.js";
import { Card, Check, XBtn } from "../components/ui.jsx";
import { uid } from "../utils/dates.js";

export default function Uni({ state, update }) {
  const [drafts, setDrafts] = useState({ uk: "", na: "" });
  const lanes = [
    { key: "uk", title: "UK Medicine", sub: "UCAT summer '26 · UCAS by Oct 15, 2026", color: C.red },
    { key: "na", title: "NA Mechatronics", sub: "Canada domestic + US international", color: C.cobalt },
  ];
  return (
    <>
      {lanes.map((lane) => {
        const items = state.uni[lane.key];
        const pct = items.length ? Math.round((items.filter((i) => i.done).length / items.length) * 100) : 0;
        const add = () => {
          const text = drafts[lane.key].trim();
          if (!text) return;
          update((s) => { s.uni[lane.key].push({ id: uid(), text, done: false }); return s; });
          setDrafts((d) => ({ ...d, [lane.key]: "" }));
        };
        return (
          <Card key={lane.key}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 18 }}>{lane.title}</div>
              <div style={{ fontWeight: 800, fontSize: 13, color: lane.color }}>{pct}%</div>
            </div>
            <div style={{ fontSize: 12, color: C.sub, margin: "2px 0 10px" }}>{lane.sub}</div>
            <div style={{ height: 6, background: C.paper, borderRadius: 3, marginBottom: 14 }}>
              <div style={{ height: 6, width: `${pct}%`, background: lane.color, borderRadius: 3, transition: "width .3s" }} />
            </div>
            <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
              {items.map((i) => (
                <div key={i.id} style={{ display: "flex", gap: 10, alignItems: "center", opacity: i.done ? 0.5 : 1 }}>
                  <Check done={i.done} onClick={() => update((s) => { const x = s.uni[lane.key].find((y) => y.id === i.id); x.done = !x.done; return s; })} />
                  <input value={i.text}
                    onChange={(e) => update((s) => { s.uni[lane.key].find((y) => y.id === i.id).text = e.target.value; return s; })}
                    style={{ ...ghostInput, flex: 1, fontSize: 14, fontWeight: 600, textDecoration: i.done ? "line-through" : "none" }} />
                  <XBtn onClick={() => update((s) => { s.uni[lane.key] = s.uni[lane.key].filter((y) => y.id !== i.id); return s; })} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={drafts[lane.key]} onChange={(e) => setDrafts((d) => ({ ...d, [lane.key]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Add step…" style={{ ...inputStyle, flex: 1 }} />
              <button onClick={add} style={addBtn}>Add</button>
            </div>
          </Card>
        );
      })}
    </>
  );
}
