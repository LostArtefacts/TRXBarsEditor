import React, { useEffect, useRef } from "react";

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export function UploadModal({ open, error, onClose, onForget, onUpload }) {
  const inputRef = useRef(null);

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

  const pick = () => inputRef.current?.click();

  const onFile = async (file) => {
    if (!file) {
      return;
    }
    const text = await readFileAsText(file);
    onUpload(text, file.name || "ui.json5");
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
          <div className="modal-title">Upload ui.json5</div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div
          className="bars"
          onClick={pick}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer?.files?.[0] || null;
            void onFile(file);
          }}
          style={{ cursor: "pointer" }}
        >
          <div className="muted" style={{ textAlign: "center" }}>
            Drop ui.json5 here
            <br />
            …or click to choose a file.
          </div>

          {error != null ? <div className="muted">Parse failed: {String(error)}</div> : null}

          <div className="row" style={{ justifyContent: "flex-start", gap: 8 }}>
            <button type="button" onClick={onForget}>
              Forget saved file
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
          accept=".json5,.json,application/json,application/json5,text/plain"
          onChange={(e) => void onFile(e.target.files?.[0] || null)}
        />
      </div>
    </div>
  );
}
