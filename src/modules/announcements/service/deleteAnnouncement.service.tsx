import axios from "axios";

const API_URL = import.meta.env.REACT_APP_API_URL;

export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/announcement/${id}`);
  } catch (error) {
    console.error("Error al eliminar el anuncio:", error);
    throw error;
  }
};
