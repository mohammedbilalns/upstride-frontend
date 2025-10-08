import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
	Checkbox,
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
} from "@/components/ui";
import { useFetchSkills } from "@/routes/admin/expertisemanagement/-hooks/useFetchSkills";
import type { Skill } from "@/types";
import { SkillSkeleton } from "./skillSkeleton";

interface SkillSelectionProps {
	expertiseId: string;
}

export default function SkillSelection({ expertiseId }: SkillSelectionProps) {
	const { data: response, isLoading } = useFetchSkills(expertiseId);
	const {
		setValue,
		watch,
		formState: { errors },
	} = useFormContext();

	const skillOptions =
		response?.data.filter((skill: Skill) => skill.isVerified) || [];
	const selectedSkills = watch("skills") || [];

	useEffect(() => {
		if (expertiseId) {
			setValue("skills", []);
		}
	}, [expertiseId, setValue]);

	const handleSkillChange = (skillId: string, checked: boolean) => {
		const newSkills = checked
			? [...selectedSkills, skillId]
			: selectedSkills.filter((id: string) => id !== skillId);

		setValue("skills", newSkills, { shouldValidate: true });
	};

	if (isLoading) {
		return <SkillSkeleton />;
	}

	if (!skillOptions || skillOptions.length === 0) {
		return <div>No skills available for this expertise</div>;
	}

	return (
		<div className="transition-all duration-300 ease-in-out">
			<FormLabel>Skills</FormLabel>
			<FormDescription className="mb-3">
				Select relevant skills for your expertise
			</FormDescription>

			<div className="grid grid-cols-2 gap-2">
				{skillOptions.map((skill: Skill) => (
					<FormItem
						key={skill.id}
						className="flex flex-row items-start space-x-3 space-y-0"
					>
						<FormControl>
							<Checkbox
								checked={selectedSkills.includes(skill.id)}
								onCheckedChange={(checked) =>
									handleSkillChange(skill.id, checked as boolean)
								}
							/>
						</FormControl>
						<FormLabel className="text-sm font-normal">{skill.name}</FormLabel>
					</FormItem>
				))}
			</div>

			{errors.skills && (
				<p className="text-sm font-medium text-destructive mt-2">
					{typeof errors.skills.message === "string"
						? errors.skills.message
						: "Please select at least one skill"}
				</p>
			)}
		</div>
	);
}
