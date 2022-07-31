import React from "react";
import Jikan, { Season } from "jikan4.js";
import {DateTime} from 'luxon'
import { FormControl } from "@mui/material";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { SeasonType } from "jikan4.js";
import Axios from 'axios'

enum ESeasons {
    winter = 'Winter',
    spring = 'Spring',
    summer = 'Summer',
    autumn = 'Autumn'
}

function SeasonViewer() {
  const [searchAnime, setSearchAnime] = React.useState("");
  const [season, setSeason] = React.useState<SeasonType>(ESeasons.winter);
  const [allYears, setAllYears] = React.useState<Array<number | string>>()
  const [selectedYear, setSelectedYear] = React.useState<number>(DateTime.now().year)

  //ON LOAD, set the default values!
  React.useEffect( () => {
    //Load in the years
    let currentYear = DateTime.now().year
    let arrayOfYears = []
    arrayOfYears.push(currentYear)
    for (let i = 0; i < 30; i++){
        currentYear--
        arrayOfYears.push(currentYear)
    }
    setAllYears(arrayOfYears)
    //Check in the months
    let currentMonth = DateTime.now().month
    if (currentMonth <= 3){
        setSeason('Winter')
    } else if (currentMonth <= 6){
        setSeason('Spring')
    } else if (currentMonth <= 9){
        setSeason('Summer')
    } else if (currentMonth <= 12){
        setSeason('Winter')
    }

    //Load the upcoming Anime
    Axios.get(`https://api.jikan.moe/v4/seasons/${selectedYear}/${season}`)
    .then(

    )

  }, [])

  //On Search text box change (reactive ftw)
  React.useEffect( () => {


    }, [searchAnime])

  return (
    <>
      <TextField
        id="search-anime"
        label="Search"
        size="small"
        value={searchAnime}
        onChange={(e) => {
          setSearchAnime(e.target.value);
        }}
      />
      <FormControl variant="outlined" size='small' sx={{ ml: 1, minWidth: 120 }}>
        <InputLabel id="season-select-label">Season</InputLabel>
        <Select
          labelId="season-select-label"
          id="season-select"
          value={season}
          label="Season"
          onChange={(e) => {
            setSeason(e.target.value as SeasonType);
          }}
        >
          <MenuItem value={"Spring"}>Spring</MenuItem>
          <MenuItem value={"Summer"}>Summer</MenuItem>
          <MenuItem value={"Autumn"}>Autumn</MenuItem>
          <MenuItem value={"Winter"}>Winter</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" size='small' sx={{ ml: 1, minWidth: 120 }}>
        <InputLabel id="year-select-label">Year</InputLabel>
        <Select
          labelId="year-select-label"
          id="year-select"
          value={selectedYear}
          label="Year"
          onChange={(e) => {
            setSelectedYear((typeof e.target.value === 'string') ? parseInt(e.target.value) : e.target.value);
          }}
        >
          {allYears?.map((year, i) => (
            <MenuItem key={i} value={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

export default SeasonViewer;
