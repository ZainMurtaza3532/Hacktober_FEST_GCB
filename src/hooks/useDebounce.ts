import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid value updates (e.g., search query inputs)
 *
 * @param value The raw incoming state value
 * @param delay Milliseconds to debounce (defaults to 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
