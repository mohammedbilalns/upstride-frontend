import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSkill } from "../hooks";
import type { createSkillFormValues } from "../schemas/expertise.schema";
import { createSkillSchema } from "../schemas/expertise.schema";

interface CreateSkillDialogProps {
	expertiseId: string;
}
export function CreateSkillDialog({ expertiseId }: CreateSkillDialogProps) {
	const [open, setOpen] = useState(false);
	const baseId = useId();
	const createSkillMutation = useCreateSkill({
		onCreateSuccess: () => {
			reset();
			setOpen(false);
		},
	});
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<createSkillFormValues>({
		resolver: zodResolver(createSkillSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = (data: createSkillFormValues) => {
		const { name } = data;
		createSkillMutation.mutate({ name, expertiseId });
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) reset();
			}}
		>
			<DialogTrigger asChild>
				<Button
					className="cursor-pointer"
					size="sm"
					variant="default"
					onClick={() => setOpen(true)}
				>
					Add Skill
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<DialogHeader>
						<DialogTitle>Add Skill</DialogTitle>
						<DialogDescription>
							Fill out the details and click save when done.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-3">
						<Label htmlFor={`${baseId}-name`}>Name</Label>
						<Input id={`${baseId}-name`} {...register("name")} />
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button
								className="cursor-pointer"
								type="button"
								variant="outline"
							>
								Cancel
							</Button>
						</DialogClose>
						<Button
							className="cursor-pointer"
							type="submit"
							disabled={createSkillMutation.isPending}
						>
							{createSkillMutation.isPending ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
