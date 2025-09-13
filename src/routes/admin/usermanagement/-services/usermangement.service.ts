import api from "@/api/api";
import { API_ROUTES } from "@/constants/routes";

export async function fetchUsers(page: string, limit: string, query: string) {
  try {
    const response = await api.get(API_ROUTES.USERMANAGEMENT.USERS, {
      params: { page, limit, query },
    });
    return response.data;
  } catch (error) {
    console.error("Error while fetching users", error);
    throw error;
  }
}

export async function blockUser(userId: string) {
  try {
    const response = await api.post(API_ROUTES.USERMANAGEMENT.BLOCK(userId));
    return response.data;
  } catch (error) {
    console.error("Error while blocking user", error);
    throw error;
  }
}

export async function unblockUser(userId: string) {
  try {
    const response = await api.post(API_ROUTES.USERMANAGEMENT.UNBLOCK(userId));
    return response.data;
  } catch (error) {
    console.error("Error while unblocking user", error);
    throw error;
  }
}
