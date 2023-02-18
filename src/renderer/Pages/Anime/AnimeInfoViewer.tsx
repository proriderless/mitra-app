import React from "react";

//Deal with transiition
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { CardActions, CardHeader } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";

//Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { DateTime, Interval } from "luxon";

//Self built component:
import HeroComponent from "../../UiComponents/HeroContainer";

interface IProps {
  malId: string;
  handleClose: any;
}

const CardContentNoPadding = styled(CardContent)`
  padding-bottom: 0;
  &:last-child {
    padding-bottom: 10;
  }
`;

//Return is dynamic cos API
interface animeInfoReturn {
  [key: string | number]: any;
}

function AnimeInfoViewer(props: IProps) {
  const { malId, handleClose } = props;

  const [loaded, setLoadedState] = React.useState(false);
  const [animeInfo, setAnimeInfo] = React.useState<animeInfoReturn>();

  const [summaryStats, setSummaryStats] = React.useState("");
  const [themesGenres, setThemesGenres] = React.useState([""]);

  const [imgURL, setImgURL] = React.useState("");
  const [episodesList, setEpisodesList] = React.useState<
    Array<{ Episode: string }>
  >([]);

  const testingid = "51678";

  const closeTheView = () => {
    handleClose(false);
  };

  //Determine the number of episodes that have been aired since the start
  function determineNumOfEpisodes() {
    if (animeInfo != null) {
      let status = animeInfo.airing;
      if (animeInfo.airing === false) {
        return animeInfo.episodes;
      } else {
        let currentDate = DateTime.now();
        let airedDate = DateTime.fromISO(animeInfo.aired.from);
        console.log(currentDate);
        console.log(airedDate);
        let diffIntObj = Interval.fromDateTimes(airedDate, currentDate);
        console.log(diffIntObj);
        let diffWeeks = diffIntObj.length("weeks");

        if (Number.isNaN(diffWeeks)) {
          //not aired
          return -1;
        } else {
          return Math.floor(diffWeeks) + 1;
        }
      }
    }
  }

  React.useEffect(() => {
    console.log("show");
    setLoadedState(false);
    axios
      .get(`https://api.jikan.moe/v4/anime/${malId}/full`)
      .then((response) => {
        setAnimeInfo(response.data.data);
        setLoadedState(false);
        console.log(animeInfo);
      })
      .catch((error) => {
        console.log("Something went wrong!");
      });
  }, [malId]);

  React.useEffect(() => {
    let tmpResultText = "";

    console.log(animeInfo);
    if (animeInfo != null) {
      setImgURL(animeInfo?.images.jpg.image_url);

      let numOfEpisodes = determineNumOfEpisodes();
      console.log("Num Of Eps " + numOfEpisodes);
      let episodeNames = [];

      //Add the episode name, for now we keep it generic.
      //But easy to modify in the future
      for (let i = 1; i <= numOfEpisodes; i++) {
        episodeNames.push({ Episode: "Episode: " + i });
      }

      setEpisodesList(episodeNames);

      tmpResultText += animeInfo?.type + " - ";
      tmpResultText += animeInfo?.duration + " - ";
      tmpResultText += animeInfo?.episodes + " Episodes - ";
      tmpResultText += "Score: " + animeInfo?.score;

      setSummaryStats(tmpResultText);

      //Set the genres + themes
      let tmpGenreThemesArr = [];

      for (let genre of animeInfo?.genres) {
        tmpGenreThemesArr.push(genre.name);
      }

      for (let theme of animeInfo?.themes) {
        tmpGenreThemesArr.push(theme.name);
      }
      setThemesGenres(tmpGenreThemesArr);
    }
  }, [animeInfo]);

  return (
    <>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Anime
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={closeTheView}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {!loaded && (
        <>
          <div style={{ width: "100%" }}>
            <div
              style={{
                backgroundColor:
                  "linear-gradient(90deg, rgba(51,235,190,0.47942927170868344) 0%, rgba(67,244,186,1) 100%);",
                background: "rgba(76, 175, 80)",
                filter: "blur(8px)",
                zIndex: 1,
                width: "100%",
              }}
            ></div>
            <HeroComponent
              title={animeInfo?.title}
              title_eng={animeInfo?.title_english}
              title_jap={animeInfo?.title_japanese}
              description={summaryStats}
              imgUrl={imgURL}
              backgroundColor="fef"
            />
          </div>
          <Card
            sx={{
              flex: "0 0 auto",
              width: "80%",
              //height: "auto",
              marginTop: "10px",
              marginLeft: "10%",
              marginRight: "10%",
              marginBottom: "2px",
              paddingBottom: "0px",
            }}
          >
            <CardHeader title="Synopsis" />
            <CardContentNoPadding>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  component="div"
                  variant="subtitle1"
                  color="text.secondary"
                >
                  {animeInfo?.synopsis}
                </Typography>
              </Box>
            </CardContentNoPadding>
          </Card>

          <TableContainer
            component={Paper}
            sx={{
              width: "80%",
              marginTop: "20px",
              marginLeft: "10%",
              marginRight: "10%",
            }}
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Episode</TableCell>
                  <TableCell align="left">Play</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {episodesList.map((row, i) => (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.Episode}
                    </TableCell>
                    <TableCell align="left">
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={closeTheView}
                        aria-label="close"
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}

export default AnimeInfoViewer;
