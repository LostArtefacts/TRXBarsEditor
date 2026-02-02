import { useState } from "react";
import { adjustBarValueAbsolute } from "../../lib/bar-edit.js";
// Draft lifecycle only; CRUD lives in App for now.

export function useDraft({ store, baseData, workspaceBase, persistStore, onAfterConfirm }) {
  const [draft, setDraft] = useState(null);

  const startDraft = (sectionKey, barName, nextBaseData = baseData) => {
    const ws = store.buildWorkspaceData(nextBaseData || {});
    const section = ws[sectionKey];
    const baseValue = section?.colors ? section.colors[barName] : null;
    if (baseValue == null) {
      setDraft(null);
      return;
    }
    setDraft({
      sectionKey,
      barName,
      baseValueSnapshot: structuredClone(baseValue),
      value: structuredClone(baseValue),
      hsl: { h: 0, s: 0, l: 0 },
      dirty: false,
    });
  };

  const cancelDraft = () => setDraft(null);

  const resetDraft = () => {
    if (draft == null) {
      return;
    }
    setDraft({
      ...draft,
      value: structuredClone(draft.baseValueSnapshot),
      hsl: { h: 0, s: 0, l: 0 },
      dirty: false,
    });
  };

  const setDraftValue = (sectionKey, barName, value) => {
    setDraft((prev) => {
      if (prev == null || prev.sectionKey !== sectionKey || prev.barName !== barName) {
        const ws = store.buildWorkspaceData(baseData || {});
        const section = ws[sectionKey];
        const baseValue = section?.colors ? section.colors[barName] : null;
        if (baseValue == null) {
          return prev;
        }
        return {
          sectionKey,
          barName,
          baseValueSnapshot: structuredClone(baseValue),
          value,
          hsl: { h: 0, s: 0, l: 0 },
          dirty: true,
        };
      }
      return { ...prev, value, dirty: true };
    });
  };

  const setDraftHsl = (h, s, l) => {
    setDraft((prev) => {
      if (prev == null) {
        const nextSelected = store.state.selected;
        if (nextSelected == null) {
          return prev;
        }
        const sectionKey = nextSelected.sectionKey;
        const barName = nextSelected.barName;
        const section = workspaceBase[sectionKey];
        const currentValue = section?.colors ? section.colors[barName] : null;
        if (currentValue == null) {
          return prev;
        }
        const baseValueSnapshot = structuredClone(currentValue);
        const nextValue = adjustBarValueAbsolute(baseValueSnapshot, h, s, l);
        return {
          sectionKey,
          barName,
          baseValueSnapshot,
          value: nextValue,
          hsl: { h, s, l },
          dirty: true,
        };
      }
      const nextValue = adjustBarValueAbsolute(prev.baseValueSnapshot, h, s, l);
      return { ...prev, hsl: { h, s, l }, value: nextValue, dirty: true };
    });
  };

  const confirmDraft = () => {
    if (draft == null) {
      return;
    }
    try {
      const savedSectionKey = draft.sectionKey;
      const savedBarName = draft.barName;
      store.setEditedBarValue(savedSectionKey, savedBarName, draft.value, baseData || {});
      setDraft(null);
      persistStore();
      onAfterConfirm(savedSectionKey, savedBarName);
    } catch (err) {
      window.alert(`Save failed: ${String(err)}`);
    }
  };

  const maybePromptToResolveDraft = (nextSectionKey, nextBarName) => {
    if (draft == null || draft.dirty !== true) {
      return true;
    }
    const switchingBar =
      nextSectionKey != null &&
      nextBarName != null &&
      (nextSectionKey !== draft.sectionKey || nextBarName !== draft.barName);
    const leavingSelection = nextSectionKey == null && nextBarName == null;
    const switchingThemeOnly =
      nextSectionKey != null && nextBarName == null && nextSectionKey !== draft.sectionKey;
    if (switchingBar || leavingSelection || switchingThemeOnly) {
      const ok = window.confirm("You have uncommitted changes. Save them?");
      if (ok === true) {
        confirmDraft();
        return true;
      }
      cancelDraft();
      return true;
    }
    return true;
  };

  const resetEdits = () => {
    if (store.hasAnyEdits() !== true) {
      return;
    }
    const ok = window.confirm("Reset ALL edits?");
    if (ok !== true) {
      return;
    }
    store.resetEdits();
    if (store.state.selected != null) {
      startDraft(store.state.selected.sectionKey, store.state.selected.barName);
    } else {
      setDraft(null);
    }
    persistStore();
  };

  return {
    draft,
    setDraft,
    startDraft,
    setDraftValue,
    setDraftHsl,
    confirmDraft,
    cancelDraft,
    resetDraft,
    maybePromptToResolveDraft,
    resetEdits,
  };
}
