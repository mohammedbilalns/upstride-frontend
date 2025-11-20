import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Mentor, MentorDetails, MentorsQueryResult } from "@/shared/types/mentor";
import { followMentor, unfollowMentor } from "../services/connection.service";

export function useFollowMentor() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const [result] = await Promise.all([
				followMentor(id),
        //NOTE: Remove timeout in production
				new Promise((resolve) => setTimeout(resolve, 500)),
			]);
			return result;
		},
		onMutate: async (mentorId) => {
			await queryClient.cancelQueries({ queryKey: ["mentors"] });
      await queryClient.cancelQueries({ queryKey: ["mentor", mentorId] });


			const previousMentors = queryClient.getQueryData(["mentors"]);
      const previousMentorData = queryClient.getQueryData(["mentor", mentorId]);

			queryClient.setQueryData(["mentors"], (oldData: MentorsQueryResult | undefined) => {
				if (!oldData) return oldData;

				if (oldData.pages) {
					return {
						...oldData,
						pages: oldData.pages.map((page: { mentors: Mentor[] }) => ({
							...page,
							mentors: page.mentors.filter(
								(mentor: Mentor) => mentor.id !== mentorId,
							),
						})),
					};
				}
				return {
					...oldData,
					mentors: (oldData.mentors || []).filter(
						(mentor: Mentor) => mentor.id !== mentorId,
					),
				};
			});

      queryClient.setQueryData(["mentor", mentorId], (oldData: MentorDetails | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, isFollowing: true };
      });


			return { previousMentors, previousMentorData };
		},
		onError: (_err, mentorId, context) => {
			if (context?.previousMentors) {
				queryClient.setQueryData(["mentors"], context.previousMentors);
			}
      if (context?.previousMentorData) {
        queryClient.setQueryData(["mentor", mentorId], context.previousMentorData);
      }
		},
		onSuccess: (mentorId) => {
			queryClient.invalidateQueries({ queryKey: ["mentors"] });
			queryClient.invalidateQueries({ queryKey: ["mentor", mentorId] });
			queryClient.invalidateQueries({ queryKey: ["following"] });
		},
	});
}


// FIX: ui not updating in the mentor page 
export function useUnfollowMentor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (mentorId: string) => {
            const [result] = await Promise.all([
                unfollowMentor(mentorId),
                new Promise((resolve) => setTimeout(resolve, 500)),
            ]);
            return result;
        },
        onMutate: async (mentorId) => {
            await queryClient.cancelQueries({ queryKey: ["mentor", mentorId] });
            
            // Snapshot the previous value
            const previousMentorData = queryClient.getQueryData(["mentor", mentorId]);
            
            // Optimistically update to the new value
            queryClient.setQueryData(["mentor", mentorId], (oldData: MentorDetails) => {
                if (!oldData) return oldData;
                return { ...oldData, isFollowing: false };
            });
            // Return a context object with the snapshotted value
            return { previousMentorData };
        },
        onError: (err, mentorId, context) => {
            if (context?.previousMentorData) {
                queryClient.setQueryData(["mentor", mentorId], context.previousMentorData);
            }
            console.log("Failed to follow mentor");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["following"] });
            queryClient.invalidateQueries({ queryKey: ["suggestedMentors"] });
        },
        onSettled: (mentorId) => {
            queryClient.invalidateQueries({ queryKey: ["mentor", mentorId] });
        },
    });
}
