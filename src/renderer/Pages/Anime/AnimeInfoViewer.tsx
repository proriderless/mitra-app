import React from "react";

//Deal with transiition
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
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
import { CardActions } from "@mui/material";
import Button from "@mui/material/Button";

//Self built component:
import HeroComponent from "../../UiComponents/HeroContainer";

interface IProps {
  malId: string;
  handleClose: any;
}

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

  const testingid = "51678";

  const closeTheView = () => {
    handleClose(false);
  };

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
        <div style={{width: "80%", textAlign:"center"}}>
          <HeroComponent title={animeInfo?.title} description={summaryStats} imgUrl={imgURL} backgroundColor="fef"/>
        </div>
        {/* <Card sx={{ display: "flex", margin: "2px" }}>
          <CardMedia component="img" sx={{ width: "50%", objectFit: "contain"}} image={imgURL} />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h6">
                {animeInfo?.title}
              </Typography>
              <Typography
                component="div"
                variant="subtitle1"
                color="text.secondary"
              >
                {summaryStats}
              </Typography>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 200,
                  overflow: "hidden",
                  overflowY: "scroll",
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
            </CardContent>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                mb: "2px",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={1}
                sx={{ flexWrap: "wrap" }}
              >
                {themesGenres.map((str, i) => (
                  <Chip
                    key={i}
                    label={str}
                    sx={{ backgroundColor: "#1de9b6" }}
                  />
                ))}
              </Stack>
            </Box>
            <CardActions></CardActions>
          </Box>
        </Card> */}
        </>
      )}
    </>
  );
}

export default AnimeInfoViewer;
