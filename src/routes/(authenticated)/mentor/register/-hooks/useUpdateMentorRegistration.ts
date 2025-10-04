import type { MentorDetails } from "@/types/mentorDetails";
import { useMutation } from "@tanstack/react-query";
import { updateMentorRegistration } from "../-services/register-mentor.service";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import type { ApiError } from "@/types";


export const useUpdateMentorRegistration = () => {
	const router = useRouter();
  return useMutation({
    mutationFn: (data: MentorDetails) => updateMentorRegistration(data),
    onSuccess: () => {
      toast.success("Request submitted successfully");
      router.navigate({ to: "/home" });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update mentor registration";
      toast.error(errorMessage);
    },
  });
};
