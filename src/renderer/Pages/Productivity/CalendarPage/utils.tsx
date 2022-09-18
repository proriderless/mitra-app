//This file is specifically for handling the setting of events
import { DateTime } from "luxon";
import { ESchedulerIpcListener } from "../../../Utils/enums";

declare global {
  interface Window {
    ipcRenderer: any;
  }
}

// function convertDateToString(date:Date | null) {
//   if (date === null){
//     return ''
//   }
//   let d = date,
//       month = '' + (d.getMonth() + 1),
//       day = '' + d.getDate(),
//       year = d.getFullYear();

//   if (month.length < 2)
//       month = '0' + month;
//   if (day.length < 2)
//       day = '0' + day;

//   return [year, month, day].join('-');
// }

function convertDateToString(date: DateTime | null) {
  if (date === null) {
    return "";
  }
  return date.toISO().split("T")[0];
}

function convertDateTimeObjectToDuration(time: DateTime | null | undefined) {
  if (typeof time === "undefined" || time === null) {
    return "";
  } else {
    return time.toLocaleString(DateTime.TIME_24_SIMPLE);
  }
}

function removeItem<T>(arr: Array<T>, value: number): Array<T> { 
  if (value > -1) {
    arr.splice(value, 1);
  }
  return arr;
}

export const updateScheduleFile = (eventCop: any) => {
  let finalFormatEventArray = JSON.stringify({
    schedule: eventCop,
  });
  window.ipcRenderer
    .invoke(ESchedulerIpcListener.UPDATE_SCHEDULE_FILE, finalFormatEventArray)
    .then((result: boolean) => {
      if (result === false) {
        console.log('update failed')
        return false
      } else {
        console.log('update success')
        return true
      }
    });
};


export function handleDeleteEvent(delete_id:string, eventArray:Array<any>) {
  let deepCopEventArray = [...eventArray]
  let eventTarget = deepCopEventArray.findIndex(({ id }: { id: string }) => id === delete_id)
  let newRemovedEventArr = removeItem(deepCopEventArray, eventTarget)
  return newRemovedEventArr
}

// export function handleUpdateEvent(
//   id: number,
//   title: string,
//   description: string,
//   startDate: DateTime | null,
//   endDate: DateTime | null,
//   startTime: DateTime | null | undefined,
//   endTime: DateTime | null | undefined,
//   remindTime: string,
//   eventCategory: string,
//   backgroundColor: string,
//   recurringEvent: boolean,
//   daysOfWeek: Array<string>,
//   rrulesDesc: string,
//   eventArray: Array<any>
// ) {
//   //find the event index
//   let deepCopEventArray = [...eventArray]
//   let eventTarget = deepCopEventArray.findIndex(({ foundid }: { foundid: string }) => foundid === String(id))
  
//   //The same checks apply
//   deepCopEventArray[eventTarget] = handleSetEvents(id, title, description, startDate, endDate, startTime, endTime, remindTime, eventCategory, backgroundColor, recurringEvent, daysOfWeek, rrulesDesc)

//}

export function handleSetEvents(
  id: number,
  title: string,
  description: string,
  startDate: DateTime | null,
  endDate: DateTime | null,
  startTime: DateTime | null | undefined,
  endTime: DateTime | null | undefined,
  remindTime: string,
  eventCategory: string,
  backgroundColor: string,
  recurringEvent: boolean,
  daysOfWeek: Array<string>,
  rrulesDesc: string,
  rruleDurationH: string,
  rruleDurationM: string,
) {
  interface iMapDays {
    [key: string]: number;
  }

  console.log(startDate);
  console.log(startTime);

  const mapDays: iMapDays = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };

  //If recurring event is false, construct it normally
  if (recurringEvent === false) {
    let eventStruct = {
      id: String(id),
      title: title,
      start:
        convertDateToString(startDate) +
        "T" +
        convertDateTimeObjectToDuration(startTime),
      end:
        convertDateToString(endDate) +
        "T" +
        convertDateTimeObjectToDuration(endTime),
      backgroundColor: backgroundColor,
      borderColor: backgroundColor,
      description: description,
      remindTime: remindTime,
      eventCategory: eventCategory,
      recurringEvent,
    };

    return eventStruct;
  } else if (recurringEvent === true) {
    //Two scenarios, if rrules is present and not present
    if (rrulesDesc === "") {
      let remappedDays = [];
      for (let days of daysOfWeek) {
        remappedDays.push(mapDays[days]);
      }

      console.log(remappedDays)
      //sort in ascending order
      remappedDays.sort(function (a, b) {
        return a - b;
      });

      console.log(remappedDays)


      //If user does check endless
      //Start day will still be specified regardless, as we do not want it to extend infinitely into the past

      let eventStruct = {
        id: String(id),
        title: title,
        daysOfWeek: remappedDays,
        startRecur: convertDateToString(startDate),
        startTime: convertDateTimeObjectToDuration(startTime),
        endTime: convertDateTimeObjectToDuration(endTime),
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        description: description,
        remindTime: remindTime,
        eventCategory: eventCategory,
        recurringEvent,
      };

      return eventStruct;
    } else {
      //If RRules IS present, overwrite over every option, except time.
      //If either is absent

      if (rruleDurationH == ""){
        rruleDurationH = "0"
      }
      if (rruleDurationM == ""){
        rruleDurationM = "0"
      }

      let durationItem = addLeadingZeros(parseInt(rruleDurationH), 2) + ":" + addLeadingZeros(parseInt(rruleDurationM), 2)
      let eventStruct = {
        id: String(id),
        title: title,
        duration: durationItem,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        rrule: rrulesDesc,
        description: description,
        remindTime: remindTime,
        eventCategory: eventCategory,
        recurringEvent,
      };
      return eventStruct;
    }
  }
}

function addLeadingZeros(num: number, totalLength:number) {
  return String(num).padStart(totalLength, '0');
}