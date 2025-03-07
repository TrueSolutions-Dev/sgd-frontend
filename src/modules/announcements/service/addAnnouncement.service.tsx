import axios from "axios";

const API_URL = import.meta.env.REACT_APP_API_URL;

export const createAnnouncement = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/announcement`, formData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el anuncio:", error);
    throw error;
  }
};