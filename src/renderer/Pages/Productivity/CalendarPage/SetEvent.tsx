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

import PopoverColorPicker from "../../../UiComponents/ColorPicker/index";

interface IProps {
  setOpenDialog: any;
  setCloseDialog: any;
  visible: boolean;
  responsiveMediaQuery: any;
  selectedDate: string;
}

interface IFormComponents {
  title: string | undefined;
  startDate: Date | undefined;
  startTime: string | undefined;
  endDate: Date | undefined;
  endTime: string | undefined;
}

function SetEvent(props: IProps) {
  const { setCloseDialog, visible, responsiveMediaQuery, selectedDate } = props;
  const selectedDateObj = new Date(selectedDate)

  //Form props items to hold
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date | null>(
    selectedDateObj
  );
  const [startTime, setStartTime] = React.useState<string | null>();
  const [endDate, setEndDate] = React.useState<Date | null>(
    selectedDateObj
  );
  const [endTime, setEndTime] = React.useState<string | null>();
  const [color, setColor] = React.useState<string>("#ff0000");
  const [isRecurring, setIsRecurring] = React.useState(false);
  const [chosenRecurringDays, setChosenRecurringDays] = React.useState<
    string[]
  >([]);
  const [chosenEvent, setChosenEvent] = React.useState("");

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

  return (
    <Dialog
      fullScreen={responsiveMediaQuery}
      sx={{ "& .MuiDialog-paper": { width: "80%", height: "55%" } }}
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
              defaultValue=""
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
              defaultValue=""
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
          <Grid item xs={12}>
            <DialogContentText>Recurring event?</DialogContentText>
          </Grid>
          <Grid item xs={12}>
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
          {/* This is the choosing of day */}
          <Grid item xs={12}>
            <FormControl sx={{ m: 1 }} fullWidth disabled={!isRecurring}>
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={setCloseDialog}>Close</Button>
        <Button>Set Event</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SetEvent;
