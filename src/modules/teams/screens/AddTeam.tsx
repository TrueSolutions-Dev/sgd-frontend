import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, InputAdornment, MenuItem, TextField, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Lottie from 'react-lottie';
import Swal from 'sweetalert2';
import loadingAnimation from '../../../assets/lotties/loading.json';
import { getDecodedToken, getUserRole } from '../../../utils/auth';
import Sidebar from '../../dashboard/screens/SideBar';
import { addData } from '../service/addTeam.service';
import { getForces } from '../service/getForces.service';

const AddTeam = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [representative, setRepresentative] = useState('');
  const [owner, setOwner] = useState('');
  const [selectedForce, setSelectedForce] = useState('');
  const [forces, setForces] = useState<Force[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const userRole = getUserRole();
  const userTeam = getDecodedToken()?.teamId;

  useEffect(() => {
    const loadForces = async () => {
      try {
        const data = await getForces();
        setForces(data);
      } catch (error) {
        console.error('Error al cargar las fuerzas', error);
      }
    };

    loadForces();
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  interface Force {
    _id: string;
    name: string;
  }

  const clearFields = () => {
    setName('');
    setPassword('');
    setRepresentative('');
    setOwner('');
    setSelectedForce('');
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTeam = {
      username: name,
      password,
      forceId:
        userRole === 'team'
          ? userTeam
          : forces.find((force) => force.name === selectedForce)?._id,
      representative,
      owner,
    };

    setIsLoading(true);
    try {
      await addData(newTeam);
      Swal.fire({
        icon: 'success',
        title: 'Equipo agregado exitosamente',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#667652',
      }).then(() => clearFields());
    } catch (error: any) {
      console.error('Error al agregar equipo', error);

      Swal.fire({
        icon: 'error',
        title: 'Error al agregar equipo',
        text:
          error.response?.data?.message || error.message || 'Error desconocido',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#667652',
      });
    }finally{
      setIsLoading(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <>
      <Helmet>
        <title>La Liga Ixtlahuaca - Agregar equipos</title>
      </Helmet>

      {isLoading ? (
        <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              width: '100vw',
            }}
          >
            <Lottie
              options={defaultOptions}
              height={200}
              width={200}
            />
          </Box>
      ) :
      <form onSubmit={handleSubmit} style={{height: "100dvh", overflowY: "hidden"}}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Sidebar role={userRole === 'team' ? 'team' : 'admin'} />

          <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            overflowY: "auto",
          }}
          >
            <Box
              component="main"
              sx={{ flexGrow: 1, p: 2, pt: 3, width: '100%', maxWidth: 600 }}
            >
              <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
                Agregar equipos
              </h2>
              <Box sx={{ mb: 2 }}>
                <p style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                  El <b>nombre del equipo</b> y <b>contraseña</b> son los datos de
                  acceso para cada equipo.
                </p>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  required
                  id="outlined-required"
                  label="Nombre del equipo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth={isMobile}
                />
                  <TextField
                    required
                    id="outlined-password-input"
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth={isMobile}
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
                {userRole === 'admin' && (
                  <TextField
                    required
                    id="outlined-select-currency"
                    select
                    label="Fuerza"
                    value={selectedForce}
                    onChange={(e) => setSelectedForce(e.target.value)}
                    fullWidth={isMobile}
                  >
                    {forces.map((force) => (
                      <MenuItem key={force._id} value={force.name}>
                        {force.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                <TextField
                  id="outlined-required-owner"
                  label="Dueño del equipo"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  fullWidth={isMobile}
                />
                <TextField
                  id="outlined-required-representative"
                  label="Representante del equipo"
                  value={representative}
                  onChange={(e) => setRepresentative(e.target.value)}
                  fullWidth={isMobile}
                />
                <Button
                  type="submit"
                  fullWidth={isMobile}
                  variant="contained"
                  sx={{
                    backgroundColor: '#667652',
                    '&:hover': {
                      backgroundColor: '#5d6b4b',
                    },
                  }}
                >
                  Agregar
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
      }
    
    </>
  );
};

export default AddTeam;
