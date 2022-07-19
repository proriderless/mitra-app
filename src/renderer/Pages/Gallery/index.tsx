//This will be the entrance component, which will display the respective tabs
import React from "react";
import Explorer from "./Explorer";
import {EGallery} from "../../Utils/enums"

interface IProps {
  displayComponent: string
}

function Gallery(props: IProps) {
  const { displayComponent } = props;

  switch (displayComponent){
    case EGallery.EXPLORER:
      return (
        <>
          <Explorer />
        </>
      )
    default:
      return (
        <>
          There's nothing in Gallery.
        </>
      )
  }

}

export default Gallery;
