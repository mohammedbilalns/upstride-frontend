import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";

export async function fetchChat(chatId: string,page =1,limit=10){
  try {
    const response = await api.get(API_ROUTES.CHATS.FETCH_CHAT(chatId), {
      params: {
        page,
        limit
      }
    })
    return response.data

  } catch (error) {
    console.error("error while fetching chat", error);
    throw error;
  }
}

export async function fetchChats( page=1, limit =10){
  try {
    const response = await api.get(API_ROUTES.CHATS.FETCH,{
      params:{
        page,
        limit
      }
    })
    return response.data


  } catch (error) {
    console.error("error while fetching chats", error)
    throw error
  }
}

