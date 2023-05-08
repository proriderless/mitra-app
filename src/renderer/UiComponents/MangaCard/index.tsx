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
  mangaObj: {
    [key: string]: any;
  };
  setOpenDialog: any;
  setSelectedID: any;
}

function MangaCard(props: IProps) {
  const { mangaObj, setSelectedID, setOpenDialog } = props;
  const { id, type, attributes, relationships } = mangaObj;

  //Main attributes
  const titleEN = attributes.title.en;
  const titleJP = attributes.title.jp;
  const description = attributes.description.en;
  const themesRAW = attributes.tags;

  const themesCleaned = [];

  for (let item of themesRAW) {
    themesCleaned.push(item.attributes.name.en);
  }

  console.log(themesCleaned);

  //COVER ID

  const filteredContentCoverObj = relationships.filter(function (el: any) {
    return el.type === "cover_art";
  });

  const coverArtId = filteredContentCoverObj[0].attributes.fileName;

  console.log(description);
  console.log(titleEN);

  const deriveCoverContent = `https://mangadex.org/covers/${id}/${coverArtId}.512.jpg`;

  return (
    <Card sx={{ display: "flex", width: "100%", marginTop: "2px", marginBottom: "2px", alignItems: "space-between"}}>
      <CardMedia
        component="img"
        sx={{ width: "215px", objectFit: "cover" }}
        image={deriveCoverContent}
        alt={titleEN}
      />
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "space-between" }}>
        <CardContent sx={{ alignItems: "space-between" }}>
          <Typography component="div" variant="h4" sx={{marginBottom: "5px"}}>
            {titleEN}
          </Typography>
          {themesCleaned.map((str, i) => (
            <Chip
              key={i}
              label={str}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: "#29AB87" }}
            />
          ))}
          <Typography sx={{marginTop: "20px"}}>
            {description}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

export default MangaCard;
