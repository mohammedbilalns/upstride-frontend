import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ExpertiseArea } from "@/shared/types";
import { useFetchExpertiseAreas, useSaveInterests } from "../hooks/onboarding.hooks";
import { AreaSelectionStep } from "./AreaSelection";
import { TopicSelectionStep } from "./TopicSelectionSteps";

export default function ExpertiseSelection({
	onComplete,
	email,
}: {
	onComplete: () => void;
	email: string | null;
}) {
	const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
	const [selectedTopicsByArea, setSelectedTopicsByArea] = useState<
		Record<string, string[]>
	>({});
	const [activeStep, setActiveStep] = useState<"areas" | "topics">("areas");
	const [currentAreaIndex, setCurrentAreaIndex] = useState(0);

	const { data: expertiseData } = useFetchExpertiseAreas();
	const expertiseAreas: ExpertiseArea[] = expertiseData?.expertises || [];
	const saveInterestsMutation = useSaveInterests();

	const toggleAreaSelection = (areaId: string) => {
		if (selectedAreas.includes(areaId)) {
			setSelectedAreas((prev) => prev.filter((id) => id !== areaId));
			setSelectedTopicsByArea((prev) => {
				const newTopics = { ...prev };
				delete newTopics[areaId];
				return newTopics;
			});
		} else if (selectedAreas.length < 3) {
			setSelectedAreas((prev) => [...prev, areaId]);
		}
	};

	const toggleTopicSelection = (topicId: string) => {
		const currentAreaId = selectedAreas[currentAreaIndex];
		if (!currentAreaId) return;

		setSelectedTopicsByArea((prev) => {
			const areaTopics = prev[currentAreaId] || [];
			if (areaTopics.includes(topicId)) {
				return {
					...prev,
					[currentAreaId]: areaTopics.filter((id) => id !== topicId),
				};
			} else {
				return {
					...prev,
					[currentAreaId]: [...areaTopics, topicId],
				};
			}
		});
	};

	const handleSubmit = async () => {
		const allTopics = Object.values(selectedTopicsByArea).flat();

		saveInterestsMutation.mutate(
			{ selectedAreas, selectedTopics: allTopics, email },
			{
				onSuccess: () => {
					onComplete();
				},
			},
		);
	};

	// Validation checks
	const canProceedToTopics = selectedAreas.length > 0;
	const canSubmit =
		selectedAreas.length > 0 &&
		selectedAreas.every(
			(areaId) => (selectedTopicsByArea[areaId] || []).length > 0,
		);

	const proceedToTopics = () => {
		if (canProceedToTopics) {
			setActiveStep("topics");
			setCurrentAreaIndex(0);
		}
	};

	const goToPreviousArea = () => {
		if (currentAreaIndex > 0) {
			setCurrentAreaIndex((prev) => prev - 1);
		}
	};

	const goToNextArea = () => {
		if (currentAreaIndex < selectedAreas.length - 1) {
			setCurrentAreaIndex((prev) => prev + 1);
		}
	};

	const currentAreaId = selectedAreas[currentAreaIndex];
	const currentArea = expertiseAreas.find((area) => area.id === currentAreaId);
	const currentTopics = selectedTopicsByArea[currentAreaId] || [];

	return (
		<div className="w-full max-w-2xl mx-auto pt-16 ">
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold mb-3 bg-linear-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
					Select Your Expertise
				</h1>
				<p className="text-muted-foreground text-lg">
					Choose up to 3 areas of expertise and select topics within each area
				</p>
			</div>
			<Card className="...">
				<CardHeader className="pb-4">
					<div className="flex justify-between items-center">
						<CardTitle className="text-xl">
							{activeStep === "areas" ? "Areas of Expertise" : "Select Topics"}
						</CardTitle>
						{activeStep === "areas" && (
							<CardDescription>
								{selectedAreas.length}/3 selected
							</CardDescription>
						)}
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{activeStep === "areas" ? (
						<AreaSelectionStep
							selectedAreas={selectedAreas}
							onAreaToggle={toggleAreaSelection}
							onContinue={proceedToTopics}
							expertiseAreas={expertiseAreas}
						/>
					) : (
						<TopicSelectionStep
							currentArea={currentArea}
							selectedTopics={currentTopics}
							currentAreaIndex={currentAreaIndex}
							totalAreas={selectedAreas.length}
							onTopicToggle={toggleTopicSelection}
							onPreviousArea={goToPreviousArea}
							onNextArea={goToNextArea}
							onBack={() => setActiveStep("areas")}
							onSubmit={handleSubmit}
							canSubmit={canSubmit}
							isSubmitting={saveInterestsMutation.isPending}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
