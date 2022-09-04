import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import Button from "@mui/material/Button";
import SetEvent from "./SetEvent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { DateTime } from "luxon";
import { ESchedulerIpcListener, EUpdateMode } from "../../../Utils/enums";
import rrulePlugin from '@fullcalendar/rrule'
import PromptDialog from "../../../UiComponents/PromptDialog";

//import css
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import { handleDeleteEvent, updateScheduleFile } from "./utils";

declare global {
  interface Window {
    ipcRenderer: any;
  }
}

function CalendarPage() {
  const calendarRef = React.useRef<any>();
  const [loadEvents, setLoadEvents] = React.useState<any>([]);
  const [openSetEventDialog, setOpenSetEventDialog] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<DateTime>(DateTime.now());
  const [globalIDState, setGlobalIDState] = React.useState<number>(1);
  const [reloadCalendar, setReloadCalendar] = React.useState(true);
  const [existingID, setExistingID] = React.useState<number>()
  const [updateMode, setUpdateMode] = React.useState<EUpdateMode>(EUpdateMode.NEW)

  //Prompt Dialog Stuff
  const [openPromptDialog, setOpenPromptDialog] = React.useState(false)
  const [eventTitle, setEventTitle] = React.useState('')
  const [eventDesc, setEventDesc] = React.useState('')

  function retrieveScheduleFile() {
    window.ipcRenderer
      .invoke(ESchedulerIpcListener.RETRIEVE_SCHEDULE_FILE)
      .then((result: boolean | string) => {
        if (result === false) {
          console.log("something went wrong retrieving file");
        } else if (typeof result === "string") {
          let schedulerFile = JSON.parse(result);
          setLoadEvents(schedulerFile["schedule"]);
          let lengthOfSchedule = schedulerFile["schedule"].length;
          //Set the global id as depending on the previous id
          setGlobalIDState(
            parseInt(schedulerFile["schedule"][lengthOfSchedule - 1]["id"])
          );
        }
      });
  }

  function removeLoadEvents(id:string) {
    let copArr = handleDeleteEvent(id, loadEvents)
    setLoadEvents(copArr)
    updateScheduleFile(copArr)
  }

  //Handle event click callback
  function handleEventClickCallBack(info:any) {
    info.jsEvent.preventDefault()
    console.log(info.event)
    setExistingID(info.event.id)
    setEventTitle(`Event: ${info.event.title}`)
    setEventDesc(`${info.event.extendedProps.description}`)
    setOpenPromptDialog(true)
  }

  function handlePromptUpdate(){
    setUpdateMode(EUpdateMode.UPDATE)
    handleSetEventDialogOpen()
    setOpenPromptDialog(false)
  }

  function handlePromptDelete() {
    removeLoadEvents(String(existingID))
    setOpenPromptDialog(false)
  }

  function handlePromptClose() {
    setOpenPromptDialog(false)
  }

  React.useEffect(() => {
    //Force re-render once
    retrieveScheduleFile();
    setReloadCalendar(false);
    //updateCalendarSize();
    setTimeout(updateCalendarSize, 500);
    setTimeout(updateCalendarSize, 500);
    console.log("run once");
  }, []);

  const handleSetEventDialogOpen = () => {
    setOpenSetEventDialog(true);
  };

  const handleSetEventDialogClose = () => {
    setOpenSetEventDialog(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  function updateCalendarSize() {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.updateSize();
    calendarApi.updateSize();
    calendarApi.updateSize();
  }

  //Update the scene when it's updated
  React.useEffect(() => {
    setReloadCalendar(true);
    setReloadCalendar(false);
    setTimeout(updateCalendarSize, 500);
    setTimeout(updateCalendarSize, 500);
    console.log(loadEvents);
  }, [loadEvents]);

  function dateClickUpdate(dateClickInfo: any) {
    let copDateClickInfo = { ...dateClickInfo };
    setSelectedDate(DateTime.fromISO(copDateClickInfo.dateStr));
    setUpdateMode(EUpdateMode.NEW)
    setOpenSetEventDialog(!openSetEventDialog);
  }

  return (
    <>
      <Button variant="contained" onClick={updateCalendarSize}>
        Show Folder
      </Button>

      {!reloadCalendar && (
        <FullCalendar
          // height={"100%"}
          timeZone="UTC"
          aspectRatio={1.5}
          ref={calendarRef}
          dateClick={dateClickUpdate}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
            rrulePlugin,
          ]}
          eventClick={handleEventClickCallBack}
          events={loadEvents}
          initialView="dayGridMonth"
          headerToolbar={{
            //left: "prev, next, today",
            center: "title",
            left: "dayGridMonth, timeGridWeek, timeGridDay",
          }}
        />
      )}

      {/* Dialog to prompt either update/delete the event */}
      <PromptDialog
        promptDialogVisible={openPromptDialog}
        closeOnlyFunc={handlePromptClose}
        title={eventTitle}
        content={eventDesc}
        acceptFunc={handlePromptUpdate}
        acceptText={'Update Event'}
        notAcceptFunc={handlePromptDelete}
        notAcceptText={'Delete Event'}
      />

      <SetEvent
        visible={openSetEventDialog}
        selectedDate={selectedDate}
        setOpenDialog={handleSetEventDialogOpen}
        setCloseDialog={handleSetEventDialogClose}
        responsiveMediaQuery={fullScreen}
        eventArray={loadEvents}
        handleLoadEvent={setLoadEvents}
        globalID={globalIDState}
        handleGlobalID={setGlobalIDState}
        updateExistingID={existingID}
        handleUpdateMode={updateMode}
      />
    </>
  );
}

export default CalendarPage;
