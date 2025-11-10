import { useState, useEffect } from "react";

/**
 * Hook to track whether a CSS media query currently matches.
 * Example: const isMobile = useMediaQuery("(max-width: 768px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Update state if value changes
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    media.addEventListener("change", listener);

    // Set initial value on mount 
    setMatches(media.matches);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

