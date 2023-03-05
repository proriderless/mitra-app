import React from "react";
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
  const [mediaSrc, setMediaSrc] = React.useState("");

  function callCreateServer() {
    //Oniimai! - single file
    const torrentID =
      "magnet:?xt=urn:btih:ac6fb820e708830999169a0cd3162226cf6ed550&dn=%5BSubsPlease%5D%20Oniichan%20wa%20Oshimai%21%20-%2007%20%281080p%29%20%5B6FF18E4A%5D.mkv&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&xs=%2Fdownload%2F1638287.torrent";

    //Close server

    //Run server
    window.ipcRenderer
      .invoke("torrent:openTorrentServer", torrentID)
      .then((result: any) => {
        console.log(result);
        setMediaPlayerVisible(true);
      });
  }

  function closeServer() {
    window.ipcRenderer
      .invoke("torrent:destroyTorrentClient")
      .then((result: any) => {
        console.log(result);
        setMediaSrc(
          "http://localhost:1500/0/[SubsPlease]%20Oniichan%20wa%20Oshimai!%20-%2007%20(1080p)%20[6FF18E4A].mkv"
        );
        setMediaPlayerVisible(false);
      });
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
      <Button onClick={closeServer}>Close Server!</Button>
      {animeMovie[0]}
      {visibleMedia && (
        // <MediaPlayer
        //   mediaSrc={`C:\\Users\\User\\AppData\\Local\\Temp\\webtorrent\\[SubsPlease] Oniichan wa Oshimai! - 07 (1080p) [6FF18E4A].mkv`}
        //   setMediaPlayerVisible={setMediaPlayerVisible}
        // />
        <MediaPlayer
          mediaSrc={mediaSrc}
          setMediaPlayerVisible={setMediaPlayerVisible}
          isTorrent={true}
        />
      )}
    </>
  );
}

export default Home;
