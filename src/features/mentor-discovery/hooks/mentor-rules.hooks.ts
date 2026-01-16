import { useQuery } from "@tanstack/react-query"
import { getMentorRules } from "../services/mentor.service"

export const useFetchMentorRules = (mentorId: string) => {
  return useQuery({
    queryKey: ["mentor-rules", mentorId],
    queryFn: () => getMentorRules()
  })

}
