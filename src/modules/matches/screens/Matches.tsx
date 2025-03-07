import { useSiteSettings } from "@/modules/settings/components/SiteSettingsProvider";
import { getUserRole } from "@/utils/auth";
import { Box, Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import Sidebar from '../../dashboard/screens/SideBar';
import MatchModal from "../components/MatchModal";


const MatchScreen = () => {
  const { siteName } = useSiteSettings();
  const userRole = useMemo(() => getUserRole(), []);
  const [open, setOpen] = useState(false);

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

      <Box sx={{ display: "flex" }}>
        <Sidebar role={userRole === "team" ? "team" : "admin"} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
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
      </Box>
      <MatchModal
        open={open}
        handleClose={handleClose}
        
      />
    </>
  );
};

export default MatchScreen;