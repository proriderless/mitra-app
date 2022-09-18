import React from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTime } from "luxon";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import CheckIcon from "@mui/icons-material/Check";
import ToggleButton from "@mui/material/ToggleButton";
import { ESchedulerIpcListener, EUpdateMode, EMiscIpcListener } from "../../../Utils/enums";

import PopoverColorPicker from "../../../UiComponents/ColorPicker/index";

import { handleSetEvents, updateScheduleFile } from "./utils";

declare global {
  interface Window {
    ipcRenderer: any;
  }
}

interface IProps {
  setOpenDialog: any;
  setCloseDialog: any;
  visible: boolean;
  responsiveMediaQuery: any;
  selectedDate: DateTime;
  eventArray: any;
  handleLoadEvent: any;
  globalID: number;
  handleGlobalID: any;
  updateExistingID?: number;
  handleUpdateMode: EUpdateMode;
}

interface IFormComponents {
  title: string | undefined;
  startDate: Date | undefined;
  startTime: string | undefined;
  endDate: Date | undefined;
  endTime: string | undefined;
}

//For opening external link
function openExternalLink(link: string) {
  window.ipcRenderer
    .invoke(EMiscIpcListener.OPEN_EXTERNAL_LINK, link)
    .then((result: boolean | string) => {
      console.log("open success");
    });
}

//updateExistingID ID is used if in update mode
//Else will use global id

function SetEvent(props: IProps) {
  const {
    setCloseDialog,
    visible,
    responsiveMediaQuery,
    selectedDate,
    eventArray,
    globalID,
    handleLoadEvent,
    handleGlobalID,
    updateExistingID,
    handleUpdateMode,
  } = props;

  const updatedIDIfNew = globalID + 1;

  //Form props items to hold
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState<DateTime | null>(
    selectedDate
  );
  const [startTime, setStartTime] = React.useState<DateTime | null>();
  const [endDate, setEndDate] = React.useState<DateTime | null>(selectedDate);
  const [endTime, setEndTime] = React.useState<DateTime | null>();
  const [remindTime, setRemindTime] = React.useState("");
  const [color, setColor] = React.useState<string>("#ff0000");
  const [isRecurring, setIsRecurring] = React.useState(false);
  const [isEndless, setIsEndless] = React.useState(false);
  const [chosenRecurringDays, setChosenRecurringDays] = React.useState<
    string[]
  >([]);
  const [chosenEvent, setChosenEvent] = React.useState("Work/School");
  const [rruleDescription, setRruleDescription] = React.useState("");
  const [rruleDurationH, setRruleDurationH] = React.useState("");
  const [rruleDurationM, setRruleDurationM] = React.useState("");

  React.useEffect(() => {
    //Run whenever there is a change to the date:
    setStartDate(selectedDate);
    setEndDate(selectedDate);
  }, [selectedDate]);

  //The update code (will take into account both edit and new)
  function handleNewUpdateEvent() {
    if (handleUpdateMode === EUpdateMode.NEW) {
      console.log("new");
      //We assume it's a new event
      let eventStruc = handleSetEvents(
        updatedIDIfNew,
        title,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        remindTime,
        chosenEvent,
        color,
        isRecurring,
        chosenRecurringDays,
        rruleDescription,
        rruleDurationH,
        rruleDurationM
      );
      let copEvents = [...eventArray];
      copEvents.push(eventStruc);
      handleLoadEvent(copEvents);
      handleGlobalID(updatedIDIfNew);
      console.log(eventArray);
      updateScheduleFile(copEvents);
    } else if (handleUpdateMode === EUpdateMode.UPDATE) {
      console.log("update");

      if (updateExistingID === undefined) {
        console.log("existing id does not exist for some reason!?");
        return false;
      }

      let eventStruc = handleSetEvents(
        updateExistingID,
        title,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        remindTime,
        chosenEvent,
        color,
        isRecurring,
        chosenRecurringDays,
        rruleDescription,
        rruleDurationH,
        rruleDurationM
      );

      let copEvents = [...eventArray];
      let eventTargetIndex = copEvents.findIndex(
        ({ id }: { id: string }) => id === String(updateExistingID)
      );
      copEvents[eventTargetIndex] = eventStruc;
      handleLoadEvent(copEvents);
      console.log(eventArray);
      updateScheduleFile(copEvents);
    }
    setCloseDialog();
  }

  const handleChangeInDays = (
    event: SelectChangeEvent<typeof chosenRecurringDays>
  ) => {
    const {
      target: { value },
    } = event;
    setChosenRecurringDays(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChangeEvent = (event: SelectChangeEvent) => {
    setChosenEvent(event.target.value);
    //ADD COLOR
  };

  //When Starting up the SetEvent screen
  React.useEffect(() => {
    //If there is any changes to the id, find the ID if it's not undefined

    if (handleUpdateMode === EUpdateMode.UPDATE) {
      if (updateExistingID !== undefined) {
        let foundEvent = eventArray.find(
          ({ id }: { id: string }) => id === String(updateExistingID)
        );
        if (foundEvent["recurringEvent"] === true) {
          if ("rrule" in foundEvent) {
            //SPLIT
            let duration = foundEvent['duration'].split(":")
            //RRULE EXIST
            setTitle(foundEvent["title"]);
            setStartTime(DateTime.fromISO(foundEvent["startTime"]));
            setEndTime(DateTime.fromISO(foundEvent["endTime"]));
            setColor(foundEvent["backgroundColor"]);
            setDescription(foundEvent["description"]);
            setIsRecurring(foundEvent["recurringEvent"]);
            setRemindTime(foundEvent["remindTime"]);
            setChosenEvent(foundEvent["eventCategory"]);
            setRruleDescription(foundEvent["rrule"]);
            setRruleDurationH(duration[0])
            setRruleDurationM(duration[1])
            setChosenRecurringDays([]);
          } else {
            //For remapping the days back
            console.log(startDate);
            console.log(startTime);

            const mapDays = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];

            setTitle(foundEvent["title"]);
            setStartDate(DateTime.fromISO(foundEvent["startRecur"]));
            setStartTime(DateTime.fromISO(foundEvent["startTime"]));
            setEndTime(DateTime.fromISO(foundEvent["endTime"]));
            setColor(foundEvent["backgroundColor"]);
            setDescription(foundEvent["description"]);
            setIsRecurring(foundEvent["recurringEvent"]);
            setChosenRecurringDays(
              foundEvent["daysOfWeek"].map((x: number) => mapDays[x]) //foundEvent["daysOfWeek"].map((x: number) => mapDays[x - 1])
            );
            setRemindTime(foundEvent["remindTime"]);
            setChosenEvent(foundEvent["eventCategory"]);
            setRruleDescription("");
            setRruleDurationH("0")
            setRruleDurationM("0")
          }
        } else {
          //If false, that means it's a normal event
          setTitle(foundEvent["title"]);
          setStartDate(DateTime.fromISO(foundEvent["start"]));
          setStartTime(DateTime.fromISO(foundEvent["start"]));
          setEndDate(DateTime.fromISO(foundEvent["end"]));
          setEndTime(DateTime.fromISO(foundEvent["end"]));
          setColor(foundEvent["backgroundColor"]);
          setDescription(foundEvent["description"]);
          setIsRecurring(foundEvent["recurringEvent"]);
          setRemindTime(foundEvent["remindTime"]);
          setChosenEvent(foundEvent["eventCategory"]);
          setRruleDurationH("0")
          setRruleDurationM("0")
          setRruleDescription("");
          setChosenRecurringDays([]);
        }
      }
    } else if (handleUpdateMode === EUpdateMode.NEW) {
      //Clear everything, except time
      setTitle("");
      setStartDate(selectedDate);
      setStartTime(selectedDate);
      setEndDate(selectedDate);
      setEndTime(selectedDate);
      setDescription("");
      setIsRecurring(false);
      setIsEndless(false);
      setRemindTime("");
      setChosenEvent("Work/School");
      setChosenRecurringDays([]);
      setRruleDescription("");
      setRruleDurationH("0")
      setRruleDurationM("0")
    }
  }, [handleUpdateMode, updateExistingID]);

  //Update schedule file

  // const updateScheduleFile = (eventCop: any) => {
  //   let finalFormatEventArray = JSON.stringify({
  //     schedule: eventCop,
  //   });
  //   window.ipcRenderer
  //     .invoke(ESchedulerIpcListener.UPDATE_SCHEDULE_FILE, finalFormatEventArray)
  //     .then((result: boolean) => {
  //       if (result === false) {
  //         console.log("update failed");
  //       } else {
  //         console.log("update success");
  //       }
  //     });
  // };

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const eventCategory = ["Work/School", "Event", "Shows"];

  const rruleLink = "https://jakubroztocil.github.io/rrule/"

  return (
    <Dialog
      fullScreen={responsiveMediaQuery}
      // sx={{ "& .MuiDialog-paper": { width: "100%", height: "70%" } }}
      open={visible}
      onClose={setCloseDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Set your event date"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DialogContentText>Set the event</DialogContentText>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              label="Title"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="description"
              fullWidth
              multiline
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              label="Description"
            />
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DesktopDatePicker
                disableMaskedInput
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <TimePicker
                disableMaskedInput
                label="Start Time"
                value={startTime}
                onChange={(e) => setStartTime(e)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DesktopDatePicker
                disableMaskedInput
                label="End Date"
                value={endDate}
                minDate={startDate}
                onChange={(e) => setEndDate(e)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <TimePicker
                disableMaskedInput
                label="End Time"
                value={endTime}
                onChange={(e) => setEndTime(e)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="reminder-textfield"
              label="Remind me in (H)"
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              value={remindTime}
              onChange={(e) => setRemindTime(e.currentTarget.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="chosen-event-label-id">Event Category</InputLabel>
              <Select
                labelId="chosen-event-label-id"
                id="chosen-event"
                value={chosenEvent}
                onChange={handleChangeEvent}
                label="Event Category"
              >
                {eventCategory.map((event) => (
                  <MenuItem key={event} value={event}>
                    {event}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <PopoverColorPicker color={color} onChange={setColor} />
          </Grid>
          <Grid item xs={6}>
            <DialogContentText>Recurring event?</DialogContentText>
          </Grid>
          <Grid item xs={6}>
            <DialogContentText>Endlessly Recurring?</DialogContentText>
          </Grid>
          <Grid item xs={6}>
            <ToggleButton
              color="success"
              value="check"
              selected={isRecurring}
              onChange={() => {
                setIsRecurring(!isRecurring);
              }}
            >
              <CheckIcon />
            </ToggleButton>
          </Grid>
          <Grid item xs={6}>
            <ToggleButton
              color="success"
              value="check"
              selected={isEndless}
              onChange={() => {
                setIsEndless(!isEndless);
              }}
            >
              <CheckIcon />
            </ToggleButton>
          </Grid>
          {/* This is the choosing of day */}
          <Grid item xs={12}>
            <FormControl fullWidth disabled={!isRecurring}>
              <InputLabel id="days-recurring-label-id">
                Days of Week to Recur
              </InputLabel>
              <Select
                labelId="days-recurring-label-id"
                id="days-recurring"
                multiple
                value={chosenRecurringDays}
                onChange={(e) => handleChangeInDays(e)}
                input={
                  <OutlinedInput
                    id="select-multiple-chip"
                    label="Days of Week to Recur"
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {daysOfWeek.map((days) => (
                  <MenuItem key={days} value={days}>
                    {days}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <DialogContentText>All above time settings are irrelevant if you're using RRULE</DialogContentText> <Chip label="RRule" onClick={() => openExternalLink(rruleLink)} />
          </Grid>
          <Grid item xs={12}>
            <DialogContentText>Specify duration as well if you want to specify how long it is</DialogContentText>
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled={!isRecurring}
              id="rrule-description"
              fullWidth
              multiline
              value={rruleDescription}
              onChange={(e) => setRruleDescription(e.currentTarget.value)}
              label="RRules Description"
              helperText=""
            />
          </Grid>
          <Grid item xs={6}>
          <TextField
              id="rrule-duration-hour"
              disabled={!isRecurring}
              label="Duration (HH)"
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              value={rruleDurationH}
              onChange={(e) => setRruleDurationH(e.currentTarget.value)}
            />
          </Grid>
          <Grid item xs={6}>
          <TextField
              id="rrule-duration-min"
              disabled={!isRecurring}
              label="Duration (MIN) - MM"
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              value={rruleDurationM}
              onChange={(e) => setRruleDurationM(e.currentTarget.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={setCloseDialog}>Close</Button>
        <Button onClick={handleNewUpdateEvent}>Set Event</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SetEvent;
