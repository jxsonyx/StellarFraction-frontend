import { useEffect, useState } from 'react';

const readStoredValue = (storageKey, initialValue) => {
  const storedValue = window.localStorage.getItem(storageKey);

  if (storedValue === null) return initialValue;

  try {
    return JSON.parse(storedValue);
  } catch {
    window.localStorage.removeItem(storageKey);
    return initialValue;
  }
};

export function usePersistentState(storageKey, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(storageKey, initialValue));

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  return [value, setValue];
}
