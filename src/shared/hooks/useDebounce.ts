import { useEffect, useState } from "react";

/**
 * Custom hook that debounces a changing value.
 * Returns the latest value only after the specified delay has passed
 * without further changes.
 *
 * @param value - The value to debounce 
 * @param delay - Delay in milliseconds before updating (default: 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  // Holds the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Start a timer that updates the value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if value or delay changes before timer completes
    return () => clearTimeout(handler);
  }, [value]);

  return debouncedValue;
}

