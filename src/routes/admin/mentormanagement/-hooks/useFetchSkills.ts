import { useQuery } from "@tanstack/react-query";
import { fetchSkills } from "../../expertisemanagement/-services/expertiseManagement.service";

export const useFetchSkills = (expertiseId: string) => {
  return useQuery({
    queryKey: ["skills", expertiseId],
    queryFn: () => fetchSkills(expertiseId),
    enabled: !!expertiseId, 
    staleTime: 0, 
    gcTime: 0, 
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
};
