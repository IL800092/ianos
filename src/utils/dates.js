export const uid = () => Math.random().toString(36).slice(2, 9);

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const daysUntil = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date();
  return Math.round(
    (new Date(y, m - 1, d) - new Date(t.getFullYear(), t.getMonth(), t.getDate())) / 86400000
  );
};

export const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const dowShort = () => new Date().toLocaleDateString("en-CA", { weekday: "short" });
