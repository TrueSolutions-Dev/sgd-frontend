import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const updatePlayerData = async (
  playerId: number,
  formData: FormData,
) => {
  try {
    const response = await axios.put(
      `${API_URL}/player/${playerId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error al actualizar jugador', error);
    throw error;
  }
};
