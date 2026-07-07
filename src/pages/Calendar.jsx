import { useState, useMemo } from "react";
import { C, DISPLAY, inputStyle, addBtn, ghostInput, navBtn } from "../theme.js";
import { Card, Eyebrow, XBtn } from "../components/ui.jsx";
import { uid, todayISO, fmtDate } from "../utils/dates.js";

export default function CalendarView({ state, update }) {
  const now = new Date();
  const [ym, setYm] = useState([now.getFullYear(), now.getMonth()]);
  const [selected, setSelected] = useState(todayISO());
  const [draft, setDraft] = useState("");
  const [year, month] = ym;

  // Merge user events + milestones into one date-keyed map.
  const allDates = useMemo(() => {
    const map = {};
    state.events.forEach((e) => { (map[e.date] = map[e.date] || []).push({ ...e, src: "event" }); });
    state.milestones.forEach((m) => { (map[m.date] = map[m.date] || []).push({ id: m.id, title: m.label, kind: "milestone", src: "milestone" }); });
    return map;
  }, [state]);

  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(startPad).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const iso = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const addEvent = () => {
    if (!draft.trim()) return;
    update((s) => { s.events.push({ id: uid(), date: selected, title: draft.trim(), kind: "event" }); return s; });
    setDraft("");
  };

  return (
    <>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button onClick={() => setYm(([y, m]) => (m === 0 ? [y - 1, 11] : [y, m - 1]))} style={navBtn}>‹</button>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 16 }}>
            {first.toLocaleDateString("en-CA", { month: "long", year: "numeric" })}
          </div>
          <button onClick={() => setYm(([y, m]) => (m === 11 ? [y + 1, 0] : [y, m + 1]))} style={navBtn}>›</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 800, color: C.sub }}>{d}</div>
          ))}
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const dISO = iso(d);
            const has = allDates[dISO];
            const isToday = dISO === todayISO();
            const isSel = dISO === selected;
            const hasDeadline = has && has.some((e) => e.kind !== "event");
            return (
              <button key={i} onClick={() => setSelected(dISO)} style={{
                aspectRatio: "1", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700,
                background: isSel ? C.cobalt : isToday ? C.cobaltSoft : "transparent",
                color: isSel ? "#fff" : C.ink, position: "relative",
              }}>
                {d}
                {has && <span style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 5, height: 5, borderRadius: 3, background: isSel ? "#fff" : hasDeadline ? C.red : C.cobalt }} />}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <Eyebrow>{fmtDate(selected)} — tap a title to edit</Eyebrow>
        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          {(allDates[selected] || []).map((e) => (
            <div key={e.id + e.src} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: e.kind === "event" ? C.cobalt : C.red, flexShrink: 0 }} />
              {e.src === "event" ? (
                <>
                  <input value={e.title}
                    onChange={(ev) => update((s) => { s.events.find((x) => x.id === e.id).title = ev.target.value; return s; })}
                    style={{ ...ghostInput, flex: 1, fontSize: 14, fontWeight: 600 }} />
                  <XBtn onClick={() => update((s) => { s.events = s.events.filter((x) => x.id !== e.id); return s; })} />
                </>
              ) : (
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>
                  {e.title} <span style={{ fontSize: 11, color: C.sub }}>(milestone — edit on Today)</span>
                </div>
              )}
            </div>
          ))}
          {!(allDates[selected] || []).length && <div style={{ fontSize: 13, color: C.sub }}>Nothing scheduled.</div>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addEvent()}
            placeholder="Add event to this day…" style={{ ...inputStyle, flex: 1 }} />
          <button onClick={addEvent} style={addBtn}>Add</button>
        </div>
      </Card>
    </>
  );
}
