import React from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { DefaultNewButton } from "../../Utils/componentStyle";
import MangaCard from "../../UiComponents/MangaCard";
import qs from "qs";

//We will use consumet for retrieving Manga chapters as it's more straightforward
//But we will use MangaDEX API for search as it's more robust compared to consumet.

function MangaSearchViewer() {
  const [searchManga, setSearchManga] = React.useState("");
  const [searchReturnList, setSearchReturnList] = React.useState<Array<any>>();
  const [totalNumPages, setTotalNumPages] = React.useState(1);
  const [currentMangaPage, setCurrentMangaPage] = React.useState(1);
  const [maxMangaPages, setMaxMangaPages] = React.useState(1);

  const [openMangaDialog, setOpenMangaDialog] = React.useState(false);
  const [selectedMangaID, setSelectedMangaID] = React.useState<string>("");

  //OFFSEt

  function searchMangaOnClick() {
    const params = {
      limit: 20,
      offset: (currentMangaPage - 1) * 20,
      title: searchManga,
      includedTagsMode: "AND",
      excludedTagsMode: "OR",
      contentRating: ["safe", "suggestive", "erotica"],
      includes: ["cover_art"],
      order: {
        latestUploadedChapter: "desc",
      },
    };
    axios
      .get("https://api.mangadex.org/manga", {
        params,
        paramsSerializer: (params) =>
          qs.stringify(params, {
            arrayFormat: "brackets",
            encodeValuesOnly: true,
          }),
      })
      .then((response) => {
        setSearchReturnList(response.data.data);
        console.log(response.data.data)
        let calcPages = response.data.total / response.data.limit;
        let actualPages = Math.ceil(calcPages);
        setTotalNumPages(actualPages);
      });
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <TextField
          sx={{ flexGrow: 1 }}
          id="search-anime"
          label="Search for Manga"
          value={searchManga}
          onChange={(e) => {
            setSearchManga(e.target.value);
          }}
        />
        <DefaultNewButton
          sx={{ flexGrow: 0.2, marginLeft: "7px" }}
          variant="contained"
          onClick={searchMangaOnClick}
        >
          Search
        </DefaultNewButton>
      </Box>

      <Box sx={{ display: "flex", flexFlow: "wrap", padding: "5px" }}>
        {searchReturnList?.map((obj, i) => (
          <MangaCard
            mangaObj={obj}
            setSelectedID={setSelectedMangaID}
            setOpenDialog={setOpenMangaDialog}
          />
        ))}
      </Box>
    </>
  );
}

export default MangaSearchViewer;
