import React, { useEffect, useMemo, useState } from "react";
import { hslToRgb, normalizeHexColor, parseHexColor, rgbToHex, rgbToHsl } from "../../lib/hsl.js";

function Slider({ label, min, max, step, value, onChange }) {
  return (
    <div className="modal-slider">
      <label>{label}</label>
      <input
        type="range"
        min={String(min)}
        max={String(max)}
        step={String(step)}
        value={String(value)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>{String(value)}</output>
    </div>
  );
}

export function ColorModal({ open, title, initialHex, onClose, onChange }) {
  const normalizedInitial = useMemo(() => normalizeHexColor(initialHex) || "#000000", [initialHex]);
  const [hex, setHex] = useState(normalizedInitial);
  const [rgb, setRgb] = useState(() => parseHexColor(normalizedInitial));
  const [hsl, setHsl] = useState(() => rgbToHsl(rgb.r, rgb.g, rgb.b));

  useEffect(() => {
    setHex(normalizedInitial);
    const nextRgb = parseHexColor(normalizedInitial);
    setRgb(nextRgb);
    setHsl(rgbToHsl(nextRgb.r, nextRgb.g, nextRgb.b));
  }, [normalizedInitial]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const applyHex = (nextHex) => {
    const normalized = normalizeHexColor(nextHex);
    if (normalized == null) {
      return;
    }
    const nextRgb = parseHexColor(normalized);
    const nextHsl = rgbToHsl(nextRgb.r, nextRgb.g, nextRgb.b);
    setHex(normalized);
    setRgb(nextRgb);
    setHsl(nextHsl);
    onChange(normalized);
  };

  const applyRgb = (nextRgb) => {
    const nextHex = rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b);
    const nextHsl = rgbToHsl(nextRgb.r, nextRgb.g, nextRgb.b);
    setRgb(nextRgb);
    setHex(nextHex);
    setHsl(nextHsl);
    onChange(nextHex);
  };

  const applyHsl = (nextHsl) => {
    const nextRgb = hslToRgb(nextHsl.h, nextHsl.s, nextHsl.l);
    const nextHex = rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b);
    setHsl(nextHsl);
    setRgb(nextRgb);
    setHex(nextHex);
    onChange(nextHex);
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="modal-color-preview" style={{ background: hex }} />

        <div className="modal-row">
          <label>HEX</label>
          <input
            type="text"
            value={hex}
            className="modal-hex"
            onChange={(e) => setHex(e.target.value)}
            onBlur={() => applyHex(hex)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyHex(hex);
              }
            }}
          />
        </div>

        <div className="modal-sliders">
          <Slider
            label="R"
            min={0}
            max={255}
            step={1}
            value={rgb.r}
            onChange={(v) => applyRgb({ r: v, g: rgb.g, b: rgb.b, a: 255 })}
          />
          <Slider
            label="G"
            min={0}
            max={255}
            step={1}
            value={rgb.g}
            onChange={(v) => applyRgb({ r: rgb.r, g: v, b: rgb.b, a: 255 })}
          />
          <Slider
            label="B"
            min={0}
            max={255}
            step={1}
            value={rgb.b}
            onChange={(v) => applyRgb({ r: rgb.r, g: rgb.g, b: v, a: 255 })}
          />
          <Slider
            label="H"
            min={0}
            max={360}
            step={1}
            value={Math.round(hsl.h)}
            onChange={(v) => applyHsl({ h: v, s: hsl.s, l: hsl.l })}
          />
          <Slider
            label="S"
            min={0}
            max={100}
            step={1}
            value={Math.round(hsl.s)}
            onChange={(v) => applyHsl({ h: hsl.h, s: v, l: hsl.l })}
          />
          <Slider
            label="L"
            min={0}
            max={100}
            step={1}
            value={Math.round(hsl.l)}
            onChange={(v) => applyHsl({ h: hsl.h, s: hsl.s, l: v })}
          />
        </div>
      </div>
    </div>
  );
}
