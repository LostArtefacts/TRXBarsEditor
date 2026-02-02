import React from "react";
import { buildThemeFromSection } from "../../lib/theme.js";
import { CanvasBarPreview } from "./CanvasBarPreview.jsx";

export function ThemeBars({
  barColorSteps,
  themeKey,
  section,
  selected,
  percent,
  smooth,
  onSelectBar,
}) {
  const colors = section.colors || {};
  const names = Object.keys(colors);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>{themeKey}</h2>
        <div className="meta">
          {names.length} bar{names.length === 1 ? "" : "s"} •{" "}
          {String(section.style || "").toLowerCase() === "ps1" ? "ps1" : "pc"}
        </div>
      </div>
      <div className="bars">
        {names.map((barName) => {
          const value = colors[barName];
          const selectedNow =
            selected != null && themeKey === selected.sectionKey && barName === selected.barName;
          const theme = buildThemeFromSection(section, value, barColorSteps);
          return (
            <div key={barName} className="bar">
              <button
                type="button"
                className={selectedNow ? "selected" : ""}
                onClick={() => onSelectBar(themeKey, barName)}
              >
                {barName}
              </button>
              <div className="tracks">
                <CanvasBarPreview
                  className="bar-preview"
                  theme={theme}
                  percent={percent}
                  smooth={smooth}
                  barColorSteps={barColorSteps}
                  onClick={() => onSelectBar(themeKey, barName)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
