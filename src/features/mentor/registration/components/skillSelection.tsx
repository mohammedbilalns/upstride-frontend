import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFetchSkills } from "@/features/admin/expertise-mangement/hooks/skills.hooks";
import type { Skill } from "@/shared/types";
import { SkillSkeleton } from "./skillSkeleton";

interface SkillSelectionProps {
  expertiseId: string;
  newSkills: string[];
  setNewSkills: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function SkillSelection({
  expertiseId,
  newSkills,
  setNewSkills,
}: SkillSelectionProps) {
  const { data: response, isLoading } = useFetchSkills(expertiseId);
  const { setValue, watch, formState: { errors } } = useFormContext();

  const [newSkillInput, setNewSkillInput] = useState("");

  const skillOptions = response?.data || [];
  const selectedSkills = watch("skills") || [];

  useEffect(() => {
    if (expertiseId) {
      setValue("skills", []);
      setNewSkills([]);  
    }
  }, [expertiseId, setValue, setNewSkills]);

  const handleSkillChange = (skillId: string, checked: boolean) => {
    const updated = checked
      ? [...selectedSkills, skillId]
      : selectedSkills.filter((id: string) => id !== skillId);
    setValue("skills", updated, { shouldValidate: true });
  };

  const addNewSkill = () => {
    const skill = newSkillInput.trim();
    if (!skill) return;
    if (newSkills.includes(skill)) return;
    if (newSkills.length >= 3) return;
    setNewSkills([...newSkills, skill]);
    setNewSkillInput("");
  };

  const removeNewSkill = (skill: string) => {
    setNewSkills(newSkills.filter((s) => s !== skill));
  };

  if (isLoading) return <SkillSkeleton />;

  return (
    <div className="transition-all duration-300 ease-in-out">
      <FormLabel>Skills</FormLabel>
      <FormDescription className="mb-3">
        Select skills relevant to your expertise (or add up to 3 new ones)
      </FormDescription>

      {/* Existing skills */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {skillOptions.map((skill: Skill) => (
          <FormItem
            key={skill.id}
            className="flex flex-row items-start space-x-3 space-y-0"
          >
            <FormControl>
              <Checkbox
                checked={selectedSkills.includes(skill.id)}
                onCheckedChange={(checked: boolean) =>
                  handleSkillChange(skill.id, checked as boolean)
                }
              />
            </FormControl>
            <FormLabel className="text-sm font-normal">
              {skill.name}
            </FormLabel>
          </FormItem>
        ))}
      </div>

      {/* Add new skills */}
      <div className="flex gap-2 mb-2">
        <Input
          placeholder="Add custom skill..."
          value={newSkillInput}
          onChange={(e) => setNewSkillInput(e.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          onClick={addNewSkill}
          disabled={!newSkillInput.trim() || newSkills.length >= 3}
        >
          Add
        </Button>
      </div>

      {/* Display newly added skills as removable chips */}
      <div className="flex flex-wrap gap-2">
        {newSkills.map((s) => (
          <span
            key={s}
            className="px-3 py-1 bg-primary text-white rounded-full text-xs flex items-center gap-2"
          >
            {s}
            <button type="button" onClick={() => removeNewSkill(s)}>×</button>
          </span>
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
