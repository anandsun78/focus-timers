const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const safeStorage = {
  get: (key: string): string | null => {
    const storage = getStorage();
    if (!storage) {
      return null;
    }
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): void => {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    try {
      storage.setItem(key, value);
    } catch {
      // ignore quota errors
    }
  },
  remove: (key: string): void => {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    try {
      storage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
