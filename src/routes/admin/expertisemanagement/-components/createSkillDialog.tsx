import { useState } from "react";
import { useCreateSkill } from "../-hooks/useCreateSkill";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createSkillSchema } from "../-validations/expertise.validation";
import type { createSkillFormValues } from "../-validations/expertise.validation";

interface CreateSkillDialogProps {
  expertiseId: string;
}
export  function CreateSkillDialog({
  expertiseId,
}: CreateSkillDialogProps) {
  const [open, setOpen] = useState(false);
  const createSkillMutation = useCreateSkill({
    onCreateSuccess: () => {
      reset();
      setOpen(false);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<createSkillFormValues>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: createSkillFormValues) => {
    const { name } = data;
    createSkillMutation.mutate({ name, expertiseId });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer"
          size="sm"
          variant="default"
          onClick={() => setOpen(true)}
        >
          Add Skill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
            <DialogDescription>
              Fill out the details and click save when done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={createSkillMutation.isPending}
            >
              {createSkillMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
