import React from "react";
import Jikan, { Season } from "jikan4.js";
import { DateTime } from "luxon";
import { FormControl } from "@mui/material";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { SeasonType } from "jikan4.js";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import AnimeCard from "../../../UiComponents/AnimeCard";
import Axios from "axios";
import Dialog from "@mui/material/Dialog";

import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import AnimeInfoViewer from "../AnimeInfoViewer";

enum ESeasons {
  winter = "Winter",
  spring = "Spring",
  summer = "Summer",
  fall = "Fall",
}

enum EMode {
  season = "season",
  search = "search",
}

enum AnimeType {
  TV = "tv",
  MOVIE = "movie",
  OVA = "ova",
  SPECIAL = "special",
  ONA = "ona",
  MUSIC = "music",
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const apiEndpoint = "https://api.jikan.moe/v4";

function SeasonViewer() {
  const [season, setSeason] = React.useState<SeasonType>(ESeasons.winter);
  const [allYears, setAllYears] = React.useState<Array<number | string>>();
  const [selectedYear, setSelectedYear] = React.useState<number>(
    DateTime.now().year
  );
  const [animeList, setAnimeList] = React.useState<Array<any>>();
  const [currentAnimePage, setCurrentAnimePage] = React.useState(1);
  const [maxAnimePages, setMaxAnimePages] = React.useState(1);

  const [openAnimeDialog, setOpenAnimeDialog] = React.useState(false);

  const [selectedAnimeID, setSelectedAnimeID] = React.useState<string>("");

  const handleAnimeClickOpen = () => {
    //setSelectedAnimeID(selectedAnimeID);
    console.log(selectedAnimeID);
    setOpenAnimeDialog(true);
  };

  const handleAnimeClickClose = () => {
    setOpenAnimeDialog(false);
  };

  //ON LOAD, set the default values!
  React.useEffect(() => {
    //Load in the years
    let currentYear = DateTime.now().year;
    let arrayOfYears = [];
    arrayOfYears.push(currentYear);
    for (let i = 0; i < 30; i++) {
      currentYear--;
      arrayOfYears.push(currentYear);
    }
    setAllYears(arrayOfYears);
    //Check in the months
    let currentMonth = DateTime.now().month;
    if (currentMonth <= 3) {
      setSeason(ESeasons.winter);
    } else if (currentMonth <= 6) {
      setSeason(ESeasons.spring);
    } else if (currentMonth <= 9) {
      setSeason(ESeasons.summer);
    } else if (currentMonth <= 12) {
      setSeason(ESeasons.fall);
    }

    //Load the upcoming Anime
    const params = {
      page: 1,
    };
    Axios.get(`${apiEndpoint}/seasons/${selectedYear}/${season}`, {
      params,
    }).then((response) => {
      setMaxAnimePages(Math.ceil(response.data.pagination.items.total / 25));
      setAnimeList(response.data.data);
    });
  }, []);

  //On Season/Year change
  React.useEffect(() => {
    const params = {
      page: 1,
    };
    Axios.get(`${apiEndpoint}/seasons/${selectedYear}/${season}`, {
      params,
    }).then((response) => {
      setMaxAnimePages(Math.ceil(response.data.pagination.items.total / 25));
      setAnimeList(response.data.data);
    });
    setCurrentAnimePage(1);
  }, [season, selectedYear]);

  //On page change
  React.useEffect(() => {
    const params = {
      page: currentAnimePage,
    };
    Axios.get(`${apiEndpoint}/seasons/${selectedYear}/${season}`, {
      params,
    }).then((response) => {
      setMaxAnimePages(Math.ceil(response.data.pagination.items.total / 25));
      setAnimeList(response.data.data);
    });
  }, [currentAnimePage]);

  //Handle the changes to the pages

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentAnimePage(value);
  };

  return (
    <>
      <Dialog
        fullScreen
        open={openAnimeDialog}
        onClose={handleAnimeClickClose}
        TransitionComponent={Transition}
      >
        <AnimeInfoViewer
          malId={selectedAnimeID}
          handleClose={handleAnimeClickClose}
        />
      </Dialog>
      <FormControl
        variant="outlined"
        size="small"
        sx={{ ml: 1, minWidth: 120 }}
      >
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
          <MenuItem value={"Fall"}>Autumn</MenuItem>
          <MenuItem value={"Winter"}>Winter</MenuItem>
        </Select>
      </FormControl>
      <FormControl
        variant="outlined"
        size="small"
        sx={{ ml: 1, minWidth: 120 }}
      >
        <InputLabel id="year-select-label">Year</InputLabel>
        <Select
          labelId="year-select-label"
          id="year-select"
          value={selectedYear}
          label="Year"
          onChange={(e) => {
            setSelectedYear(
              typeof e.target.value === "string"
                ? parseInt(e.target.value)
                : e.target.value
            );
          }}
        >
          {allYears?.map((year, i) => (
            <MenuItem key={i} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ width: "100%", flexFlow: "wrap", padding: "5px" }}>
        <Pagination
          size="large"
          sx={{ width: "100%" }}
          count={maxAnimePages}
          page={currentAnimePage}
          onChange={handlePageChange}
        />
      </Box>

      {/* Where the anime cards will go to, still need a top section to regulate pagination */}
      <Box sx={{ display: "flex", flexFlow: "wrap", padding: "5px" }}>
        {animeList?.map((obj, i) => (
          <AnimeCard
            key={i}
            animeObj={obj}
            setSelectedID={setSelectedAnimeID}
            setOpenDialog={handleAnimeClickOpen}
          />
        ))}
      </Box>
    </>
  );
}

export default SeasonViewer;
