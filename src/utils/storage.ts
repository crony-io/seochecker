export function safeGetItem(key: string): string | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Storage] Failed to get item:', key, error);
    }
    return null;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(key, value);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Storage] Failed to set item:', key, error);
    }
  }
}

export function safeRemoveItem(key: string): void {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(key);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Storage] Failed to remove item:', key, error);
    }
  }
}
