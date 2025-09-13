import type { FormValues } from "../-validations/expertise.validation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExpertiseSchema } from "../-validations/expertise.validation";
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
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/mulit-select";
import { useCreateExpertise } from "../-hooks/useCreateExpertise";
import { useState } from "react";

export default function CreateExpertiseDialog() {
  const [open, setOpen] = useState(false);

  const createExpertiseMutation = useCreateExpertise({
    onCreateSuccess: () => {
      reset();
      setOpen(false);
    },
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(createExpertiseSchema),
    defaultValues: {
      name: "",
      description: "",
      skills: [],
    },
  });

  const onSubmit = (data: FormValues) => {
    const { skills, ...rest } = data;
    const mappedSkills = skills.map((item) => item.value);
    createExpertiseMutation.mutate({ ...rest, skills: mappedSkills });
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
          Add Expertise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Expertise</DialogTitle>
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

          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-3">
            <Label>Skills</Label>
            <Controller
              control={control}
              name="skills"
              render={({ field }) => (
                <MultiSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={[]}
                  creatable
                  onCreate={(newValue: string) => ({
                    label: newValue,
                    value: newValue,
                  })}
                />
              )}
            />
            {errors.skills && (
              <p className="text-sm text-red-500">{errors.skills.message}</p>
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
              disabled={createExpertiseMutation.isPending}
            >
              {createExpertiseMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
