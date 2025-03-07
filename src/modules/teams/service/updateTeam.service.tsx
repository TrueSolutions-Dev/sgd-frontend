import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const updateTeamData = async (id: number, teamData: any) => {
  try {
    const response = await axios.put(`${API_URL}/team/${id}`, teamData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar equipo', error);
    throw error;
  }
};
