import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMentorsForUser } from "@/features/mentor/services/mentor.service";

export const useFetchSuggestedMentors = () => {
	return useQuery({
		queryKey: ["suggestedMentors"],
		queryFn: () => getMentorsForUser(),
		placeholderData: keepPreviousData,
	});
};
