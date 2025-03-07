import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const getForces = async () => {
  const response = await axios.get(`${API_URL}/get-forces`);
  return response.data;
};
