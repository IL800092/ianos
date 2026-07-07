// Default data for first run. After first load, the live copy in storage
// is the source of truth — edits here only affect fresh installs
// (or new sections added during a migration in App.jsx).
import { uid } from "../utils/dates.js";

export const SEED = {
  milestones: [
    { id: "ucat", label: "UCAT", date: "2026-08-10", note: "Book + confirm" },
    { id: "sat", label: "SAT retake", date: "2026-08-29", note: "Target 1450–1500" },
    { id: "g12", label: "Grade 12 starts", date: "2026-09-08", note: "" },
    { id: "ucas", label: "UCAS deadline", date: "2026-10-15", note: "Hard deadline" },
    { id: "uc", label: "UC apps due", date: "2026-11-30", note: "Berkeley test-blind" },
  ],
  tasks: [
    { id: uid(), text: "Book UCAT test slot", done: false, due: "2026-07-15" },
    { id: uid(), text: "Confirm SAT Aug registration", done: false, due: "2026-07-20" },
    { id: uid(), text: "UK personal statement — first draft", done: false, due: "2026-08-01" },
    { id: uid(), text: "Update uni spreadsheet v3 (Action Plan tab)", done: false, due: "" },
    { id: uid(), text: "ClinicOS — patient portal scheduler scope w/ Arees", done: false, due: "" },
    { id: uid(), text: "Couch stretch daily (hip flexors / L-sit fix)", done: false, due: "" },
  ],
  events: [
    { id: uid(), date: "2026-10-15", title: "UCAS submission deadline", kind: "deadline" },
    { id: uid(), date: "2026-11-30", title: "UC application deadline", kind: "deadline" },
  ],
  uni: {
    uk: [
      { id: uid(), text: "Register + book UCAT (summer window)", done: false },
      { id: uid(), text: "UCAT prep — VR, DM, QR, situational bank", done: false },
      { id: uid(), text: "Personal statement (medicine-focused)", done: false },
      { id: uid(), text: "Work experience / volunteering log compiled", done: false },
      { id: uid(), text: "Shortlist 4 UK med schools (UCAT-weighted fit)", done: false },
      { id: uid(), text: "Teacher reference requested", done: false },
      { id: uid(), text: "UCAS submitted (before Oct 15, 2026)", done: false },
      { id: uid(), text: "Interview prep — MMI practice (Nov–Feb)", done: false },
    ],
    na: [
      { id: uid(), text: "SAT retake Aug/Sep — target 1450–1500", done: false },
      { id: uid(), text: "Common App essay draft", done: false },
      { id: uid(), text: "UC PIQs (Berkeley test-blind)", done: false },
      { id: uid(), text: "Canada list: Waterloo Tron, McMaster, TMU (OUAC)", done: false },
      { id: uid(), text: "Waterloo AIF — StudyHub, ClinicOS, WWMF, SDR", done: false },
      { id: uid(), text: "Decide ED strategy", done: false },
      { id: uid(), text: "Activities list — 10 slots ranked", done: false },
    ],
  },
  projects: [
    { id: uid(), name: "ClinicOS", detail: "Full-stack EMR · Vue + MongoDB · w/ Arees", status: "Active", next: "Patient portal self-serve scheduler" },
    { id: uid(), name: "StudyHub", detail: "React/Vite dashboard · deployed on GitHub Pages", status: "Shipped", next: "Polish for Waterloo AIF screenshots" },
    { id: uid(), name: "WWMF — Regional Director", detail: "World Wave Music Festival · Canada", status: "Active", next: "First regional outreach" },
    { id: uid(), name: "SDR Radio", detail: "GNU Radio + RTL-SDR", status: "Paused", next: "AM demodulation receiver chain" },
    { id: uid(), name: "Skyky Foundation", detail: "Volunteer recruitment", status: "Active", next: "Post recruitment copy" },
    { id: uid(), name: "Summer '27 trip", detail: "Thailand vs Bali · friend group", status: "Planning", next: "Rough budget per person" },
  ],
  profile: {
    tagline: "Gr 12 · Bayview Glen · builder, musician, athlete",
    stats: [
      { id: uid(), label: "Average", value: "97%" },
      { id: uid(), label: "SAT (retaking)", value: "1360" },
      { id: uid(), label: "AP courses", value: "4" },
      { id: uid(), label: "Alto sax", value: "10+ yrs" },
    ],
    sections: [
      { id: uid(), title: "Leadership", items: [
        { id: uid(), text: "Canadian Regional Director — World Wave Music Festival" },
        { id: uid(), text: "DECA — executive" },
        { id: uid(), text: "HOSA — officer" },
        { id: uid(), text: "Skyky Foundation — volunteer team" },
      ]},
      { id: uid(), title: "Built & shipped", items: [
        { id: uid(), text: "ClinicOS — full-stack EMR (Vue, Node, MongoDB, 11k+ drug DB)" },
        { id: uid(), text: "StudyHub — academic dashboard, live on GitHub Pages" },
        { id: uid(), text: "IAN.OS — this app" },
        { id: uid(), text: "SDR radio — GNU Radio + RTL-SDR spectrum analyzer" },
      ]},
      { id: uid(), title: "Athletics", items: [
        { id: uid(), text: "Volleyball · basketball · ultimate frisbee · tennis" },
        { id: uid(), text: "Vertical jump training — rim touch target" },
      ]},
      { id: uid(), title: "Music", items: [
        { id: uid(), text: "Alto saxophone — 10+ years" },
        { id: uid(), text: "Piano — 10+ years" },
        { id: uid(), text: "Youth fundraising concert organizer" },
      ]},
      { id: uid(), title: "Skills", items: [
        { id: uid(), text: "Vue · React · Node · MongoDB · Python" },
        { id: uid(), text: "Fusion 360 CAD · GNU Radio" },
      ]},
    ],
  },
  gym: {
    exercises: [
      { id: uid(), name: "Barbell Bench Press" },
      { id: uid(), name: "Dumbbell Bench Press" },
      { id: uid(), name: "Dumbbell Bicep Curls" },
      { id: uid(), name: "EZ Bar Curls" },
      { id: uid(), name: "Preacher Curls" },
      { id: "pc", name: "Power Clean" },
      { id: "hs", name: "Half Squat (rack 7)" },
      { id: "rdl", name: "RDL" },
      { id: "cr", name: "Calf Raise" },
    ],
    logs: [
      { id: uid(), exId: "pc", date: "2026-07-01", weight: 115, reps: 3, sets: 5 },
      { id: uid(), exId: "hs", date: "2026-07-01", weight: 165, reps: 5, sets: 4 },
      { id: uid(), exId: "rdl", date: "2026-07-01", weight: 135, reps: 8, sets: 3 },
      { id: uid(), exId: "cr", date: "2026-07-01", weight: 135, reps: 12, sets: 4 },
    ],
  },
};

export const WEEK_PLAN = {
  Mon: { name: "Upper A", detail: "Nippard Fundamentals — bench focus" },
  Tue: { name: "Lower A", detail: "Iso holds 3×30–45s → Power Clean → Half Squat → RDL → Calves" },
  Wed: { name: "Plyometrics", detail: "Approach jumps, depth drops, sprint work" },
  Thu: { name: "Upper B", detail: "Nippard Fundamentals — second upper day" },
  Fri: { name: "Lower B", detail: "Iso holds → Bulgarian split squat jumps → RDL → Calves" },
  Sat: { name: "Sport / play", detail: "Basketball, volleyball, tennis — whatever's running" },
  Sun: { name: "Rest + stretch", detail: "Couch stretch (hip flexors), light mobility" },
};
