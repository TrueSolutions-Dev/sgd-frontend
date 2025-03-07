import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react';

interface FilterComponentProps {
  filterBy: string;
  setFilterBy: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  userRole: string;
  teamName?: string;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ filterBy, setFilterBy, searchValue, setSearchValue, userRole, teamName }) => {
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    if (userRole !== 'team') {
      setFilterBy(event.target.value);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '30px' }}>
      <Grid item xs={4} sm={3}>
        <FormControl fullWidth>
          <InputLabel id="filter-label">Filtrar por</InputLabel>
          <Select
            labelId="filter-label"
            id="filter-select"
            value={userRole === 'team' ? 'team' : filterBy}
            label="Filtrar por"
            onChange={handleFilterChange}
            disabled={userRole === 'team'}
          >
            <MenuItem value="name">Nombre</MenuItem>
            <MenuItem value="force">Fuerza</MenuItem>
            <MenuItem value="team">Equipo</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={8} sm={9}>
        <TextField
          id="outlined-basic"
          label="Buscar..."
          variant="outlined"
          fullWidth
          value={userRole === 'team' ? teamName || searchValue : searchValue}
          onChange={handleSearchChange}
          disabled={userRole === 'team'}
        />
      </Grid>
    </Grid>
  );
};

export default FilterComponent;
