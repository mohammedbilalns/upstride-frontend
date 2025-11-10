import { useEffect, useState } from "react";

//WARNING: unused hook

/**
 * Tracks the user's network connectivity status.
 * Returns `true` if the browser is online, `false` otherwise.
 */
export function useNetworkStatus(): boolean {
  // Initialize with current navigator status 
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator !== "undefined" && navigator.onLine
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Subscribe to native online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

