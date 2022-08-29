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

//import css
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

function CalendarPage() {
  const calendarRef = React.useRef<any>();
  const [loadEvents, setLoadEvents] = React.useState<any>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(
    DateTime.now().toString()
  );

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  function updateCalendarSize() {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.updateSize();
    calendarApi.updateSize();
    calendarApi.updateSize();
  }

  React.useEffect(() => {
    //Force re-render once
    let events = [
      {
        id: "a",
        title: "my event",
        start: "2022-08-27T10:30:00",
        end: "2022-08-27T12:30:00",
        backgroundColor: "blue",
        borderColor: "green",
      },
    ];
    setLoadEvents(events);
    updateCalendarSize();
    setTimeout(updateCalendarSize, 1000);
  }, []);

  //Update the scene when it's updated
  React.useEffect(() => {
    updateCalendarSize();
  }, [loadEvents]);

  function dateClickUpdate(dateClickInfo: any) {
    let copDateClickInfo = {...dateClickInfo}
    setSelectedDate(copDateClickInfo.dateStr);
    setOpenDialog(!openDialog);
  }

  return (
    <>
      <Button variant="contained" onClick={updateCalendarSize}>
        Show Folder
      </Button>

      <FullCalendar
        // height={"100%"}
        timeZone="UTC"
        aspectRatio={1.5}
        ref={calendarRef}
        dateClick={dateClickUpdate}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        events={loadEvents}
        initialView="dayGridMonth"
        headerToolbar={{
          //left: "prev, next, today",
          center: "title",
          left: "dayGridMonth, timeGridWeek, timeGridDay",
        }}
      />

      <SetEvent
        visible={openDialog}
        selectedDate={selectedDate}
        setOpenDialog={handleDialogOpen}
        setCloseDialog={handleDialogClose}
        responsiveMediaQuery={fullScreen}
      />
    </>
  );
}

export default CalendarPage;
