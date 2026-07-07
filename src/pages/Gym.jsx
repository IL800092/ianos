import { useState } from "react";
import { C, inputStyle, addBtn } from "../theme.js";
import { Card, XBtn } from "../components/ui.jsx";
import { uid, todayISO, fmtDate } from "../utils/dates.js";

// Minimal dropdown tracker: collapsed = exercise name + last session.
// Expanded = log form (with date, so you can backfill) + full dated
// history, oldest→newest deltas so progress is visible at a glance.
export default function Gym({ state, update }) {
  const [newEx, setNewEx] = useState("");
  const [openEx, setOpenEx] = useState(null);
  const [form, setForm] = useState({ weight: "", reps: "", sets: "", date: todayISO() });

  const logsFor = (exId) =>
    state.gym.logs.filter((l) => l.exId === exId).sort((a, b) => b.date.localeCompare(a.date)); // newest first

  const addExercise = () => {
    if (!newEx.trim()) return;
    update((s) => { s.gym.exercises.push({ id: uid(), name: newEx.trim() }); return s; });
    setNewEx("");
  };

  const logSet = (exId) => {
    const w = Number(form.weight), r = Number(form.reps), st = Number(form.sets);
    if (!w || !r) return;
    const date = form.date || todayISO();
    update((s) => { s.gym.logs.push({ id: uid(), exId, date, weight: w, reps: r, sets: st || 1 }); return s; });
    setForm({ weight: "", reps: "", sets: "", date: todayISO() });
  };

  return (
    <>
      <Card style={{ background: C.ink, borderColor: C.ink }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: C.subOnInk, marginBottom: 8 }}>
          Gym log
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={newEx} onChange={(e) => setNewEx(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addExercise()}
            placeholder="Add an exercise…" style={{ ...inputStyle, flex: 1, background: C.inkSoft, border: "none", color: "#fff" }} />
          <button onClick={addExercise} style={addBtn}>Add</button>
        </div>
      </Card>

      {state.gym.exercises.map((ex) => {
        const logs = logsFor(ex.id);
        const last = logs[0];
        const first = logs[logs.length - 1];
        const delta = logs.length > 1 ? last.weight - first.weight : 0;
        const pr = logs.reduce((m, l) => Math.max(m, l.weight), 0);
        const isOpen = openEx === ex.id;
        return (
          <Card key={ex.id} style={{ padding: 0, overflow: "hidden" }}>
            {/* collapsed row — the dropdown header */}
            <button
              onClick={() => { setOpenEx(isOpen ? null : ex.id); setForm((f) => ({ ...f, date: todayISO() })); }}
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: C.ink }}>{ex.name}</div>
                <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>
                  {last ? `${fmtDate(last.date)} · ${last.weight} lbs × ${last.reps} × ${last.sets}` : "No entries yet"}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {pr > 0 && (
                  <span style={{ fontSize: 12, fontWeight: 900, color: C.cobalt }}>PR {pr}</span>
                )}
                {delta !== 0 && (
                  <span style={{ fontSize: 12, fontWeight: 900, color: delta > 0 ? C.green : C.red }}>
                    {delta > 0 ? `+${delta}` : delta} lbs
                  </span>
                )}
                <span style={{ color: C.sub, fontSize: 13, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s", display: "inline-block" }}>▾</span>
              </div>
            </button>

            {/* expanded — save a session + dated progress history */}
            {isOpen && (
              <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${C.line}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "12px 0 8px" }}>
                  {[["weight", "lbs"], ["reps", "reps"], ["sets", "sets"]].map(([k, ph]) => (
                    <input key={k} type="number" inputMode="numeric" value={form[k]} placeholder={ph}
                      onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                      style={{ ...inputStyle, textAlign: "center", fontWeight: 800 }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <input type="date" value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    style={{ ...inputStyle, flex: 1, fontSize: 13 }} aria-label="Session date" />
                  <button onClick={() => logSet(ex.id)} style={{ ...addBtn, padding: "10px 20px" }}>Save</button>
                </div>

                {logs.length > 0 && (
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.1em", color: C.sub }}>PROGRESS</div>
                    {logs.map((l, i) => {
                      const prev = logs[i + 1]; // next item = older session
                      const d = prev ? l.weight - prev.weight : 0;
                      return (
                        <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                          <span style={{ color: C.sub, width: 92, flexShrink: 0 }}>{fmtDate(l.date)}</span>
                          <span style={{ fontWeight: 700, flex: 1 }}>{l.weight} lbs × {l.reps} × {l.sets}</span>
                          {d !== 0 && (
                            <span style={{ fontSize: 11, fontWeight: 900, color: d > 0 ? C.green : C.red }}>
                              {d > 0 ? `+${d}` : d}
                            </span>
                          )}
                          <XBtn onClick={() => update((s) => { s.gym.logs = s.gym.logs.filter((x) => x.id !== l.id); return s; })} />
                        </div>
                      );
                    })}
                  </div>
                )}

                <button onClick={() => update((s) => {
                  s.gym.exercises = s.gym.exercises.filter((x) => x.id !== ex.id);
                  s.gym.logs = s.gym.logs.filter((x) => x.exId !== ex.id);
                  return s;
                })} style={{ marginTop: 12, background: "none", border: "none", color: C.red, fontSize: 12, fontWeight: 800, cursor: "pointer", padding: 0 }}>
                  Remove exercise
                </button>
              </div>
            )}
          </Card>
        );
      })}
    </>
  );
}
