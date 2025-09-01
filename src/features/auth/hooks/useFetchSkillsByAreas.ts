import { fetchSkillsByAreas } from "../services/auth.service";
import { useQuery } from "@tanstack/react-query";

export const useFetchSkillsByAreas = (areas: string[]) => {
  return useQuery({
    queryKey: ["skillsByAreas"],
    queryFn: () => fetchSkillsByAreas(areas),
  });
};
