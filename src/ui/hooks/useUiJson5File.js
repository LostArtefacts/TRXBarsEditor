import { useEffect, useState } from "react";
import JSON5 from "json5";
import {
  safeGetLocalStorageItem,
  safeRemoveLocalStorageItem,
  safeSetLocalStorageItem,
} from "../../lib/storage.js";

export function useUiJson5File({ fileStorageKey, store, onParsed }) {
  const [baseData, setBaseData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const raw = safeGetLocalStorageItem(fileStorageKey);
    if (raw == null) {
      setBaseData(null);
      setFileName("");
      return;
    }
    try {
      const parsed = JSON5.parse(raw);
      setBaseData(parsed);
      setFileName("saved file");
      setUploadError(null);
      onParsed(parsed);
    } catch (err) {
      setBaseData(null);
      setFileName("saved file");
      setUploadError(err);
      setUploadOpen(true);
      window.alert(
        "ui.json5 failed to parse.\n\n" +
          "Yes, it's probably your fault (or mine).\n" +
          "Fix the file and upload again.\n\n" +
          `Error: ${String(err)}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUploadText = (text, name) => {
    try {
      const parsed = JSON5.parse(text);
      setBaseData(parsed);
      setFileName(name || "ui.json5");
      safeSetLocalStorageItem(fileStorageKey, text);
      setUploadError(null);
      setUploadOpen(false);
      onParsed(parsed);
    } catch (err) {
      setBaseData(null);
      setFileName(name || "ui.json5");
      setUploadError(err);
      window.alert(
        "ui.json5 failed to parse.\n\n" +
          "Yes, it's probably your fault (or mine).\n" +
          "Fix the file and upload again.\n\n" +
          `Error: ${String(err)}`,
      );
    }
  };

  const forgetSavedFile = () => {
    const ok = window.confirm("Forget the saved ui.json5 from localStorage?");
    if (ok !== true) {
      return;
    }
    safeRemoveLocalStorageItem(fileStorageKey);
    setBaseData(null);
    setFileName("");
    setUploadError(null);
    setUploadOpen(false);
  };

  const flashFileNameSaved = () => {
    setFileName((prev) => (prev ? `${prev} • saved` : "saved"));
    window.setTimeout(() => setFileName((prev) => prev.replace(/ • saved$/, "")), 900);
  };

  // Keep store param "used" (and available for future needs) without changing behavior.
  void store;

  return {
    baseData,
    fileName,
    uploadOpen,
    uploadError,
    setUploadOpen,
    onUploadText,
    forgetSavedFile,
    flashFileNameSaved,
  };
}
