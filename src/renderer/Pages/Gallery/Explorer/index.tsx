import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { WebTorrent } from "webtorrent";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { EIpcListener } from "../../../Utils/enums";
import MediaPlayer from "../../../UiComponents/MediaPlayer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { EmptySeparator, FullContainerView } from "../../../Utils/commonStyles";
import { TabPanel, allyProps } from "../../../UiComponents/GlobalTab/TabPanel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import VideoView from "./VideoView";
import ImageView from "./ImageView";

declare global {
  interface Window {
    ipcRenderer: any;
  }
}

function Explorer() {
  const [imageList, setImageList] = React.useState([""]);
  const [videoList, setVideoList] = React.useState([""]);
  const [mediaPlayerVisible, setMediaPlayerVisible] = React.useState(false);
  const [videoSrc, setVideoSrc] = React.useState("");
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  //Settings
  const [imageColumnsCount, setImageColumnsCount] = React.useState("2");

  function handleColumnChange(event: SelectChangeEvent) {
    setImageColumnsCount(event.target.value as string);
  }

  const [directories, setDirectories] = React.useState(["..."]);
  const [currDirectory, setCurrDirectory] = React.useState<string>();

  function onChangeDirectory(value: string) {
    if (value !== "...") {
      let setTempDir = currDirectory + "\\" + value;
      summonWindow(setTempDir);
      setCurrDirectory(setTempDir);
    } else if (value === "...") {
      let setTempDir = currDirectory?.split("\\");

      setTempDir?.pop();

      let prevDirectory = setTempDir?.join("\\");

      summonWindow(prevDirectory);
      setCurrDirectory(prevDirectory);
    }
  }

  function selectMediaToPlay() {
    window.ipcRenderer.invoke(EIpcListener.OPEN_VIDEO)
    .then((pathResult:any) => {
      if (pathResult === undefined){
        return;
      }
      setVideoSrc(pathResult)
      setMediaPlayerVisible(true)
    })

  }

  //Call Directory Dialog
  function summonWindow(parentDirectory = "") {
    window.ipcRenderer
      .invoke(EIpcListener.OPEN_IMAGE_DIRECTORY_SELECT, parentDirectory)
      .then((pathResult: any) => {
        if (pathResult === undefined) {
          return;
        } // Operation was aborted

        console.log("IS IT THIS FUNCTION!????")
        var parsed_result = JSON.parse(pathResult);
        var imagePaths = parsed_result.imagePaths;
        var videoPaths = parsed_result.videoPaths;
        var directories = parsed_result.directories;
        var directory = parsed_result.directory;

        console.log(parsed_result);

        directories.unshift("...");
        setCurrDirectory(directory);
        setDirectories(directories);

        let imageResult = [];
        let videoResult = [];

        if (imagePaths.length > 0) {
          for (let path of imagePaths) {
            imageResult.push(path);
          }
          setImageList(imageResult);
        } else {
          setImageList([]);
        }

        if (videoPaths.length > 0) {
          for (let path of videoPaths) {
            videoResult.push(path);
          }
          setVideoList(videoResult);
        } else {
          setVideoList([]);
        }

        //Technically don't need to return anything, apart from reporting that the operation is a success
        return true;
      });
  }

  //Grid Size is 12
  //164 rowHeight={500}
  return (
    <>
      {/* Media Player */}

      {mediaPlayerVisible && (
        <MediaPlayer
          mediaSrc={videoSrc}
          setMediaPlayerVisible={setMediaPlayerVisible}
          isTorrent={false}
        />
      )}

      {/* Control Sector */}
      <FullContainerView width="100%" height="auto">
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <FormControl fullWidth>
              <InputLabel id="change_column_label_id">Image Column</InputLabel>
              <Select
                size='small'
                labelId="change_column_label_id"
                id="change_column_id"
                value={imageColumnsCount}
                label="Image Columns"
                onChange={handleColumnChange}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={5}>
            <IconButton
              color="primary"
              aria-label="left image navigate"
              component="span"
              onClick={() => onChangeDirectory("...")}
              size="large"
            >
              <ArrowBackIcon />
            </IconButton>
            <FormControl sx={{minWidth: '80px', width: '80%' }}>  
              <InputLabel id="change_directory_selection_label_id">
                Directory
              </InputLabel>
              <Select
                size='small'
                labelId="change_directory_selection_label_id"
                id="change_directory_selection_id"
                value={"currDirectory"}
                label="Directory"
                onChange={(e) => {
                  onChangeDirectory(e.target.value);
                }}
              >
                {directories.map((directory) => (
                  <MenuItem value={directory}>{directory}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" onClick={() => summonWindow()}>
              Show Folder
            </Button>
          </Grid>
          <Grid item xs={2}>
            
            <Button
              variant="contained"
              onClick={selectMediaToPlay}
            >
              Show Media Player
            </Button>
          </Grid>
        </Grid>

        <EmptySeparator />

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Image" {...allyProps(0)} />
              <Tab label="Video" {...allyProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={tabIndex} index={0}>
            <ImageView
              imageColumnsCount={imageColumnsCount}
              imageList={imageList}
            />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <VideoView
              videoList={videoList}
              setMediaPlayerVisible={setMediaPlayerVisible}
              mediaPlayerVisible={mediaPlayerVisible}
              setVideoSrc={setVideoSrc}
            />
          </TabPanel>
        </Box>
      </FullContainerView>
    </>
  );
}

export default Explorer;

{
  /* <Autocomplete
            disablePortal
            id="noOfColumns"
            value={imageColumnsCount}
            options={columnOptions}
            onChange={(e, newColumnCount) => {setImageColumnsCount(newColumnCount)}}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Image Columns"
              />
            )}
          /> */
}
