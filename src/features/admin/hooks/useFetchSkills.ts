import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchSkills } from "../services/expertiseManagement.service";

export const useFetchSkills = (expertiseId: string) => {
  return useQuery({
    queryKey: ["skills", expertiseId],
    queryFn: ({ queryKey }) => {
      const [, expertiseId] = queryKey;
      return fetchSkills(expertiseId as string);
    },
    placeholderData: keepPreviousData,
  });
};
