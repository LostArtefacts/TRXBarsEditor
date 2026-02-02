import { useRef, useState } from "react";

export function useSavedIndicator({ durationMs }) {
  const [savedIndicator, setSavedIndicator] = useState(null); // { sectionKey, barName, token }
  const timerRef = useRef(null);

  const flashSaved = (sectionKey, barName) => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const token = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setSavedIndicator({ sectionKey, barName, token });
    timerRef.current = window.setTimeout(() => {
      setSavedIndicator(null);
      timerRef.current = null;
    }, durationMs);
  };

  return { savedIndicator, flashSaved };
}
