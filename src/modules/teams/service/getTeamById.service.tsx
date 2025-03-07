import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const getTeamById = async (teamId: string) => {
  try {
    const response = await axios.get(`${API_URL}/team/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener equipo por ID:', error);
    throw error;
  }
};
