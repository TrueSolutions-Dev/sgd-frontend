import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import logoImage from '../../../assets/img/logo.png';
import { getDecodedToken } from '../../../utils/auth';
import { useSiteSettings } from '../../settings/components/SiteSettingsProvider';
import AnimatedText from '../components/AnimatedText';
import Announcements from '../components/AnnouncementsDash';
import Sidebar from './SideBar';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const DashboardAdmin = () => {
  const user = useMemo(() => getDecodedToken(), []);
  const { siteName, siteLogo } = useSiteSettings();
  const themeFont = createTheme({
    typography: {
      fontFamily: "Inter, Arial, sans-serif",
    },
  });
  
  return (
    <div>
      <Helmet>
        <title>{siteName} - Dashboard</title>
      </Helmet>
      <Box sx={{ display: 'flex', flexDirection: "column", height: "100dvh", overflowY: "hidden" }}>
        <Sidebar role="admin" />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4, textAlign: 'center', overflowY: "auto" }}>
          <img
            src={siteLogo || logoImage}
            alt="Logo de la Liga"
            style={{ width: '110px', marginTop:'15px' }}
          />
          <Typography
              variant={'subtitle1'}
              align="center"
              sx={{marginBottom: '10px', fontFamily: "Inter", letterSpacing: "2px"}}
            >
              {siteName}
            </Typography>
          <ThemeProvider theme={themeFont}>
          <Announcements/>
          </ThemeProvider>
          <AnimatedText/>
        </Box>
      </Box>
    </div>
  );
};

export default DashboardAdmin;
