import type { ReactNode } from "react";
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
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "default" | "destructive";
	icon?: ReactNode;
	onConfirm: () => void;
	disabled?: boolean;
}

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
	const actionClass =
		variant === "destructive"
			? "bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90"
			: "bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90";

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild disabled={disabled}>
				{children}
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-sm">
				<AlertDialogHeader>
					<div className="flex items-center gap-2">
						{icon}
						<AlertDialogTitle>{title}</AlertDialogTitle>
					</div>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
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
					<AlertDialogAction onClick={onConfirm} className={actionClass}>
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
