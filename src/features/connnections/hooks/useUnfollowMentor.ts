import { useMutation } from "@tanstack/react-query";
import { unfollowMentor } from "../services/connection.service";

export function useUnfollowMentor() {

	return useMutation({
		mutationFn: (id: string) => unfollowMentor(id),
		onSuccess: () => {
			console.log("unfollow mentor success");
		},
		onError: () => {
			console.log("unfollow mentor error");
		},
	})

}
