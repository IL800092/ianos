// The signature element: live day-counts to each milestone, styled as
// distance markers on a track. Red top border = under 30 days out.
import { useState } from "react";
import { C, DISPLAY } from "../theme.js";
import { uid, todayISO, daysUntil, fmtDate } from "../utils/dates.js";

export default function Runway({ milestones, update }) {
  const [editing, setEditing] = useState(null);
  const sorted = [...milestones]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((m) => daysUntil(m.date) >= -1);

  return (
    <div style={{ background: C.ink, borderRadius: 16, padding: "16px 0 14px", overflow: "hidden" }}>
      <div style={{ padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: C.subOnInk }}>The runway</div>
        <button
          onClick={() => update((s) => { s.milestones.push({ id: uid(), label: "New milestone", date: todayISO(), note: "" }); return s; })}
          style={{ background: C.inkSoft, color: "#fff", border: "none", borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
          + Add
        </button>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "12px 16px 4px" }}>
        {sorted.map((m) => {
          const d = daysUntil(m.date);
          const urgent = d <= 30;
          const isEd = editing === m.id;
          return (
            <div key={m.id} onClick={() => setEditing(isEd ? null : m.id)} style={{
              minWidth: 132, background: C.inkSoft, borderRadius: 12, padding: "12px 12px 10px",
              cursor: "pointer", borderTop: `3px solid ${urgent ? C.red : C.cobalt}`, flexShrink: 0,
            }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: urgent ? "#FF8A80" : "#fff", lineHeight: 1 }}>{d}</div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: C.subOnInk, margin: "2px 0 6px" }}>days</div>
              {isEd ? (
                <input value={m.label} onClick={(e) => e.stopPropagation()}
                  onChange={(e) => update((s) => { s.milestones.find((x) => x.id === m.id).label = e.target.value; return s; })}
                  style={{ width: "100%", border: "none", borderRadius: 6, padding: 4, fontSize: 13, fontWeight: 800 }} />
              ) : (
                <div style={{ fontWeight: 800, fontSize: 13, color: "#fff" }}>{m.label}</div>
              )}
              <div style={{ fontSize: 11, color: C.subOnInk, marginTop: 2 }}>{fmtDate(m.date)}</div>
              {isEd && (
                <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 8, display: "grid", gap: 6 }}>
                  <input type="date" value={m.date}
                    onChange={(e) => update((s) => { const t = s.milestones.find((x) => x.id === m.id); if (e.target.value) t.date = e.target.value; return s; })}
                    style={{ width: "100%", border: "none", borderRadius: 6, padding: 4, fontSize: 12 }} />
                  <button onClick={() => { setEditing(null); update((s) => { s.milestones = s.milestones.filter((x) => x.id !== m.id); return s; }); }}
                    style={{ background: C.red, color: "#fff", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ height: 6, margin: "8px 16px 0", background: `repeating-linear-gradient(90deg, ${C.cobalt} 0 24px, transparent 24px 40px)`, borderRadius: 3, opacity: 0.6 }} />
    </div>
  );
}
