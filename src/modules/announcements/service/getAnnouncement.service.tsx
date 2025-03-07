import { Announcement } from "@/types/Announcement";
import axios from "axios";

const API_URL = import.meta.env.REACT_APP_API_URL;

export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response = await axios.get<Announcement[]>(`${API_URL}/announcements`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los anuncios:", error);
    throw error;
  }
};
