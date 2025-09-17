import api from "@/api/api";
import { API_ROUTES } from "@/constants/routes";
import type { MentorDetails } from "@/types/mentorDetails";

export async function registerMentor(data: MentorDetails) {
  try {
    const response = await api.post(API_ROUTES.MENTOR.CREATE, data);
    return response.data;
  } catch (err) {
    console.error("error while registering as mentor", err);
    throw err;
  }
}
