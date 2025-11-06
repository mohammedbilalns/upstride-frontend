import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useFetchSkills } from "@/features/admin/expertise-mangement/hooks/skills.hooks";
import { useFetchExpertiseAreas } from "@/features/auth/hooks/onboarding.hooks";
import type { Expertise, Skill } from "@/shared/types";

interface ExpertiseWithSkillsProps {
	expertiseId: string;
	isEditing: boolean;
	selectedSkills: string[];
	onUpdateSkills: (skills: string[]) => void;
	onRemoveExpertise: () => void;
}

export function ExpertiseWithSkills({
	expertiseId,
	isEditing,
	selectedSkills,
	onUpdateSkills,
	onRemoveExpertise,
}: ExpertiseWithSkillsProps) {
	const { data: skillsData } = useFetchSkills(expertiseId);
	const { data: expertiseData } = useFetchExpertiseAreas();
	const skillsOptions = skillsData?.data || [];
	const expertiseOptions = expertiseData?.expertises || [];

	// State to track the currently selected skill in the dropdown
	const [selectedSkillId, setSelectedSkillId] = useState<string>("");

	const expertise = expertiseOptions.find(
		(e: Expertise) => e.id === expertiseId,
	);
	const expertiseName = expertise?.name || "Unknown Expertise";

	const expertiseSkills = selectedSkills.filter((skillId) => {
		const skill = skillsOptions.find((s: Expertise) => s.id === skillId);
		return skill;
	});

	const handleAddSkill = (skillId: string) => {
		if (!selectedSkills.includes(skillId)) {
			const newSkills = [...selectedSkills, skillId];
			onUpdateSkills(newSkills);
			// Reset the dropdown selection after adding
			setSelectedSkillId("");
		}
	};

	const handleRemoveSkill = (skillId: string) => {
		const newSkills = selectedSkills.filter((id) => id !== skillId);
		onUpdateSkills(newSkills);
	};

	return (
		<Card className="mb-4">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-base">{expertiseName}</CardTitle>
					{isEditing && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={onRemoveExpertise}
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<div>
					<div className="flex items-center justify-between mb-2">
						<Label className="text-sm font-medium">Skills</Label>
						{isEditing && (
							<div className="flex items-center gap-2">
								<Select
									value={selectedSkillId}
									onValueChange={(value) => {
										setSelectedSkillId(value);
										handleAddSkill(value);
									}}
								>
									<SelectTrigger className="w-48">
										<SelectValue placeholder="Select skill" />
									</SelectTrigger>
									<SelectContent>
										{skillsOptions
											.filter(
												(skill: Skill) => !selectedSkills.includes(skill.id),
											)
											.map((skill: Skill) => (
												<SelectItem key={skill.id} value={skill.id}>
													{skill.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										if (skillsOptions.length > 0) {
											const firstAvailableSkill = skillsOptions.find(
												(skill: Skill) => !selectedSkills.includes(skill.id),
											);
											if (firstAvailableSkill) {
												handleAddSkill(firstAvailableSkill.id);
											}
										}
									}}
								>
									<Plus className="h-4 w-4 mr-1" />
									Add
								</Button>
							</div>
						)}
					</div>
					<div className="flex flex-wrap gap-2 mt-2">
						{expertiseSkills.map((skillId) => {
							const skill = skillsOptions.find((s: Skill) => s.id === skillId);
							return (
								<Badge
									key={skillId}
									variant="outline"
									className="flex items-center"
								>
									{skill?.name || skillId}
									{isEditing && (
										<button
											type="button"
											className="ml-2 hover:text-foreground"
											onClick={() => handleRemoveSkill(skillId)}
										>
											<X className="h-3 w-3" />
										</button>
									)}
								</Badge>
							);
						})}
						{expertiseSkills.length === 0 && (
							<p className="text-sm text-muted-foreground">
								No skills selected
							</p>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
