import React, { useEffect, useRef } from "react";
import { drawBarPreview } from "../../lib/draw.js";

export function CanvasBarPreview({ theme, percent, smooth, barColorSteps, className, title, onClick }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }
    drawBarPreview(canvas, theme, percent, smooth, barColorSteps);
  }, [theme, percent, smooth, barColorSteps]);

  return (
    <canvas
      ref={ref}
      className={className}
      title={title}
      onClick={onClick}
    />
  );
}
