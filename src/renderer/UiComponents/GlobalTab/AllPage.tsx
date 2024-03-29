import React from "react";
import Home from "../../Pages/Home";
import Gallery from "../../Pages/Gallery";
import Anime from "../../Pages/Anime";
import Productivity from "../../Pages/Productivity";
import { EBasePage } from "../../Utils/enums";
import Manga from "../../Pages/Manga";

//This is an 'all page' that will determine which base page it will create

interface IProps {
  mainPage: string; //rightfully: EBasePage
  subPage: string; //rightfully: EGallery | EAnime
}

function AllPage(props: IProps) {
  const { mainPage, subPage } = props;

  switch (mainPage) {
    case EBasePage.HOME:
      return <Home />;
    case EBasePage.ANIME:
      return <Anime displayComponent={subPage} />;
    case EBasePage.MANGA:
      return <Manga displayComponent={subPage} />;
    case EBasePage.GALLERY:
      return <Gallery displayComponent={subPage} />;
    case EBasePage.PRODUCTIVITY:
      return <Productivity displayComponent={subPage} />;
    default:
      return <>There is no pages to show on allpage</>;
  }
}

export default AllPage;
