import { useSiteSettings } from '@/modules/settings/components/SiteSettingsProvider';
import { getDecodedToken } from '@/utils/auth';
import { AccountCircle, Announcement } from '@mui/icons-material';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../login/service/auth.service';

const drawerWidth = 240;

type Role = 'admin' | 'team';


interface MiniDrawerProps {
  role: Role;
}

const roles = {
  admin: 'admin',
  team: 'team',
};

export default function MiniDrawer({ role }: MiniDrawerProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { siteName } = useSiteSettings();
  const user = useMemo(() => getDecodedToken(), []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAddPlayer = () => {
    navigate('/add-player');
  };

  const handleGetPlayers = () => {
    navigate('/get-players');
  };

  const handleAddTeam = () => {
    navigate('/add-team');
  };

  const handleGetTeam = () => {
    navigate('/get-teams');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleAnnouncements = () => {
    navigate('/announcements');
  };

  const handleCredentials = () => {
    navigate('/credentials');
  };
  const handleMatches = () => {
    navigate('/matches');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: '#667652' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {siteName}
          </Typography>
          <Typography variant='subtitle2'>
            {user.username}
          </Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="account"
            onClick={handleMenuOpen}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {role == roles.admin && (
                <MenuItem onClick={() => { handleMenuClose(); handleSettings(); }}>
                  Configuración
                </MenuItem>
            )}
            <MenuItem onClick={() => { handleMenuClose(); logout(); }}>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: drawerWidth,
            boxShadow: 3,
            borderRight: `1px solid #ccc`,
          },
        }}
      >
        <Box sx={{ width: drawerWidth, padding: 2 }}>
          <IconButton
            color="inherit"
            aria-label="dashboard"
            onClick={handleDashboard}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              mb: 1,
            }}
          >
            <HomeIcon sx={{ mr: 1 }} />
            <Typography variant="body1">Inicio</Typography>
          </IconButton>

          <IconButton
            color="inherit"
            aria-label="add player"
            onClick={handleAddPlayer}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              mb: 1,
            }}
          >
            <PersonAddAlt1RoundedIcon sx={{ mr: 1 }} />
            <Typography variant="body1">Agregar Jugadores</Typography>
          </IconButton>

          <IconButton
            color="inherit"
            aria-label="players"
            onClick={handleGetPlayers}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              mb: 1,
            }}
          >
            <Person2RoundedIcon sx={{ mr: 1 }} />
            <Typography variant="body1">Lista de Jugadores</Typography>
          </IconButton>
          {role === roles.admin && (
            <>

              <IconButton
                color="inherit"
                aria-label="add team"
                onClick={handleAddTeam}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  mb: 1,
                }}
              >
                <GroupAddIcon sx={{ mr: 1 }} />
                <Typography variant="body1">Agregar Equipos</Typography>
              </IconButton>

              <IconButton
                color="inherit"
                aria-label="teams"
                onClick={handleGetTeam}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  mb: 1,
                }}
              >
                <GroupsIcon sx={{ mr: 1 }} />
                <Typography variant="body1">Lista de Equipos</Typography>
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="teams"
                onClick={handleAnnouncements}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  mb: 1,
                }}
              >
                <Announcement sx={{ mr: 1 }} />
                <Typography variant="body1">Anuncios</Typography>
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="teams"
                onClick={handleMatches}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  mb: 1,
                }}
              >
                <ScoreboardIcon sx={{ mr: 1 }} />
                <Typography variant="body1">Partidos</Typography>
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="teams"
                onClick={handleGetTeam}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  mb: 1,
                }}
              >
                <EmojiEventsIcon sx={{ mr: 1 }} />
                <Typography variant="body1">Tabla de posiciones</Typography>
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="teams"
                onClick={handleCredentials}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  mb: 1,
                }}
              >
                <ContactEmergencyIcon sx={{ mr: 1 }} />
                <Typography variant="body1">Credenciales</Typography>
              </IconButton>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
