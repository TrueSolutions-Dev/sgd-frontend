import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSiteSettings } from '../service/getSettings.service';

interface SiteSettingsContextType {
  siteName: string;
  siteLogo: string | null;
  maintenanceMode: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteName, setSiteName] = useState('Cargando...');
  const [siteLogo, setSiteLogo] = useState<string | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const { siteName, siteLogo, maintenanceMode } = await getSiteSettings();
        setSiteName(siteName);
        setSiteLogo(`${import.meta.env.REACT_APP_BASE_URL}/${siteLogo}`);
        setMaintenanceMode(maintenanceMode);
      } catch (error) {
        console.error('Error al obtener la configuración del sitio:', error);
      }
    };
    fetchSiteSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ siteName, siteLogo, maintenanceMode }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings debe ser utilizado dentro de SiteSettingsProvider');
  }
  return context;
};
