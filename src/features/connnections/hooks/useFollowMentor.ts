import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followMentor } from "../services/connection.service";
import type { Mentor } from "@/shared/types/mentor";

export function useFollowMentor() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => followMentor(id),
		onMutate: async (mentorId) => {
			await queryClient.cancelQueries({ queryKey: ["mentors"] });

			const previousMentors = queryClient.getQueryData(["mentors"]);

			queryClient.setQueryData(
				["mentors"],
				(oldData: any) => {
					if (!oldData) return oldData;

					if (oldData.pages) {
						return {
							...oldData,
							pages: oldData.pages.map((page: { mentors: Mentor[] }) => ({
								...page,
								mentors: page.mentors.filter((mentor: Mentor) => mentor.id !== mentorId)
							}))
						};
					}

					return {
						...oldData,
						mentors: oldData.mentors.filter((mentor: Mentor) => mentor.id !== mentorId)
					};
				}
			);

			return { previousMentors };
		},
		onError: (_err, _mentorId, context) => {
			if (context?.previousMentors) {
				queryClient.setQueryData(["mentors"], context.previousMentors);
			}
		},
		onSettled: (mentorId) => {
			queryClient.invalidateQueries({ queryKey: ["mentors"] });
			queryClient.invalidateQueries({ queryKey: ["mentor", mentorId] });
			queryClient.invalidateQueries({ queryKey: ["following"] });
		},
	});
}
