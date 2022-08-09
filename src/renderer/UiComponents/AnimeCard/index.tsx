import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { makeStyles } from "@material-ui/core/styles";

interface IProps {
  animeObj: {
    [key: string]: any;
  };
}
const useStyles = makeStyles((theme) => ({
  root: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "47%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

function AnimeCard(props: IProps) {
  const { animeObj } = props;
  const [summaryStats, setSummaryStats] = React.useState("");
  const [themesGenres, setThemesGenres] = React.useState<Array<string>>([""]);
  const classes = useStyles();

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

  return (
    <>
      <Card className={classes.root} sx={{ display: "flex", margin: "2px" }}>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
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
                <Chip key={i} label={str} sx={{ backgroundColor: "#1de9b6" }} />
              ))}
            </Stack>
          </Box>
        </Box>
      </Card>
    </>
  );
}

export default AnimeCard;
