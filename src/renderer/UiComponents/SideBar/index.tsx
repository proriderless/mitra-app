import React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import {
  DrawerHeader,
  Drawer,
  StyledSideBarList,
  StyledInnerSideBarList,
} from "./SideBarStyledComp";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import MovieIcon from "@mui/icons-material/Movie";
import PreviewIcon from "@mui/icons-material/Preview";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import CollectionsIcon from "@mui/icons-material/Collections";
import ImageIcon from "@mui/icons-material/Image";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  EBasePage,
  EGallery,
  EAnime,
  EProductivity,
  EIpcListener,
  EManga,
} from "../../Utils/enums";
import { TabPageContext } from "../../Provider";

/// ADDD EDITORJS for note-taking! ///

declare global {
  interface Window {
    ipcRenderer: any;
  }
}

function SideBarComp() {
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = React.useState(true);
  const [openProductivityList, setOpenProductivtyList] = React.useState(true);
  const [openAnimeList, setOpenAnimeList] = React.useState(true);
  const [openMangaList, setOpenMangaList] = React.useState(true);
  const [openImageViewerList, setOpenImageViewerList] = React.useState(true);

  const { tabPages, setTabPages } = React.useContext(TabPageContext);

  const openStartupFile = () => {
    window.ipcRenderer
      .invoke(EIpcListener.STARTUP_FOLDER)
      .then((openResult: any) => {});
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleClickAnime = () => {
    setOpenAnimeList(!openAnimeList);
  };

  const handleClickManga = () => {
    setOpenMangaList(!openMangaList)
  }

  const handleClickProductivity = () => {
    setOpenProductivtyList(!openProductivityList);
  };

  const handleClickImage = () => {
    setOpenImageViewerList(!openImageViewerList);
  };

  const handleClickTraverse = (mainPage: string, subPage: string) => {
    let updatedObject = {
      ...tabPages,
    };
    updatedObject[mainPage] = subPage;

    setTabPages(updatedObject);
  };

  return (
    <Drawer variant="permanent" open={openDrawer}>
      <DrawerHeader sx={{marginTop: "20px",}}>
        {openDrawer ? (
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleDrawerOpen}>
            <ChevronRightIcon />
          </IconButton>
        )}
      </DrawerHeader>

      <Divider />

      <StyledSideBarList
        sx={{
          width: "100%",
          maxWidth: 360,
          //bgcolor: "background.paper",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
          ></ListSubheader>
        }
      >
        <ListItemButton>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton onClick={handleClickProductivity}>
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary="Productivity" />
          {openProductivityList ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openProductivityList} timeout="auto" unmountOnExit >
          <StyledInnerSideBarList component="div" disablePadding>
            <ListItemButton
              onClick={() =>
                handleClickTraverse(
                  EBasePage.PRODUCTIVITY,
                  EProductivity.MAIN_CALENDAR
                )
              }
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItemButton>
          </StyledInnerSideBarList>
        </Collapse>

        <ListItemButton onClick={handleClickAnime}>
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary="Anime Viewer" />
          {openAnimeList ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openAnimeList} timeout="auto" unmountOnExit>
          <StyledInnerSideBarList component="div" disablePadding>
            <ListItemButton
              onClick={() =>
                handleClickTraverse(EBasePage.ANIME, EAnime.SEARCH_VIEWER)
              }
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <CalendarViewMonthIcon />
              </ListItemIcon>
              <ListItemText primary="Search" />
            </ListItemButton>
            <ListItemButton
              onClick={() =>
                handleClickTraverse(EBasePage.ANIME, EAnime.SEASON_VIEWER)
              }
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <CalendarViewMonthIcon />
              </ListItemIcon>
              <ListItemText primary="Season Viewer" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 3 }}>
              <ListItemIcon>
                <PreviewIcon />
              </ListItemIcon>
              <ListItemText primary="Watcher" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 3 }}>
              <ListItemIcon>
                <LiveTvIcon />
              </ListItemIcon>
              <ListItemText primary="Now Playing" />
            </ListItemButton>
          </StyledInnerSideBarList>
        </Collapse>

        {/* MANGA */}

        <ListItemButton onClick={handleClickManga}>
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary="Manga" />
          {openMangaList ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMangaList} timeout="auto" unmountOnExit>
          <StyledInnerSideBarList component="div" disablePadding>
            <ListItemButton
              onClick={() =>
                handleClickTraverse(EBasePage.MANGA, EManga.SEARCH_VIEWER)
              }
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <CalendarViewMonthIcon />
              </ListItemIcon>
              <ListItemText primary="Search" />
            </ListItemButton>
          </StyledInnerSideBarList>
        </Collapse>

        <ListItemButton onClick={handleClickImage}>
          <ListItemIcon>
            <CollectionsIcon />
          </ListItemIcon>
          <ListItemText primary="Gallery" />
          {openImageViewerList ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openImageViewerList} timeout="auto" unmountOnExit>
          <StyledInnerSideBarList component="div" disablePadding>
            <ListItemButton
              onClick={() =>
                handleClickTraverse(EBasePage.GALLERY, EGallery.EXPLORER)
              }
              sx={{ pl: 3 }}
            >
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText primary="Explorer" />
            </ListItemButton>
          </StyledInnerSideBarList>
        </Collapse>

        <ListItemButton onClick={() => openStartupFile()}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Open Settings Folder" />
        </ListItemButton>
      </StyledSideBarList>
    </Drawer>
  );
}

export default SideBarComp;
