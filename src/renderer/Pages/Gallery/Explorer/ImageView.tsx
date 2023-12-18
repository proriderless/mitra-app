import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageSpotlight from "./ImageSpotlight";
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
