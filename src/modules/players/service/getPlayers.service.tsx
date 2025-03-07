import { Player } from '@/types/Player';
import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const getPlayers = async (
  page: number = 1,
  limit: number = 20,
  search?: string,
  filterBy?: string,
  showInactive: boolean = false,
  teamId?: string
): Promise<{
  players: Player[];
  currentPage: number;
  totalPages: number;
}> => {
  try {
    const response = await axios.get(`${API_URL}/players`, {
      params: { page, limit, search, filterBy, showInactive, teamId },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener jugadores:', error);
    throw error;
  }
};
