import { getMentorsForUser } from "@/features/mentor/services/mentor.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useFetchSuggestedMentors = () => {
  return useQuery({
    queryKey: ["suggestedMentors"],
    queryFn: ()=>  getMentorsForUser(),
    placeholderData: keepPreviousData,
  });
};
