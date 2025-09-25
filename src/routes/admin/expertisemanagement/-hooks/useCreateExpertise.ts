import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createExpertise } from "../-services/expertiseManagement.service";
import type { ApiError } from "@/types";
import { useRouter } from "@tanstack/react-router";

export const useCreateExpertise = (callbacks?: {
  onCreateSuccess?: () => void;
}) => {
const router = useRouter()
  return useMutation({
    mutationFn: ({
      name,
      description,
      skills,
    }: {
      name: string;
      description: string;
      skills: string[];
    }) => createExpertise(name, description, skills),
    onSuccess: (response) => {
      toast.success(response.message);
      callbacks?.onCreateSuccess?.(); 
			router.invalidate({ sync: true });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Expertise creation failed";
      toast.error(errorMessage);
    },
  });
};
