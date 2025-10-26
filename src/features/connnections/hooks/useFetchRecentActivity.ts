import { useQuery } from "@tanstack/react-query";
import { fetchRecentActivity } from "../services/connection.service";

export function useFetchRecentActivity() {
	return useQuery({
		queryKey: ["recentActivity"],
		queryFn: () => fetchRecentActivity(),
	});
}
