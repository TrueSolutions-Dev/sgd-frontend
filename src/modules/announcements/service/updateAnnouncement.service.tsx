
import axios from "axios";

const API_URL = import.meta.env.REACT_APP_API_URL;

export const updateAnnouncement = async (
  id: string,
  formData:FormData
): Promise<FormData> => {
  try {
    const response = await axios.put(`${API_URL}/announcement/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el anuncio:", error);
    throw error;
  }
};
