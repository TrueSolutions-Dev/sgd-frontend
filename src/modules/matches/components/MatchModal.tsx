import { Match } from "@/types/Match";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box, Button, Grid, IconButton, Modal,
  TableContainer,
  TextField, Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import React, { useState } from "react";
import { getMatches } from "../services/getMatches.service";


interface MatchModalProps {
  open: boolean;
  handleClose: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ open, handleClose }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [roundIndex, setRoundIndex] = useState<string>("0");

  const [matchName, setMatchName] = useState("");
  const [matchDate, setMatchDate] = useState<Dayjs | null>(null);
  const [matchHours, setMatchHours] = useState<(Dayjs | null)[]>([]);
  const [stadiums, setStadiums] = useState<string[]>([]);

  const handleGenerate = async () => {
    try {
      const adjustedRoundIndex = (parseInt(roundIndex) - 1).toString();
      const response = await getMatches(adjustedRoundIndex);
      if (Array.isArray(response)) {
        setMatches(response);
      } else {
        console.error("Formato incorrecto en la respuesta:", response);
      }
    } catch (error) {
      console.error("Error al generar partidos:", error);
    }
  };

  const handleStadiumChange = (index: string, value: string) => {
    setStadiums((prevStadiums) => ({
      ...prevStadiums,
      [index]: value,
    }));
  };

  const handleHourChange = (index: number, newHour: Dayjs | null) => {
    setMatchHours((prevMatchHours) => ({
      ...prevMatchHours,
      [index]: newHour,
    }));
  };

  const handleSave = async () => {
    const groupedMatches = matches.map((match, index) => ({
      stadium: stadiums[index] || " ",
      matchHour: matchHours[index] ? matchHours[index]?.format("h:mm A") : "",
      teamOne: match.teamOne.name,
      teamTwo: match.teamTwo.name,
      teamOneScore: 0,
      teamTwoScore: 0,
      winner: null,
      draw: false,
    }));

    const matchData = {
      matchName,
      matchDate: matchDate?.format("YYYY-MM-DD"),
      groupedMatches,
    };
    console.log(matchData);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: 1300,
        maxHeight: "90vh",
        overflowY: "auto",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
      }}>
        <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" mb={2}>
          Generar enfrentamientos
        </Typography>
        <TextField
          label="Nombre"
          variant="outlined"
          onChange={(e) => setMatchName(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        />
        <TextField
          value={roundIndex}
          type="number"
          label="Jornada"
          variant="outlined"
          fullWidth
          onChange={(e) => setRoundIndex(e.target.value)}
          sx={{ mb: 1 }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker onChange={(newDate) => setMatchDate(newDate)} label="Fecha" sx={{ width: "100%", mb: 2 }} />
        </LocalizationProvider>
        <Button
          fullWidth
          variant="contained"
          onClick={handleGenerate}
          sx={{
            backgroundColor: "#667652",
            "&:hover": { backgroundColor: "#5d6b4b" },
            mb: 2
          }}
        >
          Generar
        </Button>
        <TableContainer>
          <Grid container spacing={3}>
            {matches.map((match, index) => {
              return (
                <Grid item xs={12} sm={6} key={match._id}>
                  <Grid container>
                    <Grid item xs={12}>
                      <TextField
                        label="Lugar"
                        variant="outlined"
                        fullWidth
                        value={stadiums[index] || ""}
                        onChange={(e) => handleStadiumChange(index.toString(), e.target.value)}
                        sx={{mt: 1}}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker 
                            onChange={(newHour) => handleHourChange(index, newHour)}
                            label="Hora" 
                            sx={{ width: "150px", mt: 1 }} />
                        </LocalizationProvider>
                        <Typography>{match.teamOne?.name}</Typography>
                        <Typography> ⚔️ </Typography>
                        <Typography>{match.teamTwo?.name}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </TableContainer>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: "#667652",
            "&:hover": { backgroundColor: "#5d6b4b" },
            mb: 2
          }}
        >
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default MatchModal;
