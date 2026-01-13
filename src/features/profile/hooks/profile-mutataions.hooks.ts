import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, updateProfile } from "../services/profile.service";
import { useAuthStore } from "@/app/store/auth.store";
import { toast } from "sonner";
import type { ProfileFormData } from "../schemas/profile.schema";
import type { ApiError } from "@/shared/types";

/**
 *  Handles password change using React Query mutation
 *
 * - Sends old & new password to backend
 * - Shows success/error notifications
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      return await changePassword({ oldPassword, newPassword });
    },
    onSuccess: () => {
      toast.success("Your password has been successfully updated.");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message ||
        "We encountered an issue while updating your password. Please try again.";
      toast.error(errorMessage);
      console.error(errorMessage);
    },
  });
};

/**
 * Handles user profile updates
 *
 * - Sends the updated profile data to backend
 * - Updates global user state (Zustand store)
 * - Invalidates cached profile data (React Query)
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: ProfileFormData) => updateProfile(data),
    onSuccess: (_, variables) => {
      toast.success("Your profile information has been successfully updated.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      if (variables.profilePicture && user) {
        const profilePictureUrl =
          typeof variables.profilePicture === 'string'
            ? variables.profilePicture
            : (variables.profilePicture as { secure_url: string }).secure_url;
        const updatedUser = {
          ...user,
          profilePicture: profilePictureUrl,
        };
        setUser(updatedUser);
      }
    },
    onError: (error) => {
      toast.error("We encountered an issue while updating your profile. Please try again.");
      console.error("error while updating profile", error);
    },
  });
};
