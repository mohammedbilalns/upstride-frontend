import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfollowMentor } from "../services/connection.service";

export function useUnfollowMentor() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => unfollowMentor(id),
		onSuccess: () => {
			// TODO: optimistically update later

			queryClient.invalidateQueries({ queryKey: ["following"] });
		},
		onError: () => {
			console.log("Failed to unfollow mentor ");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["following"] });
			queryClient.invalidateQueries({ queryKey: ["suggestedMentors"] });
		},
	});
}
