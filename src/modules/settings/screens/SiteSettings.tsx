import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Card, CardContent, FormControlLabel, Modal, Switch, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Swal from 'sweetalert2';
import logoImage from '../../../assets/img/logo.png';
import Sidebar from '../../dashboard/screens/SideBar';
import { getSiteSettings } from '../service/getSettings.service';
import { updateSiteSettings } from '../service/settings.service';

const SiteSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [siteName, setSiteName] = useState("");
  const [draftSiteName, setDraftSiteName] = useState("");
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { maintenanceMode, siteName, siteLogo } = await getSiteSettings();
        setMaintenanceMode(maintenanceMode);
        setSiteName(siteName);
        setDraftSiteName(siteName); // Inicializa el valor temporal
        setLogoPreview(`${import.meta.env.REACT_APP_BASE_URL}/${siteLogo}`);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar la configuración del sitio',
          text: 'Hubo un problema al cargar la configuración inicial.',
          confirmButtonColor: '#667652',
        });
      }
    };

    fetchSettings();
  }, []);

  const handleMaintenanceToggle = () => {
    setMaintenanceMode(!maintenanceMode);
  };

  const handleDraftSiteNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDraftSiteName(event.target.value);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    try {
      await updateSiteSettings({
        maintenanceMode,
        siteName: draftSiteName,  // Usa el valor temporal para guardar
        logoFile: newLogo || undefined,
      });

      setSiteName(draftSiteName); // Actualiza el siteName después de guardar

      Swal.fire({
        icon: 'success',
        title: 'Cambios guardados exitosamente',
        confirmButtonColor: '#667652',
      }).then(() => {
        window.location.reload();
      });
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar cambios',
        text: 'Hubo un problema al guardar la configuración del sitio.',
        confirmButtonColor: '#667652',
      });
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div style={{overflowY: "hidden", width: "100dvw", height: "100dvh"}}>
      <Helmet>
        <title>{siteName} - Configuración</title>
      </Helmet>
      <Box sx={{ display: 'flex', flexDirection: "column", width: "100%", height: "100%" }}>
        <Sidebar role="admin" />
        <Box 
        component="main" 
        sx={{ flexGrow: 1, p: 3, pt: 3, textAlign: 'center', overflowY: "auto"}}
        >
          <img
            src={logoPreview || logoImage}
            alt="Logo de la Liga"
            style={{ width: '110px', marginTop: '15px' }}
          />
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ marginBottom: '40px' }}
          >
            {siteName}
          </Typography>
          <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold', mb: 3 }}>
            Configuración del sitio
          </Typography>

          {/* Card para el nombre del sitio */}
          <Card sx={{ maxWidth: 600, margin: '0 auto', mb: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Nombre del sitio
              </Typography>
              <TextField
                fullWidth
                value={draftSiteName}  // Usa draftSiteName en lugar de siteName
                onChange={handleDraftSiteNameChange}
                placeholder="Introduce el nombre del sitio"
                sx={{ mb: 2 }}
              />
            </CardContent>
          </Card>

          <Card sx={{ maxWidth: 600, margin: '0 auto', mb: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Modo de mantenimiento
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    sx={{ color: '#667652' }}
                    checked={maintenanceMode}
                    onChange={handleMaintenanceToggle}
                  />
                }
                label="Activar modo de mantenimiento"
              />
              <Typography variant="body2" sx={{ mt: 2 }}>
                {maintenanceMode
                  ? 'El sitio está en modo de mantenimiento. Los usuarios no podrán acceder.'
                  : 'El sitio está activo y disponible para los usuarios.'}
              </Typography>
            </CardContent>
          </Card>

          {/* Card para cambiar el logo del sitio */}
          <Card sx={{ maxWidth: 600, margin: '0 auto', mb: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Cambiar logo del sitio
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ justifyContent: 'start' }}
              >
                {newLogo ? newLogo.name : 'Subir nuevo logo'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoChange}
                />
              </Button>
              {logoPreview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={logoPreview}
                    alt="Vista previa del nuevo logo"
                    style={{ width: '150px', cursor: 'pointer' }}
                    onClick={handleModalOpen}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Modal para ver la imagen en tamaño completo */}
          <Modal
            open={modalOpen}
            onClose={handleModalClose}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Box sx={{ outline: 'none' }}>
              <img
                src={logoPreview || ''}
                alt="Vista previa del nuevo logo"
                style={{ maxWidth: '90vw', maxHeight: '90vh' }}
              />
            </Box>
          </Modal>

          {/* Botón general para guardar cambios */}
          <Button
            variant="contained"
            sx={{ mt: 3, backgroundColor: '#667652' }}
            onClick={handleSaveChanges}
          >
            Guardar cambios
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default SiteSettings;
