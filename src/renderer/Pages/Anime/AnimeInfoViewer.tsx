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
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface IProps {
  malId: string;
  handleClose: any;
}

//Return is dynamic cos API
interface animeInfoReturn {
  [key: string | number]: any;
}

function AnimeInfoViewer(props: IProps) {

  const {malId, handleClose} = props

  const [loaded, setLoadedState] = React.useState(false);
  const [animeInfo, setAnimeInfo] = React.useState<animeInfoReturn>();

  const [imgURL, setImgURL] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [titleJap, setTitleJap] = React.useState("");
  const [titleSynonym, setTitleSynonyms] = React.useState([]);
  const [duration, setDuration] = React.useState("");
  const [synopsis, setSynopsis] = React.useState("");
  const [genre, setGenres] = React.useState("");
  const [episodes, setEpisodes] = React.useState(0);
  const [airStatus, setAirStatus] = React.useState("");

  const testingid = "51678";

  const closeTheView = () => {
    handleClose(false)
  }

  React.useEffect(() => {
    console.log("show")
    setLoadedState(false)
    axios
      .get(`https://api.jikan.moe/v4/anime/${testingid}/full`)
      .then((response) => {
        setAnimeInfo(response.data.data);
        setLoadedState(false);
        console.log(animeInfo)
      })
      .catch((error) => {
        console.log("Something went wrong!");
      });
  }, [malId]);

  // React.useEffect(() => {
  //   setImgURL(animeInfo?.images.jpg.images_url)

  // }, [animeInfo])

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
        {!loaded && <div>
          <Paper elevation={3}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <img src={animeInfo?.images.jpg.image_url}/>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h3">{animeInfo?.title}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </div>}
    </>
  );
}

export default AnimeInfoViewer;
