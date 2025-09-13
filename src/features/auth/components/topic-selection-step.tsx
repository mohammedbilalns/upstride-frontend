import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useFetchSkills } from "@/routes/admin/expertisemanagement/-hooks/useFetchSkills";
import type { ExpertiseArea , Topic } from "@/types";
import { useMemo } from "react";

interface TopicSelectionStepProps {
  currentArea: ExpertiseArea | undefined;
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
}: TopicSelectionStepProps) {
  const { data, isLoading, error } = useFetchSkills(currentArea?.id || "");
  
  const currentTopicsData: Topic[] = useMemo(() => {
    return data?.data || [];
  }, [data]);
  
  const isTopicSelected = (topicId: string) => selectedTopics.includes(topicId);
  const hasSelectedTopics = selectedTopics.length > 0;
  
  return (
    <>
      {/* Area Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousArea} 
          disabled={currentAreaIndex === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalAreas }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentAreaIndex ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              title={`Area ${index + 1}`}
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
      
      {/* Current Area Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-primary">{currentArea?.name}</h3>
        <p className="text-muted-foreground">{currentArea?.description}</p>
      </div>
      
      {/* Topics Grid */}
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
          currentTopicsData.map((topic) => (
            <Badge
              key={topic.id}
              variant={isTopicSelected(topic.id) ? "default" : "outline"}
              className={`cursor-pointer transition-all justify-center py-2 ${
                isTopicSelected(topic.id)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => onTopicToggle(topic.id)}
            >
              {topic.name}
            </Badge>
          ))
        )}
      </div>
      
      {/* Progress Summary */}
      <div className="pt-4 border-t border-border/50">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Area {currentAreaIndex + 1} of {totalAreas}</span>
          <span>
            {selectedTopics.length} of {currentTopicsData.length} topics selected
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{
              width: `${currentTopicsData.length ? (selectedTopics.length / currentTopicsData.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
      
      {/* Action Buttons */}
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
