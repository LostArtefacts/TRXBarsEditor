export function safeGetLocalStorageItem(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw != null && raw.length > 0 ? raw : null;
  } catch {
    return null;
  }
}

export function safeSetLocalStorageItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemoveLocalStorageItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
