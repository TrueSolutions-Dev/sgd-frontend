import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const addData = async (teamData: any) => {
  try {
    const response = await axios.post(`${API_URL}/register`, teamData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar equipo', error);
    throw error;
  }
};
