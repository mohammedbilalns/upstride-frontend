import { CheckCircle, ChevronRight, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { ExpertiseArea } from "@/shared/types";

interface AreaSelectionStepProps {
  selectedAreas: string[];
  onAreaToggle: (areaId: string) => void;
  onContinue: () => void;
  expertiseAreas: ExpertiseArea[];
  newAreas: string[];
  setNewAreas: React.Dispatch<React.SetStateAction<string[]>>;
}

export function AreaSelectionStep({
  selectedAreas,
  onAreaToggle,
  onContinue,
  expertiseAreas,
  newAreas,
  setNewAreas
}: AreaSelectionStepProps) {

  const [newAreaName, setNewAreaName] = useState("");

  const handleAddNewArea = () => {
    if (!newAreaName.trim()) return;

    // Save new area name
    setNewAreas(prev => [...prev, newAreaName]);

    // Select it immediately
    onAreaToggle(newAreaName); // passing name instead of id for new areas
    setNewAreaName("");
  };

  return (
    <>
      {/* Add New Area */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add new expertise area..."
          value={newAreaName}
          onChange={(e) => setNewAreaName(e.target.value)}
        />
        <Button onClick={handleAddNewArea}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {/* Areas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {expertiseAreas.length === 0 ? (
          <div className="flex justify-center py-8 col-span-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {expertiseAreas.map((area) => (
              <Card
                key={area.id}
                className={`cursor-pointer transition-all duration-300 h-full ${
                  selectedAreas.includes(area.id)
                    ? "border-primary/50 bg-primary/5 shadow-md"
                    : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                }`}
                onClick={() => onAreaToggle(area.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{area.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {area.description}
                      </p>
                    </div>
                    {selectedAreas.includes(area.id) && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Newly added areas (local only — no id yet) */}
            {newAreas.map((area) => (
              <Card
                key={area}
                className={`cursor-pointer transition-all duration-300 h-full ${
                  selectedAreas.includes(area)
                    ? "border-primary/50 bg-primary/5 shadow-md"
                    : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                }`}
                onClick={() => onAreaToggle(area)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{area}</h3>
                    {selectedAreas.includes(area) && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Continue */}
      <div className="pt-4 flex justify-center">
        <Button
          onClick={onContinue}
          disabled={selectedAreas.length === 0}
          className="w-full max-w-xs"
        >
          Continue to Topic Selection
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
