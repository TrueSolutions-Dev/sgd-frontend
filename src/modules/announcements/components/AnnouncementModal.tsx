import { getDecodedToken } from "@/utils/auth";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useMemo } from "react";

interface AnnouncementModalProps {
  open: boolean;
  handleClose: () => void;
  newAnnouncement: { title: string; content: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveAnnouncement: () => void; // Ajustar para no requerir argumento
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  open,
  handleClose,
  newAnnouncement,
  handleInputChange,
  handleSaveAnnouncement,
  handleImageChange
}) => {

  const user = useMemo(() => getDecodedToken(), []);

  const handleSave = () => {
    handleSaveAnnouncement();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ 
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
          boxShadow: 24
      }}>
        <Typography variant="h6" gutterBottom>
          Nuevo anuncio
        </Typography>
        <TextField
          fullWidth
          label="Título"
          name="title"
          value={newAnnouncement.title}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Contenido"
          name="content"
          multiline
          rows={4}
          value={newAnnouncement.content}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginTop: 16 }}
        />
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            mt: 2,
            backgroundColor: '#667652',
            '&:hover': {
              backgroundColor: '#5d6b4b',
            },
          }}
        >
          Guardar
        </Button>
        <Button
          onClick={handleClose}
          sx={{
            mt: 1,
            color: '#e63e1a',
          }}
        >
          Cancelar
        </Button>
      </Box>
    </Modal>
  );
};

export default AnnouncementModal;
