//This component will only display ONE image at full size
import React, {Dispatch} from "react";
import Backdrop from "@mui/material/Backdrop";
import { IconButton } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import * as Mousetrap from 'mousetrap'

interface IProps {
  currImage: string
  closeImage: Dispatch<boolean>,
  leftImage: any, //void function
  rightImage: any //void function
}

function ImageSpotlight(props: IProps) {
  const { currImage, closeImage, leftImage, rightImage } = props;

  const handleClose = () => {
    closeImage(false);
  };

  React.useEffect( () => {
    Mousetrap.bind(['left'], leftImage);
    Mousetrap.bind(['right'], rightImage);

    return () => {
        Mousetrap.unbind(['left', 'right']);
      };
  })

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
        open={true}
        
      >
        <IconButton
          color="primary"
          aria-label="left image navigate"
          component="span"
          onClick={leftImage}
          size="large"
        >
          <ArrowLeftIcon />
        </IconButton>
        <img src={currImage} style={{maxHeight: "80%"}}  onClick={handleClose} />
        <IconButton
          color="primary"
          aria-label="right image navigate"
          component="span"
          onClick={rightImage}
          size="large"
        >
          <ArrowRightIcon />
        </IconButton>
      </Backdrop>
    </>
  );
}

export default ImageSpotlight;
