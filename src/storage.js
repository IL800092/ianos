// Storage adapter with two backends:
//  1. window.storage — Claude artifact persistent storage (async key-value)
//  2. localStorage  — fallback when running standalone (vite dev, GitHub Pages)
// Both store the entire app state as JSON under one key.
export const KEY = "ianos:v1";

const hasArtifactStorage = () =>
  typeof window !== "undefined" && window.storage && typeof window.storage.get === "function";

export async function loadRaw() {
  if (hasArtifactStorage()) {
    try {
      const r = await window.storage.get(KEY);
      return r && r.value ? r.value : null;
    } catch {
      return null;
    }
  }
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export async function saveRaw(json) {
  if (hasArtifactStorage()) {
    try { await window.storage.set(KEY, json); } catch {}
    return;
  }
  try { localStorage.setItem(KEY, json); } catch {}
}
