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
  const [newAreas, SetNewAreas] = useState<string[]>([]);
  const [newTopics, SetNewTopics] = useState<Array<{name: string, expertiseId?: string, expertiseName? : string}>>([]);
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
    // existing expertise ids only (filter out new expertise names)
    const existingAreaIds = selectedAreas.filter(
      (area) => expertiseAreas.some((e) => e.id === area)
    );

    // topics of only existing topics (remove new topic names)
    const selectedExistingTopicIds = Object.entries(selectedTopicsByArea)
    .flatMap(([areaId, topics]) =>
      topics.filter(
        (topicId) =>
          // topic belongs to existing expertise AND exists on server
          expertiseAreas.some((e) => e.id === areaId) &&
            !newTopics.some((t) => t.name === topicId)
      )
    );

    // final payload (clean)
    const payload = {
      email,
      selectedAreas: existingAreaIds,
      selectedTopics: selectedExistingTopicIds,
      newExpertises: newAreas,
      newTopics
    };

    saveInterestsMutation.mutate(payload, {
      onSuccess: () => onComplete(),
    });
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
  const currentArea =
    expertiseAreas.find((area) => area.id === currentAreaId) ||
      (newAreas.includes(currentAreaId)
        ? { id: null, name: currentAreaId, description: "" }
        : undefined);
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
              newAreas={newAreas}
              setNewAreas={SetNewAreas}
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
                newTopics={newTopics}
                setNewTopics={SetNewTopics}
              />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
