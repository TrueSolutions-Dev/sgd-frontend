import GenerateTeamCredentialsLink from "@/modules/players/components/GenerateTeamCredentialsLink";
import { getPlayers } from "@/modules/players/service/getPlayers.service";
import { useSiteSettings } from "@/modules/settings/components/SiteSettingsProvider";
import { getForces } from "@/modules/teams/service/getForces.service";
import { getData as getTeams } from "@/modules/teams/service/getTeams.service";
import { Forces } from "@/types/Forces";
import { Player } from "@/types/Player";
import { Team } from "@/types/Team";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import Sidebar from "../../dashboard/screens/SideBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const baseUrl = import.meta.env.REACT_APP_BASE_URL || 'https://api.laliga-ixtlahuaca.com';

const Credentials = () => {
  const { siteName } = useSiteSettings();
  const [teams, setTeams] = useState<Team[]>([]);
  const [forces, setForces] = useState<Forces[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedForce, setSelectedForce] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const themeFont = createTheme({
      typography: {
        fontFamily: "Inter, Arial, sans-serif",
      },
    });

  const fetchTeams = useCallback(async () => {
    try {
      const [teamData] = await Promise.all([getTeams(1, 0, "force", selectedForce ?? "")]);
      const { teams } = teamData;
      setTeams(teams);
    } catch (error) {
      console.error("Error al obtener equipos:", error);
    }
  }, [selectedForce]);

  const fetchForces = useCallback(async () => {
    try {
      const response = await getForces();
      setForces(response);
    } catch (error) {
      console.error('Error al obtener fuerzas:', error);
    }
  }, []);

  const fetchPlayers = useCallback(
    async (teamId: string) => {
      try {
        const { players } = await getPlayers(1, 30, undefined, undefined, false, teamId);
        setPlayers(players);
        setSelectedPlayers([]);
        setSelectAll(false);
      } catch (error) {
        console.error("Error al obtener jugadores:", error);
      }
    },
    []
  );

  useEffect(() => {
    fetchTeams();
    fetchForces();
  }, [fetchTeams, fetchForces]);

  const handleTeamChange = (event: SelectChangeEvent<string>) => {
    setSelectedTeam(event.target.value);
  };

  const handleSearchClick = () => {
    if (selectedTeam) {
      fetchPlayers(selectedTeam);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Equipo no seleccionado',
        text: 'Por favor, selecciona un equipo.',
        confirmButtonColor: '#667652',
      });
    }
  };

  const handlePlayerChange = (player: Player) => {
    const newSelectedPlayers = [...selectedPlayers];
    const index = newSelectedPlayers.findIndex(p => p._id === player._id);

    if (index > -1) {
      newSelectedPlayers.splice(index, 1);
    } else {
      newSelectedPlayers.push(player);
    }

    setSelectedPlayers(newSelectedPlayers);
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(players);
    }
    setSelectAll(!selectAll);
  };

  return (
    <div>
      <Helmet>
        <title>{siteName} - Credenciales</title>
      </Helmet>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Sidebar role="admin" />
        <ThemeProvider theme={themeFont}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 3 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Generar credenciales
          </Typography>

          <TextField
            required
            select
            label="Fuerza"
            value={selectedForce ?? ''}
            onChange={(e) => setSelectedForce(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
          >
            {forces.map((force) => (
              <MenuItem key={force._id} value={force.name}>
                {force.name}
              </MenuItem>
            ))}
          </TextField>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="team-select-label">Selecciona un equipo</InputLabel>
            <Select
              required
              labelId="team-select-label"
              id="team-select"
              value={selectedTeam}
              onChange={handleTeamChange}
              label="Selecciona un equipo"
            >
              {teams.map((team) => (
                <MenuItem key={team._id} value={team._id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" sx={{backgroundColor: '#667652'}} onClick={handleSearchClick}>
            Buscar
          </Button>

          {players.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                Lista de jugadores
              </Typography>

              <FormControlLabel
                control={<Checkbox checked={selectAll} onChange={handleSelectAllChange} />}
                label="Seleccionar todos"
              />

              <List>
                {players.map((player) => (
                  <ListItem key={player._id}>
                    <ListItemIcon>
                      <Checkbox
                        checked={selectedPlayers.some(p => p._id === player._id)}
                        onChange={() => handlePlayerChange(player)}
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        `${player.name} | Número: ${player.playerNumber} | Registrado el: ${new Date(player.createdAt).toLocaleString('es-ES', {
                          dateStyle: 'long'
                        })}`
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <GenerateTeamCredentialsLink
                players={selectedPlayers}
                baseUrl={baseUrl}
                teamName="equipo"
              />
            </Box>
          )}
        </Box>
        </ThemeProvider>
      </Box>
    </div>
  );
};

export default Credentials;
