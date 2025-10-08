import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { API_ROUTES } from "@/constants/routes";

export const useFetchMentorDetails = (enabled: boolean) => {
	return useQuery({
		queryKey: ["mentorDetails"],
		queryFn: async () => {
			const response = await api.get(API_ROUTES.MENTOR.FETCH_MENTOR_DETAILS);
			return response.data.mentor;
		},
		staleTime: 1000 * 60,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: true,
		enabled,
	});
};
