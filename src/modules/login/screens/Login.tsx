import { useSiteSettings } from '@/modules/settings/components/SiteSettingsProvider';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid2,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import lottie from 'lottie-web';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import bgImage from '../../../assets/img/bg.jpeg';
import logoImage from '../../../assets/img/logo.png';
import lottieAnim from '../../../assets/lotties/ball-animation.json';
import { loginUser } from '../service/auth.service';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./styleLogin.css"

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/dashboard';
  const [showPassword, setShowPassword] = useState(false);
  const { siteName, siteLogo } = useSiteSettings();
  const themeFont = createTheme({
      typography: {
        fontFamily: "Inter, Arial, sans-serif",
      },
    });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp && decodedToken.exp > currentTime) {
        navigate(redirectUrl);
      }
    }
  }, [navigate, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Por favor ingresa tu usuario y contraseña.',
        confirmButtonColor: '#667652',
      });
      return;
    }

    try {
      const data = await loginUser(username, password);
      localStorage.setItem('token', data.token);

      let timerInterval: number;
      Swal.fire({
        title: 'Iniciando sesión...',
        timer: 2200,
        timerProgressBar: true,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          const lottieContainer = document.getElementById('lottie-animation');
          if (lottieContainer) {
            lottie.loadAnimation({
              container: lottieContainer,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              animationData: lottieAnim,
            });
          }
          const b = Swal.getHtmlContainer()?.querySelector('b');
          timerInterval = window.setInterval(() => {
            const timeLeft = Swal.getTimerLeft();
            if (b && timeLeft !== undefined) {
              b.textContent = timeLeft.toString();
            }
          }, 100);
        },
        html: '<div id="lottie-animation" style="width: 200px; height: 200px; margin: auto;"></div>',
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then(() => {
        navigate(redirectUrl);
      });
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Error desconocido';
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: errorMessage,
          confirmButtonColor: '#667652',
        });
      } else if (error.request) {
        Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'No se pudo conectar con el servidor. Por favor, revisa tu conexión a internet.',
          confirmButtonColor: '#667652',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Ocurrió un error inesperado.',
          confirmButtonColor: '#667652',
        });
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleForgotPassword = () => {
    Swal.fire({
        icon: 'info',
        title: 'Contraseña olvidada',
        text: "Para restablecer tu contraseña, contacta al administrador.",
        confirmButtonText: 'Ok',
        confirmButtonColor: '#667652',
      });
  }

  return (
    <section className='main-container'>
      <Helmet>
        <title>{siteName} - Iniciar sesión</title>
      </Helmet>

      <Grid2
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          zIndex: -1,
          overflow: 'hidden',
        }}
      >
        <img
          src={bgImage}
          alt="Imagen"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Grid2>

      <ThemeProvider theme={themeFont}>
      <Grid2
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          position: 'relative',
          zIndex: 1,
          p: isMobile ? 2 : 0,
          width: '100%',
          height: '100%',
        }}
        className="animation"
      >
        <Container
          maxWidth="xs"
          sx={{
            py: '40px',
            px: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.8)',
          }}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <img src={siteLogo || logoImage} width={isMobile ? 70 : 90} alt="Logo de la Liga" />
            <Typography
              variant={isMobile ? 'body2' : 'subtitle1'}
              align="center"
              sx={{
                letterSpacing: "1.5px",
                mt: 2,
                fontWeight: "bold",
              }}
            >
              {siteName}
            </Typography>
          </Box>
          <br />
          <Typography variant={isMobile ? 'body1' : 'h6'} align="left" 
          sx={{
            letterSpacing: "2px",
            fontWeight: "bold",
          }}
          >
            Iniciar sesión
          </Typography>
          <Typography variant="body2" gutterBottom
          sx={{
            letterSpacing: "1px",
            mt: 2,
            fontSize: '1rem',
          }}
          >
            Ingresa un usuario y contraseña para continuar
          </Typography>
          <br />

          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                variant="outlined"
                required
                label="Introduce tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                  required
                  id="outlined-password-input"
                  label="Introduce tu contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  sx={{
                    mb: 2,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          aria-label="toggle password visibility"
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Chip
                  sx={{marginTop: '10px', color: 'gray', letterSpacing: '1px', mb: 2}}
                  label="Olvidaste tu contraseña?"
                  variant='filled'
                  onClick={handleForgotPassword} />
            </Box>
            <Box mt={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#667652',
                  transition: 'background-color 0.4s ease',
                  letterSpacing: "2px",
                  fontWeight: "600",
                  '&:hover': {
                    backgroundColor: '#5d6b4b',
                  },
                }}
              >
                Entrar
              </Button>
            </Box>
          </form>
        </Container>
      </Grid2>
      </ThemeProvider>
    </section>
  );
};

export default Login;
