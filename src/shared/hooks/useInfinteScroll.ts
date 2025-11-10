import { useEffect, useState } from "react";

interface UseInfiniteScrollProps {
  /** Called when the target element becomes visible */
  onIntersect: () => void;
  /** Whether there are more pages to load */
  hasNextPage: boolean;
  /** Whether a fetch is already in progress */
  isFetching: boolean;
}

/**
 * Hook that triggers `onIntersect` when a target div enters the viewport.
 * For implementing infinite scrolling.
 */
export function useInfiniteScroll({
  onIntersect,
  hasNextPage,
  isFetching,
}: UseInfiniteScrollProps) {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Avoid observing if there's no target, no more pages, or a fetch is in progress
    if (!target || !hasNextPage || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) onIntersect();
      },
      { rootMargin: "100px" } // start fetching slightly before element is visible
    );

    observer.observe(target);

    return () => observer.disconnect(); // cleanup
  }, [target, hasNextPage, isFetching, onIntersect]);

  return { setTarget };
}

