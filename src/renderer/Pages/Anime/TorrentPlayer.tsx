import React from "react";

import IconButton from "@mui/material/IconButton";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FastForwardIcon from "@mui/icons-material/FastForward";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HideSourceIcon from "@mui/icons-material/HideSource";

import { FloatingContainerView } from "../../Utils/commonStyles";
import {
  FlexContainerCenter,
  MediaVideoControlContainer,
} from "../../UiComponents/MediaPlayer/ControlStyled";

function TorrentPlayer() {
  const [playerControls, setPlayerControls] = React.useState([]);
  const [visibleControlPanel, setVisibleControlPanel] = React.useState("1");

  React.useEffect(() => {
    let controlsTemp: any = [];
    const player = document.getElementById("player");
    const video = document.getElementById("video")


  }, []);

  return (
    <>
      <section id="player" className="torrent-player">
        <video id="video" src=""></video>
      </section>
    </>
  );
}

export default TorrentPlayer;
