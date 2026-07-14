import { useEffect, useState } from 'react';

export function usePersistentState(storageKey, initialValue) {
  const [value, setValue] = useState(() => {
    const storedValue = window.localStorage.getItem(storageKey);
    return storedValue === null ? initialValue : JSON.parse(storedValue);
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  return [value, setValue];
}
