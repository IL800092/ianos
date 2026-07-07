import { useState } from "react";
import { C, DISPLAY, inputStyle, addBtn, ghostInput } from "../theme.js";
import { Card, Eyebrow, XBtn } from "../components/ui.jsx";
import { uid } from "../utils/dates.js";

// "Personal LinkedIn" — headline stats + editable resume sections.
// Everything is tap-to-edit; sections and items can be added/removed.
export default function Profile({ state, update }) {
  const p = state.profile;
  const [drafts, setDrafts] = useState({});

  const addItem = (secId) => {
    const text = (drafts[secId] || "").trim();
    if (!text) return;
    update((s) => { s.profile.sections.find((x) => x.id === secId).items.push({ id: uid(), text }); return s; });
    setDrafts((d) => ({ ...d, [secId]: "" }));
  };

  return (
    <>
      {/* header card */}
      <Card style={{ background: C.ink, borderColor: C.ink }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 22, color: "#fff" }}>Ian</div>
        <input value={p.tagline}
          onChange={(e) => update((s) => { s.profile.tagline = e.target.value; return s; })}
          style={{ ...ghostInput, color: C.subOnInk, fontSize: 13, marginTop: 4 }} />
      </Card>

      {/* headline stats grid */}
      <Card>
        <Eyebrow>The numbers</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {p.stats.map((st) => (
            <div key={st.id} style={{ background: C.paper, borderRadius: 12, padding: "12px 14px", position: "relative" }}>
              <input value={st.value}
                onChange={(e) => update((s) => { s.profile.stats.find((x) => x.id === st.id).value = e.target.value; return s; })}
                style={{ ...ghostInput, fontFamily: DISPLAY, fontWeight: 800, fontSize: 22, color: C.cobalt }} />
              <input value={st.label}
                onChange={(e) => update((s) => { s.profile.stats.find((x) => x.id === st.id).label = e.target.value; return s; })}
                style={{ ...ghostInput, fontSize: 11, fontWeight: 800, color: C.sub, textTransform: "uppercase", letterSpacing: "0.06em" }} />
              <div style={{ position: "absolute", top: 6, right: 6 }}>
                <XBtn label="Delete stat" onClick={() => update((s) => { s.profile.stats = s.profile.stats.filter((x) => x.id !== st.id); return s; })} />
              </div>
            </div>
          ))}
          <button onClick={() => update((s) => { s.profile.stats.push({ id: uid(), label: "label", value: "0" }); return s; })}
            style={{ background: "transparent", border: `2px dashed ${C.line}`, borderRadius: 12, padding: "12px 14px", color: C.sub, fontWeight: 800, cursor: "pointer", fontSize: 13 }}>
            + Add stat
          </button>
        </div>
      </Card>

      {/* resume sections */}
      {p.sections.map((sec) => (
        <Card key={sec.id}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <input value={sec.title}
              onChange={(e) => update((s) => { s.profile.sections.find((x) => x.id === sec.id).title = e.target.value; return s; })}
              style={{ ...ghostInput, fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: C.sub, flex: 1 }} />
            <XBtn label="Delete section" onClick={() => update((s) => { s.profile.sections = s.profile.sections.filter((x) => x.id !== sec.id); return s; })} />
          </div>
          <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
            {sec.items.map((it) => (
              <div key={it.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: C.cobalt, flexShrink: 0 }} />
                <input value={it.text}
                  onChange={(e) => update((s) => { s.profile.sections.find((x) => x.id === sec.id).items.find((y) => y.id === it.id).text = e.target.value; return s; })}
                  style={{ ...ghostInput, flex: 1, fontSize: 14, fontWeight: 600 }} />
                <XBtn onClick={() => update((s) => { const sc = s.profile.sections.find((x) => x.id === sec.id); sc.items = sc.items.filter((y) => y.id !== it.id); return s; })} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={drafts[sec.id] || ""} onChange={(e) => setDrafts((d) => ({ ...d, [sec.id]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && addItem(sec.id)} placeholder="Add…" style={{ ...inputStyle, flex: 1 }} />
            <button onClick={() => addItem(sec.id)} style={addBtn}>Add</button>
          </div>
        </Card>
      ))}

      <button onClick={() => update((s) => { s.profile.sections.push({ id: uid(), title: "New section", items: [] }); return s; })}
        style={{ background: "transparent", border: `2px dashed ${C.line}`, borderRadius: 14, padding: 14, color: C.sub, fontWeight: 800, cursor: "pointer", fontSize: 13 }}>
        + Add section
      </button>
    </>
  );
}
