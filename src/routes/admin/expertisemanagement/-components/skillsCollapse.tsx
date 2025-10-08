import { Check, X } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm";
import { Button } from "@/components/ui/button";
import type { Skill } from "@/types";
import { useFetchSkills } from "../-hooks/useFetchSkills";
import { useVerifySkill } from "../-hooks/useVerifySkill";
import { CreateSkillDialog } from "./createSkillDialog";

interface Props {
	expertiseId: string;
}

export default function ExpertiseSkillsCollapse({ expertiseId }: Props) {
	const { data, isLoading } = useFetchSkills(expertiseId);
	const verifySkillMutation = useVerifySkill();

	const handleVerifySkill = (skillId: string) => {
		verifySkillMutation.mutate(skillId);
	};
	const skills: Skill[] = data?.data || [];

	return (
		<div className="bg-muted/30 p-4 border-t border-border/50">
			<div className="flex justify-between items-center mb-3">
				<h4 className="font-semibold text-sm">Skills ({skills.length})</h4>
				<CreateSkillDialog expertiseId={expertiseId} />
			</div>

			{isLoading ? (
				<p className="text-sm text-muted-foreground">Loading skills...</p>
			) : skills.length === 0 ? (
				<p className="text-center text-muted-foreground text-sm py-4">
					No skills added yet. Click "Add Skill" to get started.
				</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
					{skills.map((skill) => (
						<div
							key={skill.id}
							className="flex items-center justify-between bg-background p-2 rounded-md border border-border/50"
						>
							<div className="flex items-center gap-2">
								<span className="text-sm">{skill.name}</span>
								<span
									className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${
										skill.isVerified
											? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
											: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
									}`}
								>
									{skill.isVerified ? (
										<Check className="w-2.5 h-2.5" />
									) : (
										<X className="w-2.5 h-2.5" />
									)}
								</span>
							</div>

							{!skill.isVerified && (
								<ConfirmDialog
									title="Verify Skill"
									description="Are you sure you want to verify this skill?"
									confirmText="Verify"
									variant="default"
									onConfirm={() => handleVerifySkill(skill.id)}
								>
									<Button size="sm" variant="default">
										Verify
									</Button>
								</ConfirmDialog>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
