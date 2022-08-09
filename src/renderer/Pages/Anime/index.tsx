//This will be the entrance component, which will display the respective tabs
import React from "react";
import {EAnime} from '../../Utils/enums'
import SearchViewer from "./SearchViewer";
import SeasonViewer from './SeasonViewer'

interface IProps {
  displayComponent: string;
}

function Anime(props: IProps) {
  const { displayComponent } = props;

  switch (displayComponent) {
    case EAnime.SEARCH_VIEWER:
      return (
        <>
          <SearchViewer/>
        </>
      )
    case EAnime.SEASON_VIEWER:
      return (
        <>
          <SeasonViewer />
        </>
      );
    default:
      return <>There's nothing in anime.</>;
  }
}

export default Anime;
