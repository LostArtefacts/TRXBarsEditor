export function createDefaultTheme(kind) {
  if (String(kind).toLowerCase() === "ps1") {
    return {
      scale: 1.0,
      style: "ps1",
      border_tl: "#000000",
      border_tr: "#000000",
      border_bl: "#000000",
      border_br: "#000000",
      colors: {},
    };
  }
  return {
    scale: 1.0,
    style: "pc",
    border_light: "#ffffff",
    border_dark: "#404040",
    colors: {},
  };
}

export function swapKeyOrderInObject(obj, key, delta) {
  const keys = Object.keys(obj || {});
  const idx = keys.indexOf(key);
  if (idx < 0) {
    return obj;
  }
  const nextIdx = idx + delta;
  if (nextIdx < 0 || nextIdx >= keys.length) {
    return obj;
  }
  const reordered = [...keys];
  const tmp = reordered[idx];
  reordered[idx] = reordered[nextIdx];
  reordered[nextIdx] = tmp;

  const out = {};
  for (const k of reordered) {
    out[k] = structuredClone(obj[k]);
  }
  return out;
}
