import { useQuery } from "@tanstack/react-query";
import { fetchExpertiseAreas } from "../-services/auth.service";

export const useFetchExpertiseAreas = () => {
	return useQuery({
		queryKey: ["expertiseAreas"],
		queryFn: () => fetchExpertiseAreas(),
	});
};
