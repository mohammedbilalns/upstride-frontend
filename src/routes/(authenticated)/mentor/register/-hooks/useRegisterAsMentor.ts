import { useMutation } from "@tanstack/react-query";
import { registerMentor } from "../-services/register-mentor.service";
import type { ApiError } from "@/types";
import { toast } from "sonner";
import type { MentorDetails } from "@/types/mentorDetails";
import { useRouter } from "@tanstack/react-router";

export const useRegisterAsMentor = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: MentorDetails) => registerMentor(data),

    onSuccess: () => {
      toast.success("Request submitted successfully");
      router.navigate({ to: "/home" });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.message || "Failed to register as mentor";
      toast.error(errorMessage);
    },
  });
};
