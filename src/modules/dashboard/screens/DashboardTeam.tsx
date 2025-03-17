import { useSiteSettings } from '@/modules/settings/components/SiteSettingsProvider';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import logoImage from '../../../assets/img/logo.png';
import { getDecodedToken } from '../../../utils/auth';
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
        <title>La Liga Ixtlahuaca - Dashboard</title>
      </Helmet>
      <Box sx={{ display: 'flex', flexDirection: "column" }}>
        <Sidebar role="team" />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4, textAlign: 'center' }}>
          <img
            src={siteLogo || logoImage}
            alt="Logo de la Liga"
            style={{ width: '120px', marginTop:'15px' }}
          />
          <Typography
              variant={'subtitle1'}
              align="center"
              sx={{marginBottom: '40px',}}
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


