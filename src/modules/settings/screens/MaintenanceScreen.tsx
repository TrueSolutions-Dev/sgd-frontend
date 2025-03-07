import { useSiteSettings } from '@/modules/settings/components/SiteSettingsProvider';
import { Box, Container, Grid as Grid2, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Helmet } from 'react-helmet';
import bgImage from '../../../assets/img/bg.jpeg';
import logoImage from '../../../assets/img/logo.png';

const MaintenanceScreen = () => {
  const { siteName, siteLogo } = useSiteSettings();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Helmet>
        <title>El sitio está en mantenimiento</title>
      </Helmet>
      <Grid2
        container
        alignItems="center"
        justifyContent="center"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          zIndex: -1,
          overflow: 'hidden',
        }}
      >
        <img
          src={bgImage}
          alt="Imagen de fondo"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Grid2>

      <Grid2
        container
        alignItems="center"
        justifyContent="center"
        sx={{
          height: '100vh',
          position: 'relative',
          zIndex: 1,
          p: isMobile ? 2 : 0,
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            padding: isMobile ? '10px' : '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.8)',
            textAlign: 'center',
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <img src={siteLogo || logoImage} width={isMobile ? 70 : 90} alt="Logo de la Liga" />
            <Typography variant={isMobile ? 'body2' : 'subtitle1'} align="center">
              {siteName}
            </Typography>
          </Box>
          <br />
          <Typography variant={isMobile ? 'h5' : 'h4'} align="center" gutterBottom>
            El sitio está en mantenimiento
          </Typography>
          <Typography variant="body1">
            Actualmente estamos realizando mejoras. Vuelve más tarde.
          </Typography>
        </Container>
      </Grid2>
    </>
  );
};

export default MaintenanceScreen;
