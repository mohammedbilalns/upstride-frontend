import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, updateProfile } from "../services/profile.service";
import { useAuthStore } from "@/app/store/auth.store";
import { toast } from "sonner";
import type { ProfileFormData } from "../schemas/profile.schema";
import type { ApiError } from "@/shared/types";

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
		onSuccess: (data) => {
			toast.success("Password updated successfully");
			console.log("Password updated successfully", data);
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message;
			toast.error(errorMessage);
			console.error(errorMessage);
		},
	});
};

export const useUpdateProfile = () => {
	const queryClient = useQueryClient();
	const { user, setUser } = useAuthStore();

	return useMutation({
		mutationFn: (data: ProfileFormData) => updateProfile(data),
		onSuccess: (_, variables) => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries({ queryKey: ["profile"] });

			if (variables.profilePicture && user) {
				const updatedUser = {
					...user,
          // FIX:  type error
					profilePicture: variables.profilePicture?.secure_url,
				};
				setUser(updatedUser);
			}
		},
		onError: (error) => {
			toast.error("Error while updating profile");
			console.error("error while updating profile", error);
		},
	});
};
