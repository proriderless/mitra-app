import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { makeStyles } from "@material-ui/core/styles";
import { CardActions } from "@mui/material";
import Button from "@mui/material/Button";

interface IProps {
  animeObj: {
    [key: string]: any;
  };
  setOpenDialog: any; //function
  setSelectedID: any;
}
const useStyles = makeStyles((theme) => ({
  root: {
    transition: "transform 0.15s ease-in-out",
    width: "30%",
    [theme.breakpoints.down("lg")]: {
      width: "47%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  cardHovered: {
    transform: "scale3d(1.05, 1.05, 1)",
  },
}));

function AnimeCard(props: IProps) {
  const { animeObj, setSelectedID, setOpenDialog } = props;
  //const { animeObj } = props;
  const [summaryStats, setSummaryStats] = React.useState("");
  const [themesGenres, setThemesGenres] = React.useState<Array<string>>([""]);
  const classes = useStyles();

  const [raisedState, setRaisedState] = React.useState({
    raised: false,
    shadow: 1,
  });

  const {
    mal_id,
    url,
    images,
    genres,
    themes,
    score,
    status,
    synopsis,
    title,
    type,
    year,
    popularity,
    episodes,
    aired,
    airing,
    duration,
  } = animeObj;

  function handleClickShowAnime() {
    console.log("test");
    setSelectedID(mal_id);
    console.log(setOpenDialog);
    setOpenDialog(true);
  }

  React.useEffect(() => {
    //Set the summary stats
    let tmpResultText = "";

    tmpResultText += type + " - ";
    tmpResultText += duration + " - ";
    tmpResultText += episodes + " Episodes - ";
    tmpResultText += "Score: " + score;

    setSummaryStats(tmpResultText);

    //Set the genres + themes
    let tmpGenreThemesArr = [];

    for (let genre of genres) {
      tmpGenreThemesArr.push(genre.name);
    }

    for (let theme of themes) {
      tmpGenreThemesArr.push(theme.name);
    }
    setThemesGenres(tmpGenreThemesArr);
  }, [animeObj]);


  //onClick={()=>handleClick}

  return (
    <>
      <Card
      
        className={classes.root}
        sx={{ display: "flex", margin: "2px" }}
        classes={{ root: raisedState.raised ? classes.cardHovered : "" }}
        onMouseOver={()=>setRaisedState({ raised: true, shadow:3})} 
        onMouseOut={()=>setRaisedState({ raised:false, shadow:1 })} 
        raised={raisedState.raised}
        onClick={handleClickShowAnime}
      >
        <CardMedia
          component="img"
          sx={{ width: "121px", objectFit: "cover" }}
          image={images.jpg.large_image_url}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h6">
              {title}
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
                {synopsis}
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
                <Chip key={i} label={str} sx={{ backgroundColor: "#29AB87" }} />
              ))}
            </Stack>
          </Box>
          {/* <CardActions>
            <Button size="small" onClick={handleClickShowAnime}>Learn More</Button>
          </CardActions> */}
        </Box>
      </Card>
    </>
  );
}

export default AnimeCard;
