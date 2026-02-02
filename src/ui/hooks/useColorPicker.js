import { useRef, useState } from "react";
import { applySwatchChange } from "../../lib/bar-values.js";

export function useColorPicker({ barColorSteps, setDraftValue }) {
  const [colorModal, setColorModal] = useState({ open: false, title: "", initialHex: "#000000" });
  const modalStateRef = useRef(null);

  const openColorPicker = ({
    sectionKey,
    barName,
    ps1RampIndex,
    colorIndex,
    section,
    initialHex,
  }) => {
    modalStateRef.current = { sectionKey, barName, ps1RampIndex, colorIndex, section };
    setColorModal({ open: true, title: `Edit ${sectionKey}.${barName}`, initialHex });
  };

  const onModalChange = (hex) => {
    const modalState = modalStateRef.current;
    if (modalState == null) {
      return;
    }
    const s = modalState.section;
    const current = s?.colors ? s.colors[modalState.barName] : null;
    const nextValue = applySwatchChange({
      sectionStyle: s?.style,
      currentValue: current,
      barColorSteps,
      ps1RampIndex: modalState.ps1RampIndex,
      colorIndex: modalState.colorIndex,
      colorHex: hex,
    });
    setDraftValue(modalState.sectionKey, modalState.barName, nextValue);
  };

  const onModalClose = () => {
    modalStateRef.current = null;
    setColorModal((m) => ({ ...m, open: false }));
  };

  return { colorModal, openColorPicker, onModalChange, onModalClose };
}
