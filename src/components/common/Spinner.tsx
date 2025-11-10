/**
 * A simple, reusable loading spinner component.
 * Can be used inline (small) or centered (default).
 */
export function LoadingSpinner({
  size = "default",
}: {
  /** Controls the size of the spinner */
  size?: "sm" | "default";
}) {
  // Define size classes dynamically
  const sizeClass = size === "sm" ? "h-4 w-4 mr-2" : "h-6 w-6";

  return (
    <div
      className="flex justify-center items-center py-2"
      role="status"
      aria-label="Loading"
    >
      {/* Spinner */}
      <div
        className={`animate-spin rounded-full border-b-2 border-primary ${sizeClass}`}
        aria-hidden="true"
      />
    </div>
  );
}

