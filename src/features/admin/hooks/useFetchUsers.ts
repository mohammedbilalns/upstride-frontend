import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/usermangement.service";

export const useFetchUsers = (page: number, limit: number, query: string) => {
  return useQuery({
    queryKey: ["users", page, limit, query],
    queryFn: ({ queryKey }) => {
      const [, page, limit, query] = queryKey;
      return fetchUsers(page as string, limit as string, query as string);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    placeholderData: keepPreviousData,
  });
};
