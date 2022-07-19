import React from "react";
import { FullContainerView } from "../../Utils/commonStyles";
import ReactPlayer from "react-player";
import {
  InlineContainer,
  FlexContainerCenter,
  MediaVideoControlContainer,
  TinyText,
} from "./ControlStyled";
import IconButton from "@mui/material/IconButton";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FastForwardIcon from "@mui/icons-material/FastForward";
import Slider from "@mui/material/Slider";
import PauseIcon from "@mui/icons-material/Pause";
import { formatDuration } from "../../Utils/stringutils";
import { textAlign } from "@mui/system";
import { EIpcListener } from "../../Utils/enums";

declare global {
  interface Window {
    ipcRenderer: any;
  }
}

function MediaPlayer() {
  // const [videoSrc, setVideoSrc] = React.useState(
  //   "D:\\Downloads\\[MTBB] Made in Abyss - The Golden City of the Scorching Sun - 02 [4CBE3A6B].mkv"
  // );
  const [videoSrc, setVideoSrc] = React.useState(
    "D:\\Downloads\\[Erai-raws] Made in Abyss - Retsujitsu no Ougonkyou - 02 [1080p][CAA8D256].mkv"
  );
  const convertSrc = "D:\\Downloads\\outputFile.mp4"
  const [totalVideoDuration, setTotalVideoDuration] = React.useState();
  const [durationPlayed, setDurationPlayed] = React.useState<number>(0)
  const [playingState, setPlayingState] = React.useState(false);
  const [subtitleTrack, setSubtitleTrack] = React.useState()
  const videoRef = React.useRef<ReactPlayer>(null);
  

  function durationCheck(e: any) {
    setTotalVideoDuration(e);
  }

  const handleTimeChange = (event: Event, newValue: number | number[]) => {
    setDurationPlayed(Number(newValue));
    videoRef.current?.seekTo(Number(newValue))
  };

  function retrieveSubtitles() {
    window.ipcRenderer.invoke(EIpcListener.RETRIEVE_SUBTITLES, videoSrc)
    .then((response:any)=>{
      console.log(JSON.parse(response))
      
    })
    .catch((error:any)=>{
      console.log(error)
    })
  }

  React.useEffect(() => {
    console.log('triggeredf')
    retrieveSubtitles()
  }, [playingState])

  return (
    <>
      <FullContainerView width="100%" height="auto">
        <ReactPlayer
          ref={videoRef}
          url={videoSrc}
          playing={playingState}
          controls={false}
          width="100%"
          height="100%"
          onDuration={(e) => durationCheck(e)}
          onProgress={(progress) => {setDurationPlayed(progress.playedSeconds)}}
          progressInterval={1000}
        />

        {/* Media Player controls */}

        <MediaVideoControlContainer>
          {/* Sliders */}
          <FlexContainerCenter>
            <Slider
              defaultValue={0}
              value={durationPlayed}
              max={totalVideoDuration}
              aria-label="player slider"
              valueLabelDisplay="auto"
              onChange={handleTimeChange}
            />
          </FlexContainerCenter>

          {/* Duration */}
          <InlineContainer>
            <div style={{ position: "absolute", textAlign: "left" }}>
              <TinyText>{formatDuration(durationPlayed)}</TinyText>
            </div>
            <div style={{textAlign: "right" }}>
              <TinyText>{formatDuration(totalVideoDuration)}</TinyText>
            </div>
          </InlineContainer>

          <FlexContainerCenter>
            <IconButton aria-label="Move back by 10" onClick={() => {setDurationPlayed(durationPlayed - 10); videoRef.current?.seekTo(Number(durationPlayed - 10))}}>
              <FastRewindIcon />
            </IconButton>
            <IconButton
              aria-label="play"
              size="large"
              onClick={() => setPlayingState(!playingState)}
            >
              {playingState ? (
                <PauseIcon sx={{ fontSize: "40px" }} fontSize="large" />
              ) : (
                <PlayArrowIcon sx={{ fontSize: "40px" }} fontSize="large" />
              )}
            </IconButton>
            <IconButton aria-label="Move forward 10" onClick={() => {setDurationPlayed(durationPlayed + 10); videoRef.current?.seekTo(Number(durationPlayed + 10))}}>
              <FastForwardIcon />
            </IconButton>
          </FlexContainerCenter>
        </MediaVideoControlContainer>
      </FullContainerView>
    </>
  );
}

export default MediaPlayer;
