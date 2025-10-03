"use client";
import { useEffect, useState } from "react";

export function useLocalStorage<T>(keyName: string, defaultValue: T) {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);

  const initialize = () => {
    try {
      const value = window.localStorage.getItem(keyName);
      return value ? JSON.parse(value) : defaultValue;
    } catch (err: unknown) {
      console.log(`Error reading localStorage key "${keyName}":`, err);

      return defaultValue;
    }
  };

  // prevent hydration error by initializing with value only on client
  useEffect(() => {
    setStoredValue(initialize());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = (newValue: T) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } finally {
      setStoredValue(newValue);
    }
  };

  return [storedValue, setValue] as [T, (value: T) => void];
}
