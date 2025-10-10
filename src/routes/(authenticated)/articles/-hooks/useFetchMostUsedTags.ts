import { useQuery } from "@tanstack/react-query"
import { fetchMostUsedTags } from "../-services/tag.service"

export const useFetchMostUsedTags = () => {
  return useQuery({
    queryKey:["mostUsedTags"],
    queryFn: async () => {
      return await fetchMostUsedTags()
    }
  })
}