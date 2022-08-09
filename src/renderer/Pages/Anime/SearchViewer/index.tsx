import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import AnimeCard from "../../../UiComponents/AnimeCard";
import Axios from "axios";

const apiEndpoint = "https://api.jikan.moe/v4";

function SearchViewer() {
  const [searchAnime, setSearchAnime] = React.useState("");
  const [animeList, setAnimeList] = React.useState<Array<any>>();
  const [currentAnimePage, setCurrentAnimePage] = React.useState(1);
  const [maxAnimePages, setMaxAnimePages] = React.useState(1);
  const [sfwCheck, setSfwCheck] = React.useState(true);

  function searchAnimeOnClick() {
    const params = {
      q: searchAnime,
      limit: 10,
      page: 1,
      sfw: sfwCheck,
    };

    Axios.get(`${apiEndpoint}/anime`, {
      params,
    }).then((response) => {
      setMaxAnimePages(Math.ceil(response.data.pagination.items.total / 10));
      setAnimeList(response.data.data);
    });
    setCurrentAnimePage(1);
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentAnimePage(value);
  };

  //On page change
  React.useEffect(() => {
    const params = {
      q: searchAnime,
      limit: 10,
      page: currentAnimePage,
      sfw: sfwCheck,
    };
    Axios.get(`${apiEndpoint}/anime`, {
      params,
    }).then((response) => {
      setMaxAnimePages(Math.ceil(response.data.pagination.items.total / 10));
      setAnimeList(response.data.data);
    });
  }, [currentAnimePage]);

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
      <FormGroup row sx={{ display: "inline" }}>
        <FormControlLabel
          control={
            <Checkbox
              sx={{ marginLeft: "5px" }}
              checked={sfwCheck}
              onChange={() => {
                setSfwCheck(!sfwCheck);
              }}
              inputProps={{ "aria-label": "set sfw option" }}
            />
          }
          label="SFW?"
        />
        <IconButton
          aria-label="search anime"
          color="secondary"
          onClick={searchAnimeOnClick}
        >
          <SearchIcon />
        </IconButton>
      </FormGroup>

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
          <AnimeCard animeObj={obj} />
        ))}
      </Box>
    </>
  );
}

export default SearchViewer;
