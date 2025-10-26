import { useMutation } from "@tanstack/react-query";
import { unfollowMentor } from "../services/connection.service";
import { queryClient } from "@/app/router/routerConfig";

export function useUnfollowMentor() {

	return useMutation({
		mutationFn: (id: string) => unfollowMentor(id),
		onSuccess: () => {
      // TODO: optimistically update later 
      
      queryClient.invalidateQueries({queryKey: ["following"]})
		},
		onError: () => {
			console.log("Failed to unfollow mentor ");
		},
	})

}
