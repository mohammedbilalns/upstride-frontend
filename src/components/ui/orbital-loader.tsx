import { cva } from "class-variance-authority";
import { motion } from "motion/react";
import type React from "react";
import { cn } from "@/shared/utils/utils";

/**
 * Class variance utility defining layout options
 * for message placement relative to the spinner.
 */
const orbitalLoaderVariants = cva("flex gap-2 items-center justify-center", {
  variants: {
    messagePlacement: {
      bottom: "flex-col",
      top: "flex-col-reverse",
      right: "flex-row",
      left: "flex-row-reverse",
    },
  },
  defaultVariants: {
    messagePlacement: "bottom",
  },
});

export interface OrbitalLoaderProps
  extends React.ComponentProps<"div"> {
  /** Optional loading message displayed near the spinner */
  message?: string;
  messagePlacement?: "top" | "bottom" | "left" | "right";
}

/**
 * Animated orbital loader component.
 * - Composed of three concentric rotating borders.
 * - Can optionally display a message in any direction.
 */
export function OrbitalLoader({
  className,
  message,
  messagePlacement,
  ...props
}: OrbitalLoaderProps) {
  return (
    <div
      className={cn(orbitalLoaderVariants({ messagePlacement }))}
      role="status" 
      aria-live="polite"
      {...props}
    >
      {/* Spinner animation */}
      <div className={cn("relative w-16 h-16", className)}>
        <motion.div
          className="absolute inset-0 border-2 border-transparent border-t-foreground rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-2 border-2 border-transparent border-t-foreground rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-4 border-2 border-transparent border-t-foreground rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      {/* Optional message */}
      {message && (
        <div className="text-sm text-muted-foreground select-none mt-2">
          {message}
        </div>
      )}
    </div>
  );
}

