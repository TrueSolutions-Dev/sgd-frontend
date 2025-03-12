import { useSiteSettings } from '@/modules/settings/components/SiteSettingsProvider';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Pagination,
  Skeleton,
  Typography
} from '@mui/material';
import React, { lazy, startTransition, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import Swal from 'sweetalert2';
import { Forces } from '../../../types/Forces';
import { Player } from '../../../types/Player';
import { Team } from '../../../types/Team';
import { getDecodedToken, getUserRole } from '../../../utils/auth';
import { updatePlayerData } from '../../players/service/updatePlayer.service';
import { getForces } from '../../teams/service/getForces.service';
import { getData } from '../../teams/service/getTeams.service';
import FilterComponent from '../components/FilterComponent';
import { getPlayers } from '../service/getPlayers.service';

const baseUrl = import.meta.env.REACT_APP_BASE_URL || 'https://api.laliga-ixtlahuaca.com';

const Sidebar = lazy(() => import('../../dashboard/screens/SideBar'));
const UpdatePlayerModal = lazy(() => import('../components/UpdatePlayerModal'));
const MemoizedFilterComponent = React.memo(FilterComponent);

const GetPlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [forces, setForces] = useState<Forces[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    playerNumber: '',
    birthDate: '',
    forceId: '',
    teamId: '',
  });
  const userRole = useMemo(() => getUserRole(), []);
  const user = useMemo(() => getDecodedToken(), []);
  const { siteName } = useSiteSettings();

  
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [filterBy, setFilterBy] = useState<string>(userRole === 'team' ? 'team' : 'name');
  const [searchValue, setSearchValue] = useState<string>(userRole === 'team' ? user.username : '');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    setIsDataReady(false);
  try {
    const [playerData, teamData, forceData] = await Promise.all([
      getPlayers(page, limit, searchValue, filterBy, showInactive),
      getData(1, 0),
      getForces(),
    ]);

    const { players, totalPages: playerTotalPages } = playerData;

    startTransition(() => {
      let filteredPlayers = players;

      if (filterBy === "team" && searchValue) {
        filteredPlayers = players.filter(player => 
          player.teamId?.name.toLowerCase().trim() === searchValue.toLowerCase().trim()
        );
      }
      else if (filterBy === "name" && searchValue) {
        filteredPlayers = players.filter(player =>
          player.name.toLowerCase().includes(searchValue.toLowerCase().trim())
        );
      }

      const finalFilteredPlayers = showInactive 
        ? filteredPlayers.filter(player => !player.isActive)
        : filteredPlayers;

      setPlayers(players);
      setTeams(teamData.teams);
      setForces(forceData);
      setFilteredPlayers(finalFilteredPlayers);
      setTotalPages(playerTotalPages);
      setLoading(false);
    });
  } catch {
    setError('Error al obtener jugadores');
    setLoading(false);
  }
}, [page, limit, searchValue, filterBy, showInactive]);

  useEffect(() => {
    fetchData();
  }, [fetchData, page]);

  const handleOpen = useCallback((player: Player) => {
    if (player) {
      setSelectedPlayer({
        ...player,
        photoPreview: `${baseUrl}/${player.photo}?t=${Date.now()}`,
        inePreview: `${baseUrl}/${player.ine}?t=${Date.now()}`,
        curpPreview: `${baseUrl}/${player.curp}?t=${Date.now()}`,
        proofOfAddressPreview: `${baseUrl}/${player.proofOfAddress}?t=${Date.now()}`,
      });
      setOpen(true);
    }
  }, []);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedPlayer(null);
    setActiveStep(0);
    setValidationErrors({
      name: '',
      playerNumber: '',
      birthDate: '',
      forceId: '',
      teamId: '',
    });
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowInactive(event.target.checked);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    if (selectedPlayer) {
      setSelectedPlayer({
        ...selectedPlayer,
        [name]: type === 'checkbox' ? checked : value,
      });
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (name: string, value: any) => {
    if (selectedPlayer) {
      setSelectedPlayer({
        ...selectedPlayer,
        [name]: {
          _id: value,
          name:
            name === 'forceId'
              ? forces.find((force) => force._id === value)?.name
              : teams.find((team) => team._id === value)?.name,
        },
      });
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {
      name: '',
      curpPlayer: '',
      playerNumber: '',
      birthDate: '',
      forceId: '',
      teamId: '',
    };

    if (!selectedPlayer?.name.trim()) errors.name = 'El nombre es obligatorio';
    if (!selectedPlayer?.curpPlayer.trim()) errors.curpPlayer = 'El CURP es obligatorio';
    if (selectedPlayer?.curpPlayer.trim().length !== 18) errors.curpPlayer = 'El CURP debe tener 18 caracteres';
    if (!selectedPlayer?.playerNumber.trim()) errors.playerNumber = 'El número es obligatorio';
    if (!selectedPlayer?.birthDate) errors.birthDate = 'La fecha de nacimiento es obligatoria';
    if (!selectedPlayer?.forceId?._id) errors.forceId = 'Debes seleccionar una fuerza';
    if (!selectedPlayer?.teamId?._id) errors.teamId = 'Debes seleccionar un equipo';

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== '');
  };

  const handleUpdatePlayer = async () => {
    if (!selectedPlayer || !validateForm()) return;

    const formData = new FormData();
    formData.append('name', selectedPlayer.name);
    formData.append('curpPlayer', selectedPlayer.curpPlayer);
    formData.append('playerNumber', selectedPlayer.playerNumber);
    formData.append('isYounger', selectedPlayer.isYounger ? 'true' : 'false');
    formData.append('isForeigner', selectedPlayer.isForeigner ? 'true' : 'false');
    formData.append('birthDate', selectedPlayer.birthDate);
    formData.append('forceId', selectedPlayer.forceId._id.toString());
    formData.append('teamId', selectedPlayer.teamId._id.toString());
    formData.append('isActive', selectedPlayer.isActive.toString());

    const files = ['photo', 'ine', 'curp', 'proofOfAddress'];
    files.forEach(fileKey => {
      const file = selectedPlayer[fileKey];
      if (file && typeof file === 'object' && 'name' in file) {
        formData.append(fileKey, file);
      }
    });
    setIsLoading(true);
    try {
      await updatePlayerData(selectedPlayer._id, formData);
      Swal.fire({
        icon: 'success',
        title: 'Jugador actualizado',
        text: 'El jugador ha sido actualizado exitosamente.',
        confirmButtonColor: '#667652',
      });
      handleClose();
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'Hubo un problema al actualizar el jugador. Inténtalo nuevamente.',
        confirmButtonColor: '#667652',
      });
    }finally{
      setIsLoading(false);
    }
  };

  const renderFileField = (label: string, fileKey: string, currentFileUrl?: string, previewKey?: keyof Player) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1">{label}</Typography>
      {(selectedPlayer?.[previewKey as string] || currentFileUrl) && (
        <Box sx={{ mt: 1 }}>
          {(selectedPlayer?.[previewKey as string] as string)?.endsWith('.pdf') ? (
            <a href={selectedPlayer?.[previewKey as string] || currentFileUrl} target="_blank" rel="noopener noreferrer">
              Ver {label}
            </a>
          ) : (
            <img
              src={selectedPlayer?.[previewKey as string] || currentFileUrl}
              alt={`${label} de ${selectedPlayer?.name}`}
              loading="lazy"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          )}
        </Box>
      )}
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ mt: 1 }}
      >
        Subir {label}
        <input
          type="file"
          accept={fileKey === 'photo' ? 'image/*' : 'image/*,application/pdf'}
          hidden
          onChange={(e) =>
            handleFileChange(
              fileKey,
              e.target.files ? e.target.files[0] : null
            )
          }
        />
      </Button>
    </Box>
  );

  const handleFileChange = (fileKey: string, file: File | null) => {
    if (!selectedPlayer) return;
    if (file && file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'Archivo demasiado grande',
        text: 'Cada archivo debe ser menor a 5MB.',
        confirmButtonColor: '#667652',
      });
      return;
    }

    if (selectedPlayer && file) {
      const newFileUrl = URL.createObjectURL(file);
      setSelectedPlayer({
        ...selectedPlayer,
        [fileKey]: file,
        [`${fileKey}Preview`]: newFileUrl,
      });
    }
  };

  

  const seoDescription = "Lista completa de jugadores de La Liga Ixtlahuaca, con detalles del equipo y fuerza. Accede a la información completa y mantente al tanto del rendimiento de los jugadores.";

  return (
    <div style={{height: "100dvh", overflowY: "hidden"}}>
      <Helmet>
        <title>{siteName} - Ver jugadores</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content="Lista de jugadores de La Liga Ixtlahuaca" />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
      </Helmet>
        <Box sx={{ display: 'flex', flexDirection: "column", height: "100%" }}>
        <Suspense fallback={<div>Cargando Sidebar...</div>}>
          <Sidebar role={userRole === 'team' ? 'team' : 'admin'} />
        </Suspense>
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 3, overflowY: "auto"}}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Lista de jugadores
          </Typography>
          
          <FilterComponent
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            searchValue={searchValue}
            setSearchValue={setSearchValue} 
            userRole={userRole}
            teamName={user?.teamName}
            />
            <FormControlLabel
            sx={{marginTop: '-35px'}}
            control={
              <Checkbox
                checked={showInactive}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="Mostrar jugadores inactivos"
          />

          <Grid container spacing={2} justifyContent="center">
            {loading
              ? Array.from({ length: 20 }).map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                    <Card elevation={10} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%', height: '100%', p: 2 }}>
                      <Skeleton variant="circular" width={80} height={80} />
                      <CardContent sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" height={30} />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="40%" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player) => (
                    <Grid item key={player._id} xs={12} sm={6} md={4} lg={3}>
                      <Card elevation={10} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%', height: '100%', p: 2 }}>

                        <CardContent sx={{ flex: 1, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                          <Typography gutterBottom variant="h6">
                            {player.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            <b>CURP: </b> {player.curpPlayer || 'Desconocido'} <br />
                            <b>Equipo: </b> {player.teamId.name || 'Desconocido'} <br />
                            <b>Número: </b> {player.playerNumber || 'Desconocido'} <br />
                            <b>Fuerza: </b> {player.forceId.name || 'Desconocido'} <br />
                            <b>Fecha de Nacimiento: </b> {new Date(player.birthDate).toLocaleDateString()} <br />
                          </Typography>
                          <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, paddingTop: 1 }}>
                              {/* {userRole !== 'team' && (
                                <>
                                  <GenerateCredentialLink player={player} baseUrl={baseUrl} />
                                </>
                              )} */}
                              <Button onClick={() => handleOpen(player)} size="small">
                                Modificar jugador
                              </Button>
                          </CardActions>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                )) : (
                  <Typography variant="body1">No hay jugadores disponibles.</Typography>
                )}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} shape="rounded" color='standard' />
          </Box>
        </Box>
      </Box>
      <Suspense fallback={<div>Cargando Modal...</div>}>
        <UpdatePlayerModal
          open={open}
          handleClose={handleClose}
          selectedPlayer={selectedPlayer}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          validationErrors={validationErrors}
          forces={forces}
          teams={teams}
          baseUrl={baseUrl}
          activeStep={activeStep}
          handleBack={handleBack}
          handleNext={handleNext}
          handleUpdatePlayer={handleUpdatePlayer}
          renderFileField={renderFileField}
          isLoading={isLoading}
          userRole={userRole}/>
      </Suspense>
    </div>
  );
};

export default GetPlayers;
