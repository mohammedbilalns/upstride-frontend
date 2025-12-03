import { Slot } from "@radix-ui/react-slot";
import type * as React from "react";

import { cn } from "@/shared/utils/utils";
import { buttonVariants, type ButtonVariants } from "./button-variants";

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	ButtonVariants & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }),"cursor-pointer")}
			{...props}
		/>
	);
}

export { Button };
