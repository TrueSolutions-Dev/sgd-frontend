import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  TextFieldProps,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import Lottie from 'react-lottie';
import Swal from 'sweetalert2';
import loadingAnimation from '../../../assets/lotties/loading.json';
import { addPlayer } from '../../../modules/players/service/addPlayers.service';
import { getForces } from '../../../modules/teams/service/getForces.service';
import { getData } from '../../../modules/teams/service/getTeams.service';
import { Forces } from '../../../types/Forces';
import { Team } from '../../../types/Team';
import { getDecodedToken, getUserRole } from '../../../utils/auth';
import Sidebar from '../../dashboard/screens/SideBar';

const AddPlayers = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState<string>('');
  const [curpPlayer, setCurpPlayer] = useState<string>('');
  const [playerNumber, setplayerNumber] = useState<string>('');
  const [isYounger, setIsYounger] = useState<boolean>(false);
  const [isForeigner, setIsForeigner] = useState<boolean>(false);
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [forces, setForces] = useState<Forces[]>([]);
  const [selectedForce, setSelectedForce] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    photo: null,
    ine: null,
    curp: null,
    proofOfAddress: null,
  });
  const [openPreview, setOpenPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const user = useMemo(() => getDecodedToken(), []);
  const userRole = useMemo(() => getUserRole(), []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchTeamsAndForces = async () => {
      try {
        const [{ teams }, forceData] = await Promise.all([
          getData(1, 0),
          getForces(),
        ]);
        setTeams(teams);
        setForces(forceData);

        if (userRole === 'team' && user?.username) {
          const team = teams.find((team) => team.name === user.username);
          const force = team
            ? forceData.find(
                (force: Forces) => force._id === team.forceId._id,
              )
            : null;
          if (team) {
            setSelectedTeam(team?._id?.toString() || null);
            setSelectedForce(force?._id?.toString() || null);
          }
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchTeamsAndForces();
  }, [userRole, user]);

  const handleFileChange = (fileKey: string, file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'Archivo demasiado grande',
        text: 'Cada archivo debe ser menor a 5MB.',
        confirmButtonColor: '#667652',
      });
      return;
    }
    setFiles((prevFiles) => ({
      ...prevFiles,
      [fileKey]: file,
    }));
  };

  const handleImageClick = (fileKey: string) => {
    if (files[fileKey]) {
      setPreviewImage(URL.createObjectURL(files[fileKey] as Blob));
      setOpenPreview(true);
    }
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewImage(null);
  };

  const handleBirthDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const today = dayjs();
      if (newValue.isAfter(today)) {
        setBirthDateError('La fecha de nacimiento no puede ser futura.');
        setBirthDate(null);
        return;
      }
      if (newValue.isBefore(today.subtract(100, 'years'))) {
        setBirthDateError('La edad del jugador no puede ser mayor a 100 años.');
        setBirthDate(null);
        return;
      }
    }
    setBirthDate(newValue);
    setBirthDateError(null);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!name || name.length < 3) {
        Swal.fire({
          icon: 'warning',
          title: 'Nombre inválido',
          text: 'El nombre del jugador debe tener al menos 3 caracteres.',
          confirmButtonColor: '#667652',
        });
        return;
      }

      if (!curpPlayer || curpPlayer.length < 18) {
        Swal.fire({
          icon: 'warning',
          title: 'CURP inválido',
          text: 'Debes ingresar un CURP correcto.',
          confirmButtonColor: '#667652',
        });
        return;
      }

      if (!birthDate) {
        setBirthDateError('La fecha de nacimiento es requerida');
        return;
      }

      if (!selectedForce) {
        Swal.fire({
          icon: 'warning',
          title: 'Fuerza no seleccionada',
          text: 'Por favor, selecciona la fuerza del jugador.',
          confirmButtonColor: '#667652',
        });
        return;
      }

      if (!selectedTeam) {
        Swal.fire({
          icon: 'warning',
          title: 'Equipo no seleccionado',
          text: 'Por favor, selecciona un equipo para el jugador.',
          confirmButtonColor: '#667652',
        });
        return;
      }

      if (birthDate && birthDate.isAfter(dayjs().subtract(18, 'years'))) {
        Swal.fire({
          icon: 'info',
          title: 'Jugador menor de edad',
          text: 'El jugador es menor de edad. Debes subir una INE de padre o tutor.',
          confirmButtonColor: '#667652',
        });
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (name === 'isYounger') setIsYounger(checked);
    if (name === 'isForeigner') setIsForeigner(checked);
  };

  const handleNameChange = (event: { target: { value: any } }) => {
    const value = event.target.value;

    const sanitizedValue = value.replace(/[^a-zA-ZÑñ\s]/g, '');

    if (sanitizedValue !== value) {
      setError('El nombre no puede contener números ni caracteres especiales.');
    } else {
      setError('');
    }
    setName(sanitizedValue);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const invalidFiles = Object.values(files).filter(
      (file) => file && !validMimeTypes.includes(file.type),
    );

    if (invalidFiles.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Formato de archivo no permitido',
        text: 'Solo se permiten imágenes (JPEG/PNG) y PDFs.',
        confirmButtonColor: '#667652',
      });
      return;
    }

    if (Object.values(files).some((file) => !file)) {
      Swal.fire({
        icon: 'warning',
        title: 'Documentación incompleta',
        text: 'Por favor, completa todos los documentos antes de enviar.',
        confirmButtonColor: '#667652',
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('curpPlayer', curpPlayer);
    formData.append('playerNumber', playerNumber);
    formData.append('isYounger', isYounger ? 'true' : 'false');
    formData.append('isForeigner', isForeigner ? 'true' : 'false');
    formData.append('birthDate', birthDate!.toISOString());
    formData.append('forceId', selectedForce!);
    formData.append('teamId', selectedTeam!);
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });
    setIsLoading(true);
    try {
      await addPlayer(formData);
      Swal.fire({
        icon: 'success',
        title: 'Jugador agregado exitosamente',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#667652',
      });
      resetForm();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error al agregar jugador',
        text:
          error.response?.data?.error || error.message || 'Error desconocido',
        confirmButtonColor: '#667652',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const resetForm = () => {
    if (userRole === 'admin') {
      setSelectedForce(null);
      setSelectedTeam(null);
    }
    setName('');
    setCurpPlayer('');
    setplayerNumber('');
    setIsYounger(false);
    setIsForeigner(false);
    setBirthDate(null);
    setBirthDateError(null);
    setFiles({ photo: null, ine: null, curp: null, proofOfAddress: null });
    setActiveStep(0);
  };

  const renderFileInput = (label: string, fileKey: string, accept: string) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1" sx={{ mb: 1 }}>
        {label}
      </Typography>
      {files[fileKey] && (
        <Box
          component="img"
          src={URL.createObjectURL(files[fileKey] as Blob)}
          alt={label}
          sx={{
            width: 100,
            height: 100,
            objectFit: 'cover',
            display: 'block',
            mb: 1,
            cursor: 'pointer',
          }}
          onClick={() => handleImageClick(fileKey)}
        />
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ justifyContent: 'start' }}
        >
          {files[fileKey] ? files[fileKey]?.name : `Subir ${label.toLowerCase()}`}
          <input
            type="file"
            accept={accept}
            name={fileKey}
            hidden
            onChange={(e) =>
              handleFileChange(
                fileKey,
                e.target.files ? e.target.files[0] : null,
              )
            }
          />
        </Button>
      </Box>
      {files[fileKey] && (
        <Box sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleFileChange(fileKey, null)}
          >
            Eliminar {label.toLowerCase()}
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Helmet>
        <title>La Liga Ixtlahuaca - Agregar jugadores</title>
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
          <Lottie options={defaultOptions} height={200} width={200} />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100dvh',
            overflowY: "hidden"
          }}
        >
          <Sidebar role={userRole === 'team' ? 'team' : 'admin'} />
          <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: isMobile ? "" : "center",
            overflowY: "auto",
            py: 2,
          }}
          >
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                px: 2,
                py: 3,
                width: '100%',
                maxWidth: 600,
                overflow: 'auto',
                mx: "auto"
              }}
            >
              <Stepper activeStep={activeStep}>
                {['Información del Jugador', 'Documentación'].map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {activeStep === 0 && (
                  <Box sx={{ mt: 4 }}>
                    <TextField
                      required
                      label="Nombre del jugador"
                      value={name}
                      onChange={handleNameChange}
                      fullWidth
                      sx={{ marginBottom: 2 }}
                      error={!!error}
                      helperText={error || 'Ingrese solo letras y espacios'}
                    />
                    <TextField
                      required
                      label="CURP del jugador"
                      value={curpPlayer}
                      onChange={(e) => setCurpPlayer(e.target.value)}
                      fullWidth
                      sx={{ marginBottom: 2 }}
                      error={!!error}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileDatePicker
                        label="Fecha de nacimiento"
                        value={birthDate}
                        onChange={handleBirthDateChange}
                        slotProps={{
                          textField: {
                            error: !!birthDateError,
                            helperText: birthDateError,
                            required: true,
                          } as TextFieldProps,
                        }}
                      />
                    </LocalizationProvider>
                    <TextField
                      required
                      select
                      label="Fuerza"
                      disabled={userRole === 'team'}
                      value={selectedForce ?? ''}
                      onChange={(e) => setSelectedForce(e.target.value)}
                      fullWidth
                      sx={{ marginBottom: 2, marginTop: 2 }}
                    >
                      {forces.map((force) => (
                        <MenuItem key={force._id} value={force._id}>
                          {force.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      required
                      select
                      label="Equipo"
                      disabled={userRole === 'team'}
                      value={selectedTeam ?? ''}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      fullWidth
                      sx={{ marginBottom: 2 }}
                    >
                      {teams.map((team) => (
                        <MenuItem key={team._id} value={team._id}>
                          {team.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      required
                      type="number"
                      label="Número del jugador"
                      value={playerNumber}
                      onChange={(e) => setplayerNumber(e.target.value)}
                      fullWidth
                      sx={{ marginBottom: 2 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="isYounger"
                          checked={isYounger}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label="Juvenil"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="isForeigner"
                          checked={isForeigner}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label="Foráneo"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button disabled={activeStep === 0} onClick={handleBack}>
                        Atrás
                      </Button>
                      <Button variant="contained" onClick={handleNext}>
                        Siguiente
                      </Button>
                    </Box>
                  </Box>
                )}

                {activeStep === 1 && (
                  <Box sx={{ mt: 4 }}>
                    {renderFileInput('Foto del jugador', 'photo', 'image/*')}
                    {renderFileInput('INE', 'ine', 'image/*,application/pdf')}
                    {renderFileInput('CURP', 'curp', 'image/*,application/pdf')}
                    {renderFileInput(
                      'Constancia de domicilio',
                      'proofOfAddress',
                      'image/*,application/pdf',
                    )}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2,
                      }}
                    >
                      <Button onClick={handleBack}>Atrás</Button>
                      <Button variant="contained" color="primary" type="submit">
                        Guardar
                      </Button>
                    </Box>
                  </Box>
                )}
              </form>
            </Box>
          </Box>
          
        </Box>
      )}

      {previewImage && (
        <Dialog open={openPreview} onClose={handleClosePreview}>
          <DialogContent>
            <img src={previewImage} alt="Preview" style={{ width: '100%' }} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AddPlayers;
