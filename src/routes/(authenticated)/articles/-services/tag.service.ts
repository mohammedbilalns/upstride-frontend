import api from "@/api/api";
import { API_ROUTES } from "@/constants/routes";

export async function fetchMostUsedTags(){
  try{
    const response = await api.get(API_ROUTES.TAGS.FETCH_MOST_USED)
    return response.data

  }catch(error){
    console.error("Error while fetching most used tags", error);
    throw error;
  }
}