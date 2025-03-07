import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Pagination,
  Skeleton,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Swal from 'sweetalert2';
import { Forces } from '../../../types/Forces';
import { Team } from '../../../types/Team';
import { getUserRole } from '../../../utils/auth';
import Sidebar from '../../dashboard/screens/SideBar';
import FilterComponent from '../components/FilterComponent';
import UpdateTeamModal from '../components/UpdateTeamModal';
import { deleteTeam } from '../service/deleteTeam.service';
import { getForces } from '../service/getForces.service';
import { getData } from '../service/getTeams.service';
import { updateTeamData } from '../service/updateTeam.service';

const GetTeam = () => {
  const [forces, setForces] = useState<Forces[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const userRole = getUserRole();
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [filterBy, setFilterBy] = useState<string>('name');
  const [searchValue, setSearchValue] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTeams = useCallback(async () => {
    try {
      const [teamData, forceData] = await Promise.all([
        getData(page, limit, searchValue, filterBy), 
        getForces()
      ]);

      const { teams, totalPages: teamsTotalPages } = teamData;

      setTeams(teams);
      setForces(forceData);
      setFilteredTeams(teams);
      setTotalPages(teamsTotalPages);
      setLoading(false);
    } catch {
      setError('Error al obtener equipos');
      setLoading(false);
    }
  }, [page, limit, searchValue, filterBy]);

    useEffect(() => {
    fetchTeams();
  }, [fetchTeams, page, searchValue, filterBy]);

    useEffect(() => {
    const filterData = () => {
      if (!searchValue) {
        setFilteredTeams(teams);
      } else {
        const filtered = teams.filter((team) => {
          if (filterBy === 'force') {
            const forceName = forces.find((f) => f._id === team.forceId._id.toString())?.name;
            return forceName ? forceName.toLowerCase().includes(searchValue.toLowerCase()) : false;
          }
          const value = team[filterBy as keyof Team];
          return value && value.toString().toLowerCase().includes(searchValue.toLowerCase());
        });
        setFilteredTeams(filtered);
      }
    };
    filterData();
  }, [searchValue, filterBy, teams, forces]);

  const getForceName = (forceId: string | number | { _id: string }) => {
    const normalizedForceId = typeof forceId === 'object' ? forceId._id : forceId;
    const force = forces.find((f) => f._id === normalizedForceId);
    return force ? force.name : 'Desconocido';
  };

  const handleOpen = (team: Team) => {
    setSelectedTeam(team);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTeam(null);
  };

  const handleChangeForce = (e: any) => {
    const selectedForceId = e.target.value;
    setSelectedTeam((prev: any) => ({
      ...prev,
      forceId: selectedForceId,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedTeam((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPage(value);
  };

  const handleDeleteTeam = async (teamId: string) => {
  const confirmation = await Swal.fire({
    icon: 'warning',
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el equipo permanentemente.',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar',
  });

  if (confirmation.isConfirmed) {
    try {
      // Llama a la función del servicio para eliminar el equipo
      await deleteTeam(teamId); // Asegúrate de implementar esta función en el servicio
      Swal.fire({
        icon: 'success',
        title: 'Equipo eliminado',
        text: 'El equipo ha sido eliminado exitosamente.',
        confirmButtonColor: '#667652',
      });
      fetchTeams();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: 'Hubo un problema al eliminar el equipo. Inténtalo nuevamente.',
        confirmButtonColor: '#667652',
      });
    }
  }
};

  if (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error,
      confirmButtonColor: '#667652',
    });
    return <div>{error}</div>;
  }

  const handleUpdateTeam = async () => {
    if (!selectedTeam) return;

    if (
      !selectedTeam.name ||
      !selectedTeam.owner ||
      !selectedTeam.representative ||
      !selectedTeam.forceId
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos antes de actualizar el equipo.',
        confirmButtonColor: '#667652',
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedTeamData = {
        name: selectedTeam.name,
        owner: selectedTeam.owner,
        representative: selectedTeam.representative,
        forceId: selectedTeam.forceId,
      };

      await updateTeamData(selectedTeam._id, updatedTeamData);
      Swal.fire({
        icon: 'success',
        title: 'Equipo actualizado',
        text: 'El equipo ha sido actualizado exitosamente.',
        confirmButtonColor: '#667652',
      });
      handleClose();
      await fetchTeams();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'Hubo un problema al actualizar el equipo. Inténtalo nuevamente.',
        confirmButtonColor: '#667652',
      });
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>La Liga Ixtlahuaca - Ver equipos</title>
      </Helmet>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar role={userRole === 'team' ? 'team' : 'admin'} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Lista de equipos
          </Typography>
          <FilterComponent
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <Grid container spacing={2} justifyContent="center">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                    <Card
                      elevation={10}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: '100%',
                        height: '100%',
                        p: 2,
                      }}
                    >
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
              : filteredTeams && filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <Grid item key={team._id} xs={12} sm={6} md={4} lg={3}>
                      <Card
                        elevation={10}
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          width: '100%',
                          height: '100%',
                          p: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: '#667652',
                            width: { xs: '60px', md: '80px' },
                            height: { xs: '60px', md: '80px' },
                            alignSelf: { xs: 'center', sm: 'flex-start' },
                            mr: { sm: 2 },
                            mb: { xs: 2, sm: 0 },
                          }}
                          variant="rounded"
                        >
                          {team.name[0].toUpperCase()}
                        </Avatar>

                        <CardContent sx={{ flex: 1 }}>
                          <Typography gutterBottom variant="h6" component="div">
                            {team.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            <b>Fuerza: </b> {getForceName(team.forceId._id)} <br />
                            <b>Dueño del equipo: </b> {team.owner} <br />
                            <b>Representante: </b> {team.representative} <br />
                          </Typography>

                          <CardActions
                            sx={{
                              padding: 0,
                              paddingTop: 1,
                              display: 'flex',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                            }}
                          >
                            <Button
                              sx={{ minWidth: 'fit-content', fontSize: '12px' }}
                              onClick={() => handleOpen(team)}
                              size="small"
                            >
                              Modificar equipo
                            </Button>
                            <Button
                              sx={{ minWidth: 'fit-content', fontSize: '12px', color: 'red' }}
                              onClick={() => handleDeleteTeam(team._id.toString())}
                              size="small"
                              startIcon={<DeleteIcon />}
                            >
                              Eliminar
                            </Button>
                          </CardActions>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body1">
                    No hay equipos disponibles.
                  </Typography>
                )}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <Pagination 
              count={totalPages}
              page={page} 
              onChange={handlePageChange} 
              shape="rounded" 
              color="standard" />
          </Box>
        </Box>
      </Box>
      <UpdateTeamModal
        open={open}
        handleClose={handleClose}
        selectedTeam={selectedTeam}
        handleInputChange={handleInputChange}
        handleChangeForce={handleChangeForce}
        handleUpdateTeam={handleUpdateTeam}
        forces={forces}
        isLoading={isLoading}
      />
    </>
  );
};

export default GetTeam;
