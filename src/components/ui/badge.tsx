import { Slot } from "@radix-ui/react-slot";
import type * as React from "react";

import { cn } from "@/shared/utils/utils";
import { badgeVariants, type BadgeVariants } from "./badge-variants";

function Badge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	BadgeVariants & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge };
