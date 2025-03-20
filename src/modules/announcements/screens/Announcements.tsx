import { useSiteSettings } from "@/modules/settings/components/SiteSettingsProvider";
import { Announcement } from "@/types/Announcement";
import { getDecodedToken } from "@/utils/auth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import Sidebar from "../../dashboard/screens/SideBar";
import AnnouncementModal from "../components/AnnouncementModal";
import { createAnnouncement } from "../service/addAnnouncement.service";
import { deleteAnnouncement } from "../service/deleteAnnouncement.service";
import { getAnnouncements } from "../service/getAnnouncement.service";
import { updateAnnouncement } from "../service/updateAnnouncement.service"; // Importa el servicio de actualización
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Announcements = () => {
  const { siteName } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    image: null as File | null,
  });
  const themeFont = createTheme({
        typography: {
          fontFamily: "Inter, Arial, sans-serif",
        },
    });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al cargar los anuncios",
        confirmButtonColor: "#e63e1a",
      });
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
      
    setEditMode(true);

    if (announcement._id) {
        setSelectedAnnouncementId(announcement._id);
    }
    
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      image: announcement.image
    });
    setOpen(true);
  };

  const handleAddAnnouncement = () => {
    setEditMode(false);
    setNewAnnouncement({ title: "", content: "", image: null });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAnnouncement({ ...newAnnouncement, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewAnnouncement({ ...newAnnouncement, image: e.target.files[0] });
    }
  };

  const handleSaveAnnouncement = async () => {
    try {
      const user = getDecodedToken();
      const formData = new FormData();
      formData.append("title", newAnnouncement.title);
      formData.append("content", newAnnouncement.content);
      formData.append("author", user.username);
      console.log(formData);

      if (newAnnouncement.image) {
        formData.append("image", newAnnouncement.image);
      }

      if (editMode && selectedAnnouncementId) {
        await updateAnnouncement(selectedAnnouncementId, formData);
        Swal.fire({
          icon: "success",
          title: "Anuncio actualizado",
          text: "El anuncio se actualizó correctamente",
          confirmButtonColor: "#667652",
        });
      } else {
        await createAnnouncement(formData);
        Swal.fire({
          icon: "success",
          title: "Anuncio publicado",
          text: "El anuncio se publicó correctamente",
          confirmButtonColor: "#667652",
        });
      }

      fetchAnnouncements();
      setOpen(false);
      setNewAnnouncement({ title: "", content: "", image: null });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar el anuncio",
        confirmButtonColor: "#e63e1a",
      });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      fetchAnnouncements();

      Swal.fire({
        icon: "success",
        title: "Anuncio eliminado",
        text: "El anuncio ha sido eliminado correctamente",
        confirmButtonColor: "#667652",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar el anuncio",
        confirmButtonColor: "#e63e1a",
      });
    }
  };

  return (
    <div>
      <Helmet>
        <title>{siteName} - Anuncios</title>
      </Helmet>
      <ThemeProvider theme={themeFont}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Sidebar role="admin" />
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 3 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Anuncios
          </Typography>
          <Button
            onClick={handleAddAnnouncement}
            variant="contained"
            sx={{
              backgroundColor: "#667652",
              "&:hover": {
                backgroundColor: "#5d6b4b",
              },
              mb: 3,
            }}
          >
            Publicar anuncio
          </Button>

          {/* Lista de anuncios */}
          <List>
            {announcements.map((announcement) => (
              <ListItem key={announcement._id} sx={{ p: 0 }}>
                <Card
                  sx={{
                    width: "100%",
                    mb: 2,
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        {announcement.title}
                      </Typography>
                      <IconButton
                        onClick={() => handleEditAnnouncement(announcement)}
                        color="primary"
                        size="small"
                        sx={{ position: "absolute", top: 8, right: 40 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          announcement._id && handleDeleteAnnouncement(announcement._id)
                        }
                        color="error"
                        size="small"
                        sx={{ position: "absolute", top: 8, right: 8 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ color: "#777", mb: 2 }}>
                      Publicado por {announcement.author} -{" "}
                      {announcement.createdAt
                        ? new Date(announcement.createdAt).toLocaleDateString()
                        : "Fecha no disponible"}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography
                      variant="body1"
                      sx={{ color: "#555", whiteSpace: "pre-line" }}
                    >
                      {announcement.content}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>

        </Box>
      </Box>
      </ThemeProvider>
      <ThemeProvider theme={themeFont}>
      <AnnouncementModal
        open={open}
        handleClose={handleClose}
        newAnnouncement={newAnnouncement}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleSaveAnnouncement={handleSaveAnnouncement}
      />
      </ThemeProvider>
    </div>
  );
};

export default Announcements;
