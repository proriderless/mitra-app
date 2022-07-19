import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { WebTorrent } from "webtorrent";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageSpotlight from "./ImageSpotlight";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { EIpcListener } from "../../../Utils/enums";
import MediaPlayer from '../../../UiComponents/MediaPlayer'

declare global {
  interface Window {
    ipcRenderer: any;
  }
}

function Explorer() {
  const [imageList, setImageList] = React.useState([""]);
  const [showBackDrop, setShowBackDrop] = React.useState(false);
  const [clickedImage, setClickedImage] = React.useState(0);
  const [spotlightImage, setSpotlightImage] = React.useState("");
  const [mediaPlayerVisible, setMediaPlayerVisible] = React.useState(false)

  //Settings
  const [imageColumnsCount, setImageColumnsCount] = React.useState("2");

  function handleColumnChange(event: SelectChangeEvent) {
    setImageColumnsCount(event.target.value as string);
  }

  const [directories, setDirectories] = React.useState(["..."]);
  const [currDirectory, setCurrDirectory] = React.useState<string>();

  //Image navigation
  function navigateLeft() {
    if (clickedImage !== 0) {
      let newCurrIndex = clickedImage;
      newCurrIndex -= 1;
      setClickedImage(newCurrIndex);
      setSpotlightImage(imageList[newCurrIndex]);
    }
  }

  function navigateRight() {
    if (clickedImage != imageList.length - 1) {
      let newCurrIndex = clickedImage;
      newCurrIndex += 1;
      setClickedImage(newCurrIndex);
      setSpotlightImage(imageList[newCurrIndex]);
    }
  }

  function onChangeDirectory(value: string) {
    if (value !== "...") {

      let setTempDir = currDirectory + "\\" + value;
      summonWindow(setTempDir);
      setCurrDirectory(setTempDir);

    } else if (value === "...") {

      let setTempDir = currDirectory?.split('\\')
      setTempDir?.pop()

      let prevDirectory = setTempDir?.join('\\')

      summonWindow(prevDirectory)
      setCurrDirectory(prevDirectory)
    }
  }



  //Call Directory Dialog
  function summonWindow(parentDirectory = "") {
    window.ipcRenderer
      .invoke(EIpcListener.OPEN_IMAGE_DIRECTORY_SELECT, parentDirectory)
      .then((pathResult: any) => {
        if (pathResult === undefined) {
          return;
        } // Operation was aborted

        var parsed_result = JSON.parse(pathResult);
        var imagePaths = parsed_result.paths;
        var directories = parsed_result.directories;
        var directory = parsed_result.directory;

        console.log(parsed_result);

        directories.unshift("...");
        setCurrDirectory(directory);
        setDirectories(directories);

        let result = [];

        if (imagePaths.length > 0) {
          for (let path of imagePaths) {
            result.push(path);
          }
          setImageList(result);
        } else {
          setImageList([]);
        }

        return result;
      });
  }

  //Show Image spotlight

  function showImageSpotlight(index: number) {
    setClickedImage(index);
    setSpotlightImage(imageList[index]);
    setShowBackDrop(true);
  }

  //Grid Size is 12
  //164 rowHeight={500}
  return (
    <>
      {/* Control Sector */}

      <Grid container spacing={3}>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel id="change_column_label_id">Image Column</InputLabel>
            <Select
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
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="change_directory_selection_label_id">
              Directory Navigation
            </InputLabel>
            <Select
              labelId="change_directory_selection_label_id"
              id="change_directory_selection_id"
              value={'currDirectory'}
              label="Navigate Directory"
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
          <Button variant="contained" onClick={() => setMediaPlayerVisible(!mediaPlayerVisible)}>
            Show Media Player
          </Button>
        </Grid>
      </Grid>

      {/* Media Player */}

      {mediaPlayerVisible && <MediaPlayer/>}

      {/* Image Spotlight */}

      {showBackDrop && (
        <ImageSpotlight
          currImage={spotlightImage}
          closeImage={setShowBackDrop}
          leftImage={navigateLeft}
          rightImage={navigateRight}
        />
      )}

      {/* Image List */}

      <ImageList sx={{ width: "100%" }} cols={parseInt(imageColumnsCount)}>
        {imageList.map((item, i) => (
          <ImageListItem sx={{ height: "100% !important" }} key={i}>
            <img src={`${item}`} onClick={() => showImageSpotlight(i)} />
          </ImageListItem>
        ))}
      </ImageList>
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
