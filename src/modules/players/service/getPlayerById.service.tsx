import axios from 'axios';
import { Player } from '../../../types/Player';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const findById = async (id: string): Promise<Player | null> => {
  try {
    const response = await axios.get(`${API_URL}/player/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al buscar jugador por ID:', error);
    throw new Error('Error al buscar jugador');
  }
};
