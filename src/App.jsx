import { useState, useEffect, useRef } from "react";
import { C, DISPLAY, BODY } from "./theme.js";
import { SEED } from "./data/seed.js";
import { loadRaw, saveRaw } from "./storage.js";
import Today from "./pages/Today.jsx";
import CalendarView from "./pages/Calendar.jsx";
import Uni from "./pages/Uni.jsx";
import Train from "./pages/Train.jsx";
import Gym from "./pages/Gym.jsx";
import Projects from "./pages/Projects.jsx";
import Profile from "./pages/Profile.jsx";

// MIGRATIONS: when adding a new top-level section to the data model,
// patch it in here so existing saved states pick it up without a reset.
function migrate(state) {
  if (!state.gym) state.gym = SEED.gym;
  if (!state.profile) state.profile = SEED.profile;
  return state;
}

const TABS = [
  { id: "today", label: "Today" },
  { id: "calendar", label: "Cal" },
  { id: "uni", label: "Uni" },
  { id: "train", label: "Train" },
  { id: "gym", label: "Gym" },
  { id: "projects", label: "Proj" },
  { id: "me", label: "Me" },
  // JARVIS is a standalone static page (public/jarvis/), not a React tab.
  { id: "jarvis", label: "Jarvis", href: "jarvis/" },
];

export default function App() {
  const [state, setState] = useState(null);
  const [tab, setTab] = useState("today");
  const saveTimer = useRef(null);

  useEffect(() => {
    (async () => {
      const raw = await loadRaw();
      let loaded = null;
      if (raw) {
        try { loaded = migrate(JSON.parse(raw)); } catch {}
      }
      setState(loaded || SEED);
      if (!loaded) saveRaw(JSON.stringify(SEED));
    })();
  }, []);

  // All mutations flow through update(): clone → mutate → debounce-save.
  const update = (fn) => {
    setState((prev) => {
      const next = fn(structuredClone(prev));
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveRaw(JSON.stringify(next)), 400);
      return next;
    });
  };

  if (!state) {
    return (
      <div style={{ minHeight: "100vh", background: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BODY, color: C.sub }}>
        Loading your runway…
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.paper, color: C.ink, fontFamily: BODY, paddingBottom: 84 }}>
      <style>{`
        * { box-sizing: border-box; }
        input, button, select { font-family: inherit; }
        input:focus, button:focus-visible, select:focus { outline: 2px solid ${C.cobalt}; outline-offset: 2px; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      <header style={{ padding: "18px 16px 6px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 22 }}>
            IAN<span style={{ color: C.cobalt }}>.OS</span>
          </div>
          <div style={{ fontSize: 12, color: C.sub, fontWeight: 700 }}>
            {new Date().toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: C.sub, marginTop: 2 }}>
          Runway to Fall 2027 · Bayview Glen · Gr 12
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "10px 16px", display: "grid", gap: 14 }}>
        {tab === "today" && <Today state={state} update={update} />}
        {tab === "calendar" && <CalendarView state={state} update={update} />}
        {tab === "uni" && <Uni state={state} update={update} />}
        {tab === "train" && <Train />}
        {tab === "gym" && <Gym state={state} update={update} />}
        {tab === "projects" && <Projects state={state} update={update} />}
        {tab === "me" && <Profile state={state} update={update} />}
      </main>

      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.ink, display: "flex", justifyContent: "space-around", padding: "10px 4px calc(10px + env(safe-area-inset-bottom))", overflowX: "auto" }}>
        {TABS.map((t) => {
          const style = {
            background: tab === t.id ? C.cobalt : "transparent", color: "#fff", border: "none", cursor: "pointer",
            borderRadius: 999, padding: "8px 13px", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap",
            opacity: tab === t.id ? 1 : 0.65, transition: "opacity .15s",
          };
          return t.href ? (
            <a key={t.id} href={t.href} style={{ ...style, textDecoration: "none", display: "inline-block" }}>{t.label}</a>
          ) : (
            <button key={t.id} onClick={() => setTab(t.id)} style={style}>{t.label}</button>
          );
        })}
      </nav>
    </div>
  );
}
