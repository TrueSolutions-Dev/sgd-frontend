import axios from 'axios';
import { Team } from '../../../types/Team';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const getData = async ( 
  page: number = 1,
  limit: number = 20,
  filterBy?: string,
  search?: string
): Promise<{
  teams: Team[];
  currentPage: number;
  totalPages: number;
}> => {
  try {
    const response = await axios.get(`${API_URL}/teams`, {
      params: { page, limit, search, filterBy }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};
