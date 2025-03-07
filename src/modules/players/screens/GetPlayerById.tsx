import { Box, Button, Card, CardMedia, Divider, Grid, Modal, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Player } from '../../../types/Player';
import { getUserRole } from '../../../utils/auth';
import { findById } from '../../players/service/getPlayerById.service';

const GetPlayerById: React.FC = () => {

  const baseUrl = import.meta.env.REACT_APP_BASE_URL || 'https://api.laliga-ixtlahuaca.com';
  
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userRole = getUserRole();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleOpen = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleButtonClick = () => {
    if (userRole) {
      navigate('/dashboard'); // URL para entrar a la liga
    } else {
      navigate('/login'); // URL para iniciar sesión
    }
  };

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!id) {
        setError('ID de jugador no válido');
        setLoading(false);
        return;
      }
      try {
        const playerData = await findById(id);
        setPlayer(playerData);
      } catch (error) {
        setError('Error al obtener la información del jugador');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id, userRole, navigate]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {player ? (
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, mt: 10, maxWidth: 800, margin: '0 auto' }}
        >
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              Información del jugador
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${baseUrl}/${player.photo}`}
                    alt={`Foto de ${player.name}`}
                    sx={{
                      objectFit: 'contain',
                      width: '100%',
                      maxHeight: 200,
                    }}
                    onClick={() => handleOpen(`${baseUrl}/${player.photo}`)}
                    style={{ cursor: 'pointer' }}
                  />
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h6" align="left">
                    {player.name}
                  </Typography>
                  <Typography variant="body1">
                    Fecha de nacimiento: {new Date(player.birthDate).toLocaleDateString('es-ES')}
                  </Typography>
                  <Typography variant="body1">Fuerza: {player.forceId?.name}</Typography>
                  <Typography variant="body1">Equipo: {player.teamId?.name}</Typography>
                  <Typography variant="body1">Número: {player.playerNumber}</Typography>
                  <Typography variant="body1">{player.isForeigner ? 'Jugador foráneo' : 'Jugador local'}</Typography>
                  <Typography variant="body1">{player.isYounger ? 'Jugador juvenil' : ''}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
                      <Button
              variant="contained"
              sx={{ mt: 3, backgroundColor: '#667652' }}
              onClick={handleButtonClick}
            >
              {userRole ? 'Regresar a La Liga Ixtlahuaca' : 'Iniciar sesión'}
            </Button>

          <Modal open={open} onClose={handleClose}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100vh"
              onClick={handleClose}
            >
              <img src={selectedImage ?? ''} alt="Imagen ampliada" style={{ maxWidth: '90%', maxHeight: '90%' }} />
            </Box>
          </Modal>
        </Box>
      ) : (
        <p>Jugador no encontrado</p>
      )}
    </div>
  );
};

export default GetPlayerById;
