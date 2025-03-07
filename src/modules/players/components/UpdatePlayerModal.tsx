import { Forces } from '@/types/Forces';
import { Player } from '@/types/Player';
import { Team } from '@/types/Team';
import PreviewIcon from '@mui/icons-material/Preview';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import Lottie from 'react-lottie';
import loadingAnimation from '../../../assets/lotties/loading.json';

interface UpdatePlayerModalProps {
  open: boolean;
  handleClose: () => void;
  selectedPlayer: Player | null;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  validationErrors: { [key: string]: string };
  forces: Forces[];
  teams: Team[];
  baseUrl: string;
  activeStep: number;
  handleBack: () => void;
  handleNext: () => void;
  handleUpdatePlayer: () => void;
  isLoading: boolean;
  userRole: string;
  renderFileField: (
    label: string,
    fieldName: string,
    fileUrl: string,
    previewId: string,
  ) => React.ReactNode;
}

const UpdatePlayerModal: React.FC<UpdatePlayerModalProps> = ({
  open,
  handleClose,
  selectedPlayer,
  handleInputChange,
  handleSelectChange,
  validationErrors,
  forces,
  teams,
  baseUrl,
  activeStep,
  handleBack,
  handleNext,
  handleUpdatePlayer,
  renderFileField,
  isLoading,
  userRole
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
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
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 400,
          maxHeight: '80vh',
          overflowY: 'auto',
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
              height: '100%',
            }}
          >
            <Lottie options={defaultOptions} height={200} width={200} />
          </Box>
        ) : (
          <>
            <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
              Modificar información del jugador
            </Typography>
            <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
              {['Información del jugador', 'Documentación'].map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {selectedPlayer && (
              <Box>
                {activeStep === 0 && (
                  <>
                    <TextField
                      label="Nombre del jugador"
                      value={selectedPlayer.name}
                      name="name"
                      onChange={handleInputChange}
                      fullWidth
                      required
                      error={!!validationErrors.name}
                      helperText={validationErrors.name}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="CURP del jugador"
                      value={selectedPlayer.curpPlayer}
                      name="curpPlayer"
                      onChange={handleInputChange}
                      fullWidth
                      required
                      error={!!validationErrors.curpPlayer}
                      helperText={validationErrors.curpPlayer}
                      sx={{ mb: 2 }}
                      inputProps={
                       {maxLength: 18}
                      }
                    />
                    <TextField
                      label="Fecha de Nacimiento"
                      type="date"
                      value={
                        selectedPlayer?.birthDate
                          ? selectedPlayer.birthDate.slice(0, 10)
                          : ''
                      }
                      name="birthDate"
                      onChange={handleInputChange}
                      fullWidth
                      required
                      error={!!validationErrors.birthDate}
                      helperText={validationErrors.birthDate}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Fuerza"
                      select
                      disabled={userRole === 'team'} 
                      value={selectedPlayer?.forceId?._id || ''}
                      onChange={(e) =>
                        handleSelectChange('forceId', e.target.value)
                      }
                      fullWidth
                      required
                      error={!!validationErrors.forceId}
                      helperText={validationErrors.forceId}
                      sx={{ mb: 2 }}
                    >
                      {forces.map((force) => (
                        <MenuItem key={force._id} value={force._id.toString()}>
                          {force.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Equipo"
                      select
                      disabled={userRole === 'team'} 
                      value={selectedPlayer?.teamId?._id || ''}
                      onChange={(e) => handleSelectChange('teamId', e.target.value)}
                      fullWidth
                      required
                      error={!!validationErrors.teamId}
                      helperText={validationErrors.teamId}
                      sx={{ mb: 2 }}
                    >
                      {teams.map((team) => (
                        <MenuItem key={team._id} value={team._id.toString()}>
                          {team.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Número del jugador"
                      value={selectedPlayer.playerNumber}
                      name="playerNumber"
                      onChange={handleInputChange}
                      fullWidth
                      required
                      error={!!validationErrors.playerNumber}
                      helperText={validationErrors.playerNumber}
                      sx={{ mb: 2 }}
                    />
                      {userRole !== 'team' && (
                            <>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectedPlayer.isActive}
                                    onChange={handleInputChange}
                                    name="isActive"
                                  />
                                }
                                label="Activo"
                              />
                            </>
                          )}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedPlayer.isYounger}
                          onChange={handleInputChange}
                          name="isYounger"
                        />
                      }
                      label="Juvenil"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedPlayer.isForeigner}
                          onChange={handleInputChange}
                          name="isForeigner"
                        />
                      }
                      label="Foráneo"
                    />
                  </>
                )}

                {activeStep === 1 && (
                  <>
                    <Grid container alignItems="center" sx={{ mb: 1 }}>
                      <Grid item xs={11}>
                        {renderFileField(
                          'Foto del jugador',
                          'photo',
                          `${baseUrl}/${selectedPlayer.photo}`,
                          'photoPreview',
                        )}
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton onClick={() => handleImageClick(`${baseUrl}/${selectedPlayer.photo}`)} sx={{ marginLeft: '-150px' }}>
                          <PreviewIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" sx={{ mb: 1 }}>
                      <Grid item xs={11}>
                        {renderFileField(
                          'INE',
                          'ine',
                          `${baseUrl}/${selectedPlayer.ine}`,
                          'inePreview',
                        )}
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton onClick={() => handleImageClick(`${baseUrl}/${selectedPlayer.ine}`)} sx={{ marginLeft: '-150px' }}>
                          <PreviewIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" sx={{ mb: 1 }}>
                      <Grid item xs={11}>
                        {renderFileField(
                          'CURP',
                          'curp',
                          `${baseUrl}/${selectedPlayer.curp}`,
                          'curpPreview',
                        )}
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton onClick={() => handleImageClick(`${baseUrl}/${selectedPlayer.curp}`)} sx={{ marginLeft: '-150px' }}>
                          <PreviewIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" sx={{ mb: 1 }}>
                      <Grid item xs={11}>
                        {renderFileField(
                          'Constancia de domicilio',
                          'proofOfAddress',
                          `${baseUrl}/${selectedPlayer.proofOfAddress}`,
                          'proofOfAddressPreview',
                        )}
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton onClick={() => handleImageClick(`${baseUrl}/${selectedPlayer.proofOfAddress}`)} sx={{ marginLeft: '-150px' }}>
                          <PreviewIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Atrás
              </Button>
              {activeStep < 1 ? (
                <Button variant="contained" color="primary" onClick={handleNext}>
                  Siguiente
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdatePlayer}
                  sx={{
                    backgroundColor: '#667652',
                    '&:hover': { backgroundColor: '#5d6b4b' },
                  }}
                >
                  Actualizar
                </Button>
              )}
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClose}
              sx={{
                mt: 2,
                backgroundColor: '#e63e1a',
                '&:hover': { backgroundColor: '#ce2b08' },
              }}
            >
              Cancelar
            </Button>
          </>
        )}

        {previewImage && (
          <Dialog open={!!previewImage} onClose={handleClosePreview}>
            <DialogContent>
              <img src={previewImage} alt="Preview" style={{ width: '100%' }} />
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </Modal>
  );
};

export default UpdatePlayerModal;
