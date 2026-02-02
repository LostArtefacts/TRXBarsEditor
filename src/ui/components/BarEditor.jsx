import React from "react";
import { CanvasBarPreview } from "./CanvasBarPreview.jsx";
import { buildThemeFromSection } from "../../lib/theme.js";
import { normalizeHexColor } from "../../lib/hsl.js";

function SwatchRow({ barColorSteps, ramp, onPick }) {
  return (
    <div className="swatch-row">
      {Array.from({ length: barColorSteps }).map((_, i) => {
        const color = String(ramp?.[i] || "#000000");
        const normalized = normalizeHexColor(color) || "#000000";
        return (
          <div
            key={i}
            className="color-swatch"
            role="button"
            tabIndex={0}
            title="Click to edit"
            style={{ background: normalized }}
            onClick={() => onPick(i, normalized)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPick(i, normalized);
              }
            }}
          >
            Edit
          </div>
        );
      })}
    </div>
  );
}

export function BarEditor({
  barColorSteps,
  sectionKey,
  barName,
  section,
  value,
  style,
  percent,
  smooth,
  draft,
  savedIndicator,
  onResetDraft,
  onConfirmDraft,
  onSetDraftHsl,
  onOpenColorPicker,
}) {
  if (!sectionKey || !barName || section == null || value == null) {
    return (
      <div className="muted">
        Click a bar name or preview to edit its colors. Edits are remembered in localStorage.
      </div>
    );
  }

  const draftValue = draft?.value ?? value;
  const dirty = draft?.dirty === true;
  const showSaved =
    savedIndicator != null &&
    savedIndicator.sectionKey === sectionKey &&
    savedIndicator.barName === barName;

  return (
    <div className="box">
      <div className="row" style={{ justifyContent: "space-between", gap: 10 }}>
        <div className="tag">Bar editor</div>
        {showSaved ? <div className="tag">Saved</div> : null}
      </div>
      <CanvasBarPreview
        className="bar-preview bar-preview-large"
        theme={buildThemeFromSection(section, draftValue, barColorSteps)}
        percent={percent}
        smooth={smooth}
        barColorSteps={barColorSteps}
      />

      <div className="row" style={{ justifyContent: "flex-start", gap: 8 }}>
        <button type="button" disabled={dirty !== true} onClick={onResetDraft}>
          Reset
        </button>
        <button type="button" disabled={dirty !== true} onClick={onConfirmDraft}>
          Save
        </button>
      </div>

      <div className="tag">HSL</div>
      <div className="sliders">
        <label>Δ Hue</label>
        <input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={String(draft?.hsl?.h ?? 0)}
          onChange={(e) => onSetDraftHsl(Number(e.target.value), draft?.hsl?.s ?? 0, draft?.hsl?.l ?? 0)}
        />
        <output>{String(draft?.hsl?.h ?? 0)}</output>

        <label>Δ Sat</label>
        <input
          type="range"
          min="-100"
          max="100"
          step="1"
          value={String(draft?.hsl?.s ?? 0)}
          onChange={(e) => onSetDraftHsl(draft?.hsl?.h ?? 0, Number(e.target.value), draft?.hsl?.l ?? 0)}
        />
        <output>{String(draft?.hsl?.s ?? 0)}</output>

        <label>Δ Light</label>
        <input
          type="range"
          min="-100"
          max="100"
          step="1"
          value={String(draft?.hsl?.l ?? 0)}
          onChange={(e) => onSetDraftHsl(draft?.hsl?.h ?? 0, draft?.hsl?.s ?? 0, Number(e.target.value))}
        />
        <output>{String(draft?.hsl?.l ?? 0)}</output>
      </div>

      <div className="tag">Colors</div>
      {style === "ps1" ? (
        <>
          <div className="tag">Left ramp</div>
          <SwatchRow
            barColorSteps={barColorSteps}
            ramp={Array.isArray(draftValue?.[0]) ? draftValue[0] : value[0]}
            onPick={(colorIndex, initialHex) =>
              onOpenColorPicker({
                sectionKey,
                barName,
                ps1RampIndex: 0,
                colorIndex,
                section,
                initialHex,
              })
            }
          />
          <div className="tag">Right ramp</div>
          <SwatchRow
            barColorSteps={barColorSteps}
            ramp={Array.isArray(draftValue?.[1]) ? draftValue[1] : value[1]}
            onPick={(colorIndex, initialHex) =>
              onOpenColorPicker({
                sectionKey,
                barName,
                ps1RampIndex: 1,
                colorIndex,
                section,
                initialHex,
              })
            }
          />
        </>
      ) : (
        <>
          <div className="tag">Ramp</div>
          <SwatchRow
            barColorSteps={barColorSteps}
            ramp={Array.isArray(draftValue) ? draftValue : value}
            onPick={(colorIndex, initialHex) =>
              onOpenColorPicker({
                sectionKey,
                barName,
                ps1RampIndex: null,
                colorIndex,
                section,
                initialHex,
              })
            }
          />
        </>
      )}
    </div>
  );
}
