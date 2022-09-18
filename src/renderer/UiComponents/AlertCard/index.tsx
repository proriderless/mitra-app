import react from "react";
import { EAlertType } from "../../Utils/enums";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";

type IProps = {
  alertMode: EAlertType;
  alertText: string;
  alertClose: boolean;
  alertCloseFunc: any; //function to close
};

function AlertBar(props: IProps) {
  const { alertMode, alertText, alertClose, alertCloseFunc } = props;

  const handleClose = () => {
    alertCloseFunc(false)
  }

  return (
    <Fade
      in={alertClose} //Write the needed condition here to make it appear
      timeout={{ enter: 500, exit: 500 }} //Edit these two values to change the duration of transition when the element is getting appeared and disappeard
      addEndListener={() => {
        setTimeout(() => {
          alertCloseFunc(false);
        }, 10000);
      }}
    >
      <Alert sx={{position: "fixed", right: 20, top: 20, zIndex: 9999}} onClose={handleClose} severity={alertMode} variant="standard" className="alert">
        {alertText}
      </Alert>
    </Fade>
  );
}

export default AlertBar;

//        <Alert sx={{position: "fixed", right: 20, top: 20, zIndex: 9999}} onClose={() => {}} severity={alertMode}>{alertText}</Alert>
