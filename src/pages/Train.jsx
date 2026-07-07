import { C } from "../theme.js";
import { Card, Eyebrow } from "../components/ui.jsx";
import { WEEK_PLAN } from "../data/seed.js";
import { dowShort } from "../utils/dates.js";

export default function Train() {
  const dow = dowShort();
  return (
    <Card>
      <Eyebrow>Weekly split · vertical jump block</Eyebrow>
      <div style={{ display: "grid", gap: 8 }}>
        {Object.entries(WEEK_PLAN).map(([day, s]) => (
          <div key={day} style={{
            display: "flex", gap: 12, padding: "10px 12px", borderRadius: 10,
            background: day === dow ? C.cobaltSoft : "transparent",
            border: day === dow ? `1px solid ${C.cobalt}` : "1px solid transparent",
          }}>
            <div style={{ width: 38, fontWeight: 900, fontSize: 12, color: day === dow ? C.cobalt : C.sub }}>{day.toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: C.sub }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: C.sub, marginTop: 12, lineHeight: 1.5 }}>
        Warm-up rule: Isaiah Rivera iso holds 3×30–45s before both lower days. Daily: couch stretch. Log every lift on the <b>Gym</b> tab.
      </div>
    </Card>
  );
}
