import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchSkills } from "@/features/admin/expertise-mangement/hooks/skills.hooks";
import type { ExpertiseArea, Topic } from "@/shared/types";

interface TopicSelectionStepProps {
  currentArea: ExpertiseArea |  { id: null; name: string; description: string; }  | undefined;
  selectedTopics: string[];
  currentAreaIndex: number;
  totalAreas: number;
  onTopicToggle: (topicId: string) => void;
  onPreviousArea: () => void;
  onNextArea: () => void;
  onBack: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
  newTopics: Array<{ name: string; expertiseId?: string; expertiseName?: string }>;
  setNewTopics: React.Dispatch<
  React.SetStateAction<
  Array<{ name: string; expertiseId?: string; expertiseName?: string }>
>
>;
}

export function TopicSelectionStep({
  currentArea,
  selectedTopics,
  currentAreaIndex,
  totalAreas,
  onTopicToggle,
  onPreviousArea,
  onNextArea,
  onBack,
  onSubmit,
  canSubmit,
  isSubmitting,
  newTopics,
  setNewTopics
}: TopicSelectionStepProps) {
  const { data, isLoading, error } = useFetchSkills(currentArea?.id || "");
  const [newTopicName, setNewTopicName] = useState("");

  const currentTopicsData: Topic[] = useMemo(() => {
    const serverTopics = currentArea?.id ? data?.data || [] : [];
    const localTopics = newTopics
    .filter(
      (t) =>
        t.expertiseId === currentArea?.id ||
          t.expertiseName === currentArea?.name
    )
    .map((t) => ({ id: t.name, name: t.name }));

    return [...serverTopics, ...localTopics];
  }, [data, newTopics, currentArea]);

  const isTopicSelected = (topicId: string) => selectedTopics.includes(topicId);

  const handleAddNewTopic = () => {
    const name = newTopicName.trim();
    if (!name || !currentArea) return;

    const payload = currentArea.id
      ? { name, expertiseId: currentArea.id }
      : { name, expertiseName: currentArea.name };

    setNewTopics((prev) => [...prev, payload]);
    onTopicToggle(name); // auto select new topic
    setNewTopicName("");
  };

  const progressIndicators = Array.from({ length: totalAreas }, (_, i) => `progress-${i}`);
  const hasSelectedTopics = selectedTopics.length > 0;

  return (
    <>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={onPreviousArea} disabled={currentAreaIndex === 0}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>

        <div className="flex items-center space-x-2">
          {progressIndicators.map((key, index) => (
            <div
              key={key}
              className={`w-3 h-3 rounded-full ${
index === currentAreaIndex ? "bg-primary" : "bg-muted-foreground/30"
}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onNextArea}
          disabled={currentAreaIndex === totalAreas - 1 || !hasSelectedTopics}
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Area header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-primary">{currentArea?.name}</h3>
        <p className="text-muted-foreground">{currentArea?.description}</p>
      </div>

      {/* Add new topic input */}
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Add new topic..."
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
        />
        <Button onClick={handleAddNewTopic}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {/* Topics List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2">
        {isLoading ? (
          <div className="flex justify-center py-8 col-span-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
            <div className="col-span-full text-center text-destructive py-4 flex flex-col items-center">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p>Error loading topics. Please try again.</p>
            </div>
          ) : currentTopicsData.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-4">
                No topics available for this area.
              </div>
            ) : (
                currentTopicsData.map((topic) => {
                  const isLocalNewTopic = newTopics.some(
                    (t) =>
                      t.name === topic.name &&
                        (t.expertiseId === currentArea?.id ||
                          t.expertiseName === currentArea?.name)
                  );

                  return (
                    <div key={topic.id} className="relative">
                      <Badge
                        variant={isTopicSelected(topic.id) ? "default" : "outline"}
                        onClick={() => onTopicToggle(topic.id)}
                        className={`cursor-pointer transition-all justify-center py-2 w-full text-center ${
isTopicSelected(topic.id)
? "bg-primary text-primary-foreground"
: "hover:bg-primary/10"
}`}
                      >
                        {topic.name}
                      </Badge>

                      {/* Remove button for newly added topics */}
                      {isLocalNewTopic && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewTopics((prev) =>
                              prev.filter(
                                (t) =>
                                  !(
                                    t.name === topic.name &&
                                      (t.expertiseId === currentArea?.id ||
                                        t.expertiseName === currentArea?.name)
                                  )
                              )
                            );
                            if (isTopicSelected(topic.id)) {
                              onTopicToggle(topic.id); // unselect if selected
                            }
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs hover:bg-destructive/80"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })
              )}
      </div>

      {/* Progress */}
      <div className="pt-4 border-t border-border/50">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Area {currentAreaIndex + 1} of {totalAreas}
          </span>
          <span>
            {selectedTopics.length} of {currentTopicsData.length} topics selected
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{
              width: `${currentTopicsData.length
? (selectedTopics.length / currentTopicsData.length) * 100
: 0}%`,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Areas
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="w-full max-w-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
              "Complete Setup"
            )}
        </Button>
      </div>
    </>
  );
}
