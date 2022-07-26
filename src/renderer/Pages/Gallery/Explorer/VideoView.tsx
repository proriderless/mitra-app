import React from "react";
import VideoCard from "../../../UiComponents/VideoCard";
import MediaPlayer from "../../../UiComponents/MediaPlayer";

interface IProps {
  videoList: Array<string>,
  mediaPlayerVisible: boolean,
  setMediaPlayerVisible: any,
  setVideoSrc: any,
}

function VideoView(props: IProps) {
  const { videoList, setMediaPlayerVisible, mediaPlayerVisible, setVideoSrc } = props;

  //Navigate to Video
  function summonMediaPlayer(videoSrc: string) {
    setVideoSrc(videoSrc);
    setMediaPlayerVisible(true);
  }

  return (
    <>
      {/* {mediaPlayerVisible && <MediaPlayer mediaSrc={videoSrc} closeVidPlayer={setMediaPlayerVisible} />} */}

      <div style={{ display: "flex", flexFlow: 'wrap', padding: "5px" }}>
        {videoList.map((item, i) => (
          <VideoCard key={i} videoSrc={item} summonMediaPlayer={summonMediaPlayer} />
        ))}
      </div>
    </>
  );
}

export default VideoView;
