import { useSiteSettings } from "@/modules/settings/components/SiteSettingsProvider";
import { getUserRole } from "@/utils/auth";
import { Box, Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import Sidebar from '../../dashboard/screens/SideBar';
import MatchModal from "../components/MatchModal";
import { createTheme, ThemeProvider } from "@mui/material/styles";


const MatchScreen = () => {
  const { siteName } = useSiteSettings();
  const userRole = useMemo(() => getUserRole(), []);
  const [open, setOpen] = useState(false);
  const themeFont = createTheme({
      typography: {
        fontFamily: "Inter, Arial, sans-serif",
      },
    });

  const handleAdd= () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>{siteName} - Partidos</title>
      </Helmet>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Sidebar role={userRole === "team" ? "team" : "admin"} />
        <ThemeProvider theme={themeFont}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 3 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2, letterSpacing: "2px" }}>
            Partidos
          </Typography>
          <Button
            onClick={handleAdd}
            variant="contained"
            sx={{
              backgroundColor: "#667652",
              "&:hover": {
                backgroundColor: "#5d6b4b",
              },
              mb: 3,
            }}
          >
            Generar rol
          </Button>
        </Box>
        </ThemeProvider>
      </Box>
      <ThemeProvider theme={themeFont}>
      <MatchModal
        open={open}
        handleClose={handleClose}
        
      />
      </ThemeProvider>
    </>
  );
};

export default MatchScreen;