import { useQuery } from "@tanstack/react-query";
import { getActiveExpertisesAndSkills } from "../services/mentor.service";


export const useFetchActiveExpertisesAndSkills = () => {
   return useQuery({
		queryKey: ["activeExpertisesAndSkills"],
		queryFn: getActiveExpertisesAndSkills,
	}) 
};
