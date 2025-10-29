import { useQuery } from "@tanstack/react-query";
import { fetchMutualConnections } from "@/features/connnections/services/connection.service";

export function useFetchMutualMentors() {
	return useQuery({
		queryKey: ["mutualMentors"],
		queryFn: () => fetchMutualConnections(),
	});
}
