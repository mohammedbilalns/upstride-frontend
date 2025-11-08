import type { NavigateOptions } from "@tanstack/react-router";
import { Filter } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useFetchActiveExpertisesAndSkills } from "../hooks/mentors-queries.hooks";
import type { MentorsSearchSchema } from "../schemas/mentorsSearchSchema";
import FollowedMentors from "./FollowedMentors";

interface MentorSideBarProps {
	search: MentorsSearchSchema;
	navigate: (options: NavigateOptions) => Promise<void>;
}

export default function MentorSideBar({
	search,
	navigate,
}: MentorSideBarProps) {
	const { data: ExpertisesAndSkillsData, isLoading: isLoadingFilters } =
		useFetchActiveExpertisesAndSkills();

	const id = useId();

	const handleExpertiseChange = (value: string) => {
		navigate({
			search: (prev) => ({
				...prev,
				expertiseId: value === "all" ? undefined : value,
			}),
		});
	};

	const handleSkillChange = (value: string) => {
		navigate({
			search: (prev) => ({
				...prev,
				skillId: value === "all" ? undefined : value,
			}),
		});
	};

	const handleClearFilters = () => {
		navigate({
			search: (prev) => ({
				...prev,
				expertiseId: undefined,
				skillId: undefined,
			}),
		});
	};

	return (
		<div className="w-full md:w-1/4">
			<Card className="mb-6">
				<CardHeader>
					<h2 className="text-lg font-semibold flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Filter Mentors
					</h2>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<label
							htmlFor={`expertise-${id}`}
							className="block text-sm font-medium mb-2"
						>
							Expertise
						</label>
						<Select
							value={search.expertiseId || "all"}
							onValueChange={handleExpertiseChange}
							disabled={isLoadingFilters}
						>
							<SelectTrigger id={`expertise-${id}`}>
								<SelectValue placeholder="All Expertise" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Expertise</SelectItem>
								{ExpertisesAndSkillsData?.expertises?.map(
									(expertise: { id: string; name: string }) => (
										<SelectItem key={expertise.id} value={expertise.id}>
											{expertise.name}
										</SelectItem>
									),
								)}
							</SelectContent>
						</Select>
					</div>
					<div>
						<label
							htmlFor={`skill-${id}`}
							className="block text-sm font-medium mb-2"
						>
							Skills
						</label>
						<Select
							value={search.skillId || "all"}
							onValueChange={handleSkillChange}
							disabled={isLoadingFilters}
						>
							<SelectTrigger id={`skill-${id}`}>
								<SelectValue placeholder="All Skills" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Skills</SelectItem>
								{ExpertisesAndSkillsData?.skills?.map(
									(skill: { id: string; name: string }) => (
										<SelectItem key={skill.id} value={skill.id}>
											{skill.name}
										</SelectItem>
									),
								)}
							</SelectContent>
						</Select>
					</div>
					<div className="flex gap-2">
						<Button
							className="flex-1 cursor-pointer"
							onClick={handleClearFilters}
						>
							Clear Filters
						</Button>
					</div>
				</CardContent>
			</Card>
			<FollowedMentors />
		</div>
	);
}
