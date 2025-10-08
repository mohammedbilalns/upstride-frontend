import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchExpertises } from "../-services/expertiseManagement.service";

export const useFetchExpertises = (
	page: number,
	limit: number,
	query: string,
) => {
	return useQuery({
		queryKey: ["expertises", page, limit, query],
		queryFn: ({ queryKey }) => {
			const [, page, limit, query] = queryKey;
			return fetchExpertises(page as string, limit as string, query as string);
		},
		placeholderData: keepPreviousData,
	});
};
