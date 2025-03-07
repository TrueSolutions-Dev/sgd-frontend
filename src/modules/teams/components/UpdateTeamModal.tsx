import { Forces } from '@/types/Forces';
import { Team } from '@/types/Team';
import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import Lottie from 'react-lottie';
import loadingAnimation from '../../../assets/lotties/loading.json';

interface UpdateTeamModalProps {
  open: boolean;
  handleClose: () => void;
  selectedTeam: Team | null;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeForce: (event: React.ChangeEvent<{ value: unknown }>) => void;
  handleUpdateTeam: () => void;
  forces: Forces[];
  isLoading: boolean;
}

const UpdateTeamModal: React.FC<UpdateTeamModalProps> = ({
  open,
  handleClose,
  selectedTeam,
  handleInputChange,
  handleChangeForce,
  handleUpdateTeam,
  forces,
  isLoading
}) => {
  
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClose={handleClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          p: 4,
          boxShadow: 24,
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
            }}
          >
            <Lottie options={defaultOptions} height={200} width={200} />
          </Box>
        ) : (
          <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Modificar equipo
            </Typography>
            {selectedTeam && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Nombre del equipo"
                  value={selectedTeam.name}
                  name="name"
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Dueño del equipo"
                  value={selectedTeam.owner}
                  name="owner"
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Representante"
                  value={selectedTeam.representative}
                  name="representative"
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Fuerza"
                  select
                  value={selectedTeam.forceId._id.toString() || ''}
                  fullWidth
                  required
                  onChange={handleChangeForce}
                  margin="normal"
                >
                  {forces.map((force: Forces) => (
                    <MenuItem key={force._id.toString()} value={force._id.toString()}>
                      {force.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateTeam}
              sx={{
                mt: 2,
                mr: 2,
                backgroundColor: '#667652',
                '&:hover': {
                  backgroundColor: '#5d6b4b',
                },
              }}
            >
              Actualizar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClose}
              sx={{
                mt: 2,
                backgroundColor: '#e63e1a',
                '&:hover': {
                  backgroundColor: '#ce2b08',
                },
              }}
            >
              Cancelar
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default UpdateTeamModal;
