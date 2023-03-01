import React from "react";
import WebTorrent from "webtorrent";

import MediaPlayer from "../../UiComponents/MediaPlayer";
import Button from "@mui/material/Button";

declare global {
    interface Window {
      ipcRenderer: any;
    }
  }

//Testing
function Home() {
  const [animeMovie, setAnimeMovie] = React.useState([]);
  const [visibleMedia, setMediaPlayerVisible] = React.useState(false);
  const client = new WebTorrent();

  
  function callCreateServer() {

    //Oniimai! - single file
    const torrentID = "magnet:?xt=urn:btih:f646d0183334fa834c3810004b14dd307b250a7c&dn=%5Bdenisplay%5D%20Oniichan%20wa%20Oshimai%21%20-%2008%20%28Uncensored%29%20%281080p%29%20%5BAV1%5D%20%28Weekly%29&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&xs=https%3A%2F%2Fnyaa.si%2Fdownload%2F1642787.torrent";

    //Close server
    
    //Run server
    window.ipcRenderer
      .invoke("torrent:openTorrentServer", torrentID)
      .then((result: any) => {
        console.log(result)
        setMediaPlayerVisible(true)
      })
  }

  function closeServer(){
    window.ipcRenderer
    .invoke("torrent:destroyTorrentClient")
    .then((result: any) => {
      console.log(result)
      setMediaPlayerVisible(true)
    })
  }

  

  React.useEffect(() => {
    //const client = new WebTorrent();
    // const torrentID =
    //   "magnet:?xt=urn:btih:f646d0183334fa834c3810004b14dd307b250a7c&dn=%5Bdenisplay%5D%20Oniichan%20wa%20Oshimai%21%20-%2008%20%28Uncensored%29%20%281080p%29%20%5BAV1%5D%20%28Weekly%29&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&xs=https%3A%2F%2Fnyaa.si%2Fdownload%2F1642787.torrent";

    // window.ipcRenderer
    //   .invoke("torrent:openTorrentServer", torrentID)
    //   .then((result: any) => {
    //     console.log(result)
    //   })

    // client.add(torrentID, function (torrent: any) {
    //   // Torrents can contain many files. Let's use the .mp4 file
    //   const file = torrent.files.find(function (file: any) {
    //     console.log(file)
    //     return file.name.endsWith(".mkv");
    //   });

    //   setAnimeMovie(file);
    //   setMediaPlayerVisible(true);
    // });

    console.log(animeMovie);
  }, []);
  return (
    <>
      Home page
      <Button onClick={callCreateServer}>Run!</Button>
      <Button onClick={callCreateServer}>Close Server!</Button>
      {animeMovie[0]}
      {visibleMedia && (
        <MediaPlayer
          mediaSrc={``}
          setMediaPlayerVisible={setMediaPlayerVisible}
        />
      )}
    </>
  );
}

export default Home;
