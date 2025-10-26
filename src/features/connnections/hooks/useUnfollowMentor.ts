import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/router/routerConfig";
import { unfollowMentor } from "../services/connection.service";

export function useUnfollowMentor() {
	return useMutation({
		mutationFn: (id: string) => unfollowMentor(id),
		onSuccess: () => {
			// TODO: optimistically update later

			queryClient.invalidateQueries({ queryKey: ["following"] });
		},
		onError: () => {
			console.log("Failed to unfollow mentor ");
		},
	});
}
