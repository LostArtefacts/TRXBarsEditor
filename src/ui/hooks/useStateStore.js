import { useMemo, useRef, useState } from "react";
import { StateStore } from "../../lib/state-store.js";

export function useStateStore(storageKey) {
  const storeRef = useRef(null);
  const [version, setVersion] = useState(0);

  if (storeRef.current == null) {
    const store = new StateStore(storageKey);
    store.loadFromStorage();
    storeRef.current = store;
  }

  const store = storeRef.current;

  const viewState = useMemo(
    () => ({ ...store.state, hasAnyEdits: store.hasAnyEdits() }),
    [store, version],
  );

  const bumpVersion = () => setVersion((v) => v + 1);

  const persistStore = () => {
    store.saveToStorage();
    bumpVersion();
  };

  return { store, viewState, bumpVersion, persistStore };
}
