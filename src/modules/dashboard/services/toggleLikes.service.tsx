import { Announcement } from "@/types/Announcement";
import axios from "axios";

const API_URL = import.meta.env.REACT_APP_API_URL;

export const updateAnnouncementLikes = async (announcementId: string): Promise<Announcement> => {
  try {
    const response = await axios.patch(`${API_URL}/announcement/${announcementId}/like`);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar los likes:", error);
    throw error;
  }
};
