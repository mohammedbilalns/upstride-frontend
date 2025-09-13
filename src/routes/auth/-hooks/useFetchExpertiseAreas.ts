import { fetchExpertiseAreas } from "../-services/auth.service";
import { useQuery } from "@tanstack/react-query";

export const useFetchExpertiseAreas = () => {
  return useQuery({
    queryKey: ["expertiseAreas"],
    queryFn: () => fetchExpertiseAreas(), 
  });
};
