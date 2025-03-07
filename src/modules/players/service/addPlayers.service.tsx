import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const addPlayer = async (playerData: FormData) => {
  const response = await axios.post(`${API_URL}/player/create`, playerData, {});
  return response.data;
};
