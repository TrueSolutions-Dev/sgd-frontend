import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const createMatches = async (forceId: string) => {
  try {
    const response = await axios.post(`${API_URL}/matches/create/${forceId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      'Error al crear partidos:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
