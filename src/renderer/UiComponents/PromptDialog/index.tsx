import * as React from "react";
import Button from "@mui/material/Button";
import { DefaultNewButton } from "../../Utils/componentStyle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { EMiscIpcListener } from "../../Utils/enums";
import { Divider } from "@mui/material";
import { DefaultDeserializer } from "v8";

declare global {
  interface Window {
    ipcRenderer: any;
  }
}

type IProps = {
  promptDialogVisible: boolean;
  closeOnlyFunc: any;
  title: string;
  content: string;
  notAcceptFunc: any;
  notAcceptText: string;
  acceptFunc: any;
  acceptText: string;
};

function PromptDialog(props: IProps) {
  const {
    promptDialogVisible,
    closeOnlyFunc,
    title,
    content,
    acceptFunc,
    acceptText,
    notAcceptFunc,
    notAcceptText,
  } = props;

  function openExternalLink(link: string) {
    window.ipcRenderer
      .invoke(EMiscIpcListener.OPEN_EXTERNAL_LINK, link)
      .then((result: boolean | string) => {
        console.log("open success");
      });
  }
  //https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript

  function linkText(link: string) {
    return (
      <>
        {link} <Chip label="link!" onClick={() => openExternalLink(link)} />
      </>
    );
  }

  function linkify(text: string) {
    let urlRegex =
      /(\b(https?|http|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    let textArr = text.split(urlRegex);
    console.log(textArr);
    return textArr.map((str) => {
      if (urlRegex.test(str)) {
        return linkText(str);
      } else if (
        str.includes("http") == false &&
        str !== "file" &&
        str !== "ftp"
      ) {
        return str;
      }
    });
  }

  return (
    <Dialog
      open={promptDialogVisible}
      onClose={closeOnlyFunc}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      sx={{ borderRadius: "12px", border: "white", borderWidth: "2px" }}
    >
      <div style={{ backgroundColor: "black", border: "white", borderWidth: "2px"}}>
        <DialogTitle id="dialog-title">{title}</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
              {linkify(content)}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <DefaultNewButton onClick={notAcceptFunc}>{notAcceptText}</DefaultNewButton>
          <DefaultNewButton onClick={acceptFunc} autoFocus>
            {acceptText}
          </DefaultNewButton>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default PromptDialog;
