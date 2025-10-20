import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/auth.store";
import type { ProfileFormData } from "../schemas/profile.schema";
import { updateProfile } from "../services/profile.service";

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
