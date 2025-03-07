import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const getSiteSettings = async () => {
  const response = await axios.get(`${API_URL}/site-settings`);
  return response.data;
};