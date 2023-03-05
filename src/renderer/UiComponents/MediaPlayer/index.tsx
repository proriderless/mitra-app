import React from "react";
import ReactPlayer from "react-player";
import {
  InlineContainer,
  FlexContainerCenter,
  MediaVideoControlContainer,
  TinyText,
  AlignFarLeft,
  AlignFarRight,
} from "./ControlStyled";
import Slider from "@mui/material/Slider";
import PauseIcon from "@mui/icons-material/Pause";
import { formatDuration } from "../../Utils/stringutils";
import { textAlign } from "@mui/system";
import { EIpcListener, ETorrentIpcListener } from "../../Utils/enums";
// import workerUrl from './jassub/dist/jassub-worker.js?url'
import "jassub/dist/jassub-worker.wasm?url";
import {
  EmptySeparator,
  FullContainerView,
  FloatingContainerView,
} from "../../Utils/commonStyles";
import IconButton from "@mui/material/IconButton";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FastForwardIcon from "@mui/icons-material/FastForward";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HideSourceIcon from '@mui/icons-material/HideSource';
import * as Mousetrap from 'mousetrap'

declare global {
  interface Window {
    ipcRenderer: any;
  }
}

type IProps = {
  mediaSrc: string,
  setMediaPlayerVisible: any //a function that sets the visibility of the media player
  isTorrent: boolean //Check if the user is playing torrent, if it is, add close server functionality
}

function MediaPlayer(props:IProps) {

  const {mediaSrc, setMediaPlayerVisible, isTorrent} = props

  const [videoSrc, setVideoSrc] = React.useState(mediaSrc);
  const [totalVideoDuration, setTotalVideoDuration] = React.useState<number>();
  const [durationPlayed, setDurationPlayed] = React.useState<number>(0);
  const [playingState, setPlayingState] = React.useState(false);
  const [subtitleTrack, setSubtitleTrack] = React.useState("");
  const [videoVisible, setVideoVisible] = React.useState(false);
  const [videoExpand, setVideoExpand] = React.useState(false)
  const [videoWidthHeight, setVideoWidthHeight] = React.useState({
    width: "50%",
    height: "50%"
  })
  const [visibleControlPanel, setVisibleControlPanel] = React.useState('1')
  const videoRef = React.useRef<ReactPlayer>(null);

  //Startup Actions
  React.useEffect(() => {
    console.log("detected src from media player!!")
    console.log(videoSrc)
    if (videoSrc.endsWith('.mkv')){
      console.log("try to retrieve subs")
      retrieveSubtitles();
    } else {
      console.log("doesn't bother")
      setVideoVisible(true);
    }
    setInterval(() => setVisibleControlPanel('0'), 5000)
  }, []);

  //Mouse bindings for video control
  React.useEffect(() => {
    Mousetrap.bind(['space'], () => setPlayingState(!playingState))
    Mousetrap.bind(['right'], () => {
      setDurationPlayed(durationPlayed + 10);
      videoRef.current?.seekTo(Number(durationPlayed + 10))
    })
    Mousetrap.bind(['left'], () => {
      setDurationPlayed(durationPlayed- 10);
      videoRef.current?.seekTo(Number(durationPlayed - 10))
    })

    return () => {
      Mousetrap.unbind(['left', 'right']);
      Mousetrap.unbind(['space'])
    };
  })

  function durationCheck(e: number) {
    setTotalVideoDuration(e);
  }

  const handleTimeChange = (event: Event, newValue: number | number[]) => {
    setDurationPlayed(Number(newValue));
    videoRef.current?.seekTo(Number(newValue));
  };

  function retrieveSubtitles() {
    console.log("I'm running!")
    console.log(videoSrc)
    window.ipcRenderer
      .invoke(EIpcListener.RETRIEVE_SUBTITLES, videoSrc)
      .then((response: any) => {
        var options = {
          video: videoRef.current,
          subContent: response,
        };

        console.log("Subtitles has loaded!!")
        
        if (response !== "") {
          setSubtitleTrack(
            "D:\\Desktop\\Projects\\Personal Projects\\Personal Program\\mitra-app\\testSubtitle.vtt"
          );
        }

        setVideoVisible(true);
      })
      .catch((error: any) => {
        console.log(error);
        setVideoVisible(true);
      });
  }

  function setVideoExpandState() {
    let copiedVideoWidthHeight = {
      ...videoWidthHeight
    }
    if (videoExpand === false){
      copiedVideoWidthHeight.height = '100%'
      copiedVideoWidthHeight.width = '100%'
    } else {
      copiedVideoWidthHeight.height = 'auto'
      copiedVideoWidthHeight.width = '50%'
    }
    setVideoExpand(!videoExpand)
    setVideoWidthHeight(copiedVideoWidthHeight)
  }

  //Set whether the controls become visible

  function setControlPanelVisibility(e:React.MouseEvent<Element, MouseEvent>) {
    if (visibleControlPanel === '0'){
      setVisibleControlPanel('1')
      setInterval(() => setVisibleControlPanel('0'), 10000)
    }
    e.preventDefault()
  }

  function closeServer() {
    window.ipcRenderer
      .invoke(ETorrentIpcListener.DESTROY_TORRENT_SERVER)
      .then((result: any) => {
        console.log(result);
      });
  }

  function closeMediaPlayer() {
    if (isTorrent === true){
      //It's a torrent file, make sure to close the server as well
      closeServer()
    } 
    setMediaPlayerVisible(false)
  }


  return (
    <>
      <FloatingContainerView width={videoWidthHeight.width} height={videoWidthHeight.height} zIndex="1000000" onMouseMove={(e) => setControlPanelVisibility(e)}>
        {videoVisible && (
          <ReactPlayer
            ref={videoRef}
            url={videoSrc}
            playing={playingState}
            controls={false}
            width="100%"
            height="100%"
            onDuration={(e) => durationCheck(e)}
            onProgress={(progress) => {
              setDurationPlayed(progress.playedSeconds);
            }}
            progressInterval={1000}
            config={{
              file: {
                tracks: [
                  {
                    kind: "subtitles",
                    label: "English",
                    src: subtitleTrack,
                    srcLang: "en",
                    default: true,
                  },
                ],
              },
            }}
          />
        )}

        {/* Media Player controls */}

        <MediaVideoControlContainer opacity={visibleControlPanel}>
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
            <div style={{ textAlign: "right" }}>
              <TinyText>{formatDuration(totalVideoDuration)}</TinyText>
            </div>
          </InlineContainer>

          <FlexContainerCenter>
            <IconButton
              aria-label="Move back by 10"
              onClick={() => {
                setDurationPlayed(durationPlayed - 10);
                videoRef.current?.seekTo(Number(durationPlayed - 10));
              }}
            >
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
            <IconButton
              aria-label="Move forward 10"
              onClick={() => {
                setDurationPlayed(durationPlayed + 10);
                videoRef.current?.seekTo(Number(durationPlayed + 10));
              }}
            >
              <FastForwardIcon />
            </IconButton>
            <IconButton
              aria-label="expand player to cover screen"
              onClick = {setVideoExpandState}
              >
                <AspectRatioIcon />
            </IconButton>
            <IconButton
              aria-label="close the media player"
              onClick={closeMediaPlayer}
              >
                <HighlightOffIcon />
            </IconButton>
            <IconButton
              aria-label="hide the control panel"
              onClick={() => setVisibleControlPanel('0')}
              >
                <HideSourceIcon />
            </IconButton>
          </FlexContainerCenter>
        </MediaVideoControlContainer>
      </FloatingContainerView>
    </>
  );
}

export default MediaPlayer;
