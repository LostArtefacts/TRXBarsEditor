function isPlainObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

export function parseUiJsonRoot(parsed) {
  if (!isPlainObject(parsed)) {
    return {
      bars: {},
      root: {},
      hasBarsKey: false,
    };
  }

  if (isPlainObject(parsed.bars)) {
    return {
      bars: parsed.bars,
      root: parsed,
      hasBarsKey: true,
    };
  }

  return {
    bars: parsed,
    root: parsed,
    hasBarsKey: false,
  };
}

export function buildUiJsonExport(rootData, workspaceBars) {
  const bars = isPlainObject(workspaceBars) ? workspaceBars : {};
  const normalized = parseUiJsonRoot(rootData);
  if (normalized.hasBarsKey) {
    return {
      ...normalized.root,
      bars,
    };
  }
  return {
    bars,
  };
}
