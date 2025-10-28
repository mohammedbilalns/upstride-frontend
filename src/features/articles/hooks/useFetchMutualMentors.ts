import { fetchMutualConnections } from "@/features/connnections/services/connection.service";
import { useQuery } from "@tanstack/react-query";

export function useFetchMutualMentors() {
	return useQuery({
		queryKey: ["mutualMentors"],
		queryFn: () => fetchMutualConnections(),
	});
}
