import { normalizeHexColor } from "./hsl.js";

export function defaultBarValue({ sectionStyle, barColorSteps }) {
  const style = String(sectionStyle || "").toLowerCase();
  if (style === "ps1") {
    return [Array(barColorSteps).fill("#000000"), Array(barColorSteps).fill("#000000")];
  }
  return Array(barColorSteps).fill("#000000");
}

export function applySwatchChange({
  sectionStyle,
  currentValue,
  barColorSteps,
  ps1RampIndex,
  colorIndex,
  colorHex,
}) {
  const normalized = normalizeHexColor(colorHex) || "#000000";
  const style = String(sectionStyle || "").toLowerCase();

  if (style === "ps1") {
    const left =
      Array.isArray(currentValue) && Array.isArray(currentValue[0])
        ? [...currentValue[0]]
        : Array(barColorSteps).fill("#000000");
    const right =
      Array.isArray(currentValue) && Array.isArray(currentValue[1])
        ? [...currentValue[1]]
        : Array(barColorSteps).fill("#000000");

    if (ps1RampIndex === 1) {
      right[colorIndex] = normalized;
    } else {
      left[colorIndex] = normalized;
    }
    return [left, right];
  }

  const ramp = Array.isArray(currentValue)
    ? [...currentValue]
    : Array(barColorSteps).fill("#000000");
  ramp[colorIndex] = normalized;
  return ramp;
}
