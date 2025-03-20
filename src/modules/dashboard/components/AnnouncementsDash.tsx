import { Announcement } from "@/types/Announcement";
import { Box, Card, CardContent, Divider, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getAnnouncements } from "../../announcements/service/getAnnouncement.service";

const AnnouncementsDash = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error al cargar los anuncios:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: "bold", letterSpacing: "1.5px" }}>
        Anuncios
      </Typography>
      {announcements.length > 0 ? (
        announcements.map((announcement) => (
          <Card
            key={announcement._id}
            sx={{
              mb: 2,
              borderRadius: "8px",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                {announcement.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#777", mb: 2 }}>
                Publicado por {announcement.author} -{" "}
                {announcement.createdAt
                  ? new Date(announcement.createdAt).toLocaleDateString()
                  : "Fecha no disponible"}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" sx={{ color: "#555", whiteSpace: "pre-line" }}>
                {announcement.content}
              </Typography>

              {announcement.image && (
              <>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <img
                    src={`https://api.laliga-ixtlahuaca.com/${announcement.image}`} 
                    alt="Anuncio"
                    style={{ maxWidth: "20%", height: "auto", borderRadius: "10px", cursor: "pointer" }}
                    onClick={handleOpen}
                  />
                </Box>

                <Modal open={open} onClose={handleClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center" , overflow: "auto"}}>
                  <Box sx={{ outline: "none", maxWidth: "60%", maxHeight: "60%" }}>
                    <img
                      src={`https://api.laliga-ixtlahuaca.com/${announcement.image}`}
                      alt="Anuncio ampliado"
                      style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                    />
                  </Box>
                </Modal>
              </>
            )}

            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" sx={{ color: "#777", letterSpacing: "1.5px" }}>
          No hay anuncios disponibles.
        </Typography>
      )}
    </Box>
  );
};

export default AnnouncementsDash;
