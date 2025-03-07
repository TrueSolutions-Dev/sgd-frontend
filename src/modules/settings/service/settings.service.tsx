import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const updateSiteSettings = async (settingsData: {
  maintenanceMode: boolean;
  siteName: string;
  logoFile?: File;
}) => {
  const formData = new FormData();
  formData.append("maintenanceMode", settingsData.maintenanceMode.toString());
  formData.append("siteName", settingsData.siteName);

  if (settingsData.logoFile) {
    formData.append("logo", settingsData.logoFile);
  }

  const response = await axios.post(`${API_URL}/site-settings`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
