import { Plus } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ExpertiseWithSkills } from "./ExpertiseWithSkills";

interface ExpertiseSkillsProps {
	isEditing: boolean;
	expertiseOptions: any[];
	onUpdateSkills: (skills: string[]) => void;
	onRemoveExpertise: (expertiseId: string) => void;
}

export function ExpertiseSkills({
	isEditing,
	expertiseOptions,
	onUpdateSkills,
	onRemoveExpertise,
}: ExpertiseSkillsProps) {
	const form = useFormContext();
	const [newExpertiseId, setNewExpertiseId] = useState("");

	const handleAddExpertise = () => {
		if (
			newExpertiseId &&
			!form.getValues("interestedExpertises")?.includes(newExpertiseId)
		) {
			const currentExpertises = form.getValues("interestedExpertises") || [];
			form.setValue("interestedExpertises", [
				...currentExpertises,
				newExpertiseId,
			]);
			setNewExpertiseId("");
		}
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-medium">Interested Areas & Skills</h3>
				{isEditing && (
					<div className="flex items-center gap-2">
						<Select value={newExpertiseId} onValueChange={setNewExpertiseId}>
							<SelectTrigger className="w-48">
								<SelectValue placeholder="Select expertise" />
							</SelectTrigger>
							<SelectContent>
								{expertiseOptions
									.filter(
										(option: any) =>
											!form
												.getValues("interestedExpertises")
												?.includes(option.id),
									)
									.map((option: any) => (
										<SelectItem key={option.id} value={option.id}>
											{option.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleAddExpertise}
							disabled={!newExpertiseId}
						>
							<Plus className="h-4 w-4 mr-1" />
							Add
						</Button>
					</div>
				)}
			</div>

			{form.watch("interestedExpertises")?.map((expertiseId: string) => (
				<ExpertiseWithSkills
					key={expertiseId}
					expertiseId={expertiseId}
					isEditing={isEditing}
					selectedSkills={form.watch("interestedSkills") || []}
					onUpdateSkills={onUpdateSkills}
					onRemoveExpertise={() => onRemoveExpertise(expertiseId)}
				/>
			))}
		</div>
	);
}
