import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { WebTorrent } from "webtorrent";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageSpotlight from "./ImageSpotlight";
import VideoCard from "../../../UiComponents/VideoCard";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { EIpcListener } from "../../../Utils/enums";
import MediaPlayer from "../../../UiComponents/MediaPlayer";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { EmptySeparator, FullContainerView } from "../../../Utils/commonStyles";

interface IProps {
    imageColumnsCount: string,
    imageList: Array<string>
}

function ImageView(props:IProps) {

  const {imageColumnsCount, imageList} = props

  const [showBackDrop, setShowBackDrop] = React.useState(false);
  const [clickedImage, setClickedImage] = React.useState(0);
  const [spotlightImage, setSpotlightImage] = React.useState("");

  function showImageSpotlight(index: number) {
    setClickedImage(index);
    setSpotlightImage(imageList[index]);
    setShowBackDrop(true);
  }

  //Image navigation
  function navigateLeft() {
    if (clickedImage !== 0) {
      let newCurrIndex = clickedImage;
      newCurrIndex -= 1;
      setClickedImage(newCurrIndex);
      setSpotlightImage(imageList[newCurrIndex]);
    }
  }

  function navigateRight() {
    if (clickedImage != imageList.length - 1) {
      let newCurrIndex = clickedImage;
      newCurrIndex += 1;
      setClickedImage(newCurrIndex);
      setSpotlightImage(imageList[newCurrIndex]);
    }
  }


  return (
    <FullContainerView width="100%" height="auto">

      {/* Accordion Full Content display */}
      <EmptySeparator />

      {/* Image List */}
      <ImageList sx={{ width: "100%" }} cols={parseInt(imageColumnsCount)}>
        {imageList.map((item, i) => (
          <ImageListItem sx={{ height: "100% !important" }} key={i}>
            <img src={`${item}`} onClick={() => showImageSpotlight(i)} />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Image Spotlight */}

      {showBackDrop && (
        <ImageSpotlight
          currImage={spotlightImage}
          closeImage={setShowBackDrop}
          leftImage={navigateLeft}
          rightImage={navigateRight}
        />
      )}
    </FullContainerView>
  );
}

export default ImageView;
