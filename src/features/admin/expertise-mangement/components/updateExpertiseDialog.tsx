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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateExpertise } from "../hooks/expertise.hooks";
import type { updateExpertiseFormValues } from "../schemas/expertise.schema";
import { updateExpertiseSchema } from "../schemas/expertise.schema";

export function UpdateExpertiseDialog({
	expertiseId,
	name,
	description,
}: {
	expertiseId: string;
	name: string;
	description: string;
}) {
	const [open, setOpen] = useState(false);
	const baseId = useId();

	const updateExpertiseMutation = useUpdateExpertise({
		onUpdateSuccess: (updatedExpertise) => {
			reset({
				name: updatedExpertise.name,
				description: updatedExpertise.description,
			});
			setOpen(false);
		},
	});
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<updateExpertiseFormValues>({
		resolver: zodResolver(updateExpertiseSchema),
		defaultValues: {
			name: name,
			description: description,
		},
	});

	const onSubmit = (data: updateExpertiseFormValues) => {
		const { name, description } = data;
		updateExpertiseMutation.mutate({ id: expertiseId, name, description });
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
					variant="secondary"
					onClick={() => setOpen(true)}
				>
					Edit Expertise
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<DialogHeader>
						<DialogTitle>Edit Expertise</DialogTitle>
						<DialogDescription>
							Edit the expertise of your profile.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4">
						<Label htmlFor={`${baseId}-name`} className="text-sm">
							Name
						</Label>
						<Input
							id={`${baseId}-name`}
							type="text"
							placeholder="Name"
							{...register("name")}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>
					<div className="flex flex-col gap-4">
						<Label htmlFor={`${baseId}-description`} className="text-sm">
							Description
						</Label>
						<Textarea
							id={`${baseId}-description`}
							placeholder="Description"
							{...register("description")}
						/>
						{errors.description && (
							<p className="text-sm text-red-500">
								{errors.description.message}
							</p>
						)}
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button
								className="cursor-pointer"
								type="button"
								variant="outline"
								onClick={() => reset()}
							>
								Cancel
							</Button>
						</DialogClose>
						<Button
							className="cursor-pointer"
							type="submit"
							disabled={updateExpertiseMutation.isPending}
						>
							{updateExpertiseMutation.isPending ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
