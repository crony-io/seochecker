export function safeGetItem(key: string): string | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(key, value);
  } catch {
    return;
  }
}

export function safeRemoveItem(key: string): void {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(key);
  } catch {
    return;
  }
}
