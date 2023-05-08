//This will be the entrance component, which will display the respective tabs
import React from "react";
import {EManga} from '../../Utils/enums'
import SearchViewer from "./SearchViewer";

interface IProps {
  displayComponent: string;
}

function Manga(props: IProps) {
  const { displayComponent } = props;
  console.log(displayComponent)
  switch (displayComponent) {
    case EManga.SEARCH_VIEWER:
      return (
        <>
          <SearchViewer/>
        </>
      )
    default:
      return <>There's nothing in anime.</>;
  }
}

export default Manga;
