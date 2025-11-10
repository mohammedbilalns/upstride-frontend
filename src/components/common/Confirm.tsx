import { useState, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  children: ReactNode;
  /** Dialog title and description text */
  title: string;
  description: string;
  /** Button labels and visual variants */
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  /** Optional icon displayed next to title */
  icon?: ReactNode;
  /** Handler executed when user confirms the action */
  onConfirm: () => void;

  /** Disables the trigger */
  disabled?: boolean;
}

/**
 * Confirmation dialog component.
 * Wrap action trigger (e.g. delete button) with <ConfirmDialog>.
 * 
 * Example:
 * <ConfirmDialog title="Delete?" description="This action is irreversible." onConfirm={handleDelete}>
 *   <Button variant="destructive">Delete</Button>
 * </ConfirmDialog>
 */
export function ConfirmDialog({
  children,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  icon,
  onConfirm,
  disabled = false,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  // Determine confirm button style
  const actionClass =
    variant === "destructive"
      ? "bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90"
      : "bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90";

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger element */}
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>

      {/* Dialog content */}
      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {icon}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* Cancel Button */}
          <AlertDialogCancel
            className="
              cursor-pointer
              bg-muted
              text-muted-foreground/80
              hover:bg-muted/90
              dark:text-muted-foreground
            "
          >
            {cancelText}
          </AlertDialogCancel>

          {/* Confirm Button */}
          <AlertDialogAction onClick={handleConfirm} className={actionClass}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

