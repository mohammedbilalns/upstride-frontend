import api from "@/api/api";
import { API_ROUTES } from "@/constants/routes";

export async function fetchExpertises(
  page: string,
  limit: string,
  query: string,
) {
  try {
    const response = await api.get(API_ROUTES.EXPERTISE.FETCH, {
      params: { page, limit, query },
    });
    return response.data;
  } catch (error) {
    console.error("Error while fetching expertises", error);
    throw error;
  }
}

export async function fetchSkills(expertiseId: string) {
  try {
    const response = await api.get(
      API_ROUTES.EXPERTISE.FETCH_SKILLS(expertiseId),
    );
    return response.data;
  } catch (error) {
    console.error("Error while fetching skills", error);
    throw error;
  }
}

export async function createSkill(name: string, expertiseId: string) {
  try {
    const response = await api.post(
      API_ROUTES.EXPERTISE.CREATE_SKILL(expertiseId),
      {
        name,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error while creating skill", error);
    throw error;
  }
}

export async function createExpertise(
  name: string,
  description: string,
  skills: string[],
) {
  try {
    const response = await api.post(API_ROUTES.EXPERTISE.CREATE, {
      name,
      description,
      skills,
    });
    return response.data;
  } catch (error) {
    console.error("Error while creating expertise", error);
    throw error;
  }
}

export async function updateExpertise(
  id: string,
  name: string,
  description: string,
) {
  try {
    const response = await api.put(API_ROUTES.EXPERTISE.UPDATE(id), {
      name,
      description,
    });
    return response.data;
  } catch (error) {
    console.error("Error while updating expertise", error);
    throw error;
  }
}

export async function verifyExpertise(id: string) {
  try {
    const response = await api.put(API_ROUTES.EXPERTISE.VERIFY(id));
    return response.data;
  } catch (error) {
    console.error("Error while verifying expertise", error);
    throw error;
  }
}

export async function updateSkill(id: string) {
  try {
    const response = await api.put(API_ROUTES.EXPERTISE.UPDATE_SKILL(id));
    return response.data;
  } catch (error) {
    console.error("Error while updatingskill expertise", error);
    throw error;
  }
}

export async function verifySkill(id: string) {
  try {
    const response = await api.put(API_ROUTES.EXPERTISE.VERIFY_SKILL(id));
    return response.data;
  } catch (error) {
    console.error("Error while verifying skill", error);
    throw error;
  }
}
