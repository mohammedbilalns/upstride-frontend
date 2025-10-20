import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../services/profile.service";

export const useFetchProfile = (userId: string) => {
	return useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			const response = await fetchProfile(userId);
			return response;
		},
	});
};
