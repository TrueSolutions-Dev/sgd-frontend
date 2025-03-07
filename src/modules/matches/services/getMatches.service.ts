import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const getMatches = async (roundIndex: string) => {
  try {
    const response = await axios.get(`${API_URL}/getMatches/${roundIndex}`);
    return response.data;
  } catch (error: any) {
    console.error(
      'Error al crear partidos',
      error.response.data || error.message,
    );
  }
};
