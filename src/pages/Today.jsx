import { useState } from "react";
import { C, DISPLAY, inputStyle, addBtn, ghostInput } from "../theme.js";
import { Card, Eyebrow, Check, XBtn } from "../components/ui.jsx";
import Runway from "../components/Runway.jsx";
import { WEEK_PLAN } from "../data/seed.js";
import { uid, todayISO, daysUntil, fmtDate, dowShort } from "../utils/dates.js";

export default function Today({ state, update }) {
  const [draft, setDraft] = useState("");
  const [draftDue, setDraftDue] = useState("");
  const dow = dowShort();
  const session = WEEK_PLAN[dow];
  const open = state.tasks.filter((t) => !t.done);
  const done = state.tasks.filter((t) => t.done);
  const todaysEvents = state.events.filter((e) => e.date === todayISO());

  const addTask = () => {
    if (!draft.trim()) return;
    update((s) => { s.tasks.unshift({ id: uid(), text: draft.trim(), done: false, due: draftDue }); return s; });
    setDraft(""); setDraftDue("");
  };

  return (
    <>
      <Runway milestones={state.milestones} update={update} />

      <Card>
        <Eyebrow>Today's session · {dow}</Eyebrow>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 20 }}>{session.name}</div>
        <div style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>{session.detail}</div>
      </Card>

      {todaysEvents.length > 0 && (
        <Card style={{ background: C.amberSoft, borderColor: "#EAD9BC" }}>
          <Eyebrow>On the calendar today</Eyebrow>
          {todaysEvents.map((e) => <div key={e.id} style={{ fontWeight: 700, fontSize: 14 }}>{e.title}</div>)}
        </Card>
      )}

      <Card>
        <Eyebrow>Tasks · {open.length} open</Eyebrow>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a task…" style={{ ...inputStyle, flex: 1 }} />
          <button onClick={addTask} style={addBtn}>Add</button>
        </div>
        <input type="date" value={draftDue} onChange={(e) => setDraftDue(e.target.value)}
          style={{ ...inputStyle, marginBottom: 12, fontSize: 12, padding: "6px 10px", color: C.sub }}
          aria-label="Due date (optional)" />
        <div style={{ display: "grid", gap: 8 }}>
          {open.map((t) => (
            <div key={t.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Check done={false} onClick={() => update((s) => { s.tasks.find((y) => y.id === t.id).done = true; return s; })} />
              <input value={t.text}
                onChange={(e) => update((s) => { s.tasks.find((y) => y.id === t.id).text = e.target.value; return s; })}
                style={{ ...ghostInput, flex: 1, fontSize: 14, fontWeight: 600 }} />
              {t.due && <div style={{ fontSize: 11, fontWeight: 800, color: daysUntil(t.due) <= 7 ? C.red : C.sub, whiteSpace: "nowrap" }}>{fmtDate(t.due)}</div>}
              <XBtn onClick={() => update((s) => { s.tasks = s.tasks.filter((y) => y.id !== t.id); return s; })} />
            </div>
          ))}
          {open.length === 0 && <div style={{ fontSize: 13, color: C.sub }}>Nothing open. Add what's next.</div>}
        </div>
        {done.length > 0 && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.line}` }}>
            {done.map((t) => (
              <div key={t.id} style={{ display: "flex", gap: 10, alignItems: "center", opacity: 0.5, marginBottom: 6 }}>
                <Check done onClick={() => update((s) => { s.tasks.find((y) => y.id === t.id).done = false; return s; })} />
                <div style={{ flex: 1, fontSize: 14, textDecoration: "line-through" }}>{t.text}</div>
                <XBtn onClick={() => update((s) => { s.tasks = s.tasks.filter((y) => y.id !== t.id); return s; })} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
