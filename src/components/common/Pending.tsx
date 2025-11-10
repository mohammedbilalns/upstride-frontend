import { Loader2 } from "lucide-react";

interface PendingProps {
  resource: string;
}

/**
 * Loading indicator used for pending states.
 * Displays a spinner and a short descriptive message.
 */
export default function Pending({ resource }: PendingProps) {
  return (
    <div
      className="flex justify-center items-center py-8 text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      {/* Spinner */}
      <Loader2
        className="h-6 w-6 animate-spin"
        aria-hidden="true"
      />

      {/* Loading message */}
      <span className="ml-2 text-sm">
        Loading {resource}...
      </span>
    </div>
  );
}

