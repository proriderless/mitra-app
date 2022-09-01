//This file is specifically for handling the setting of events
import { DateTime } from "luxon";

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

function handleDeleteEvent() {}

export function handleUpdateEvent(
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
  eventArray: Array<any>
) {
  //find the event index
  let deepCopEventArray = [...eventArray]
  let eventTarget = deepCopEventArray.findIndex(({ foundid }: { foundid: string }) => foundid === String(id))
  
  //The same checks apply
  deepCopEventArray[eventTarget] = handleSetEvents(id, title, description, startDate, endDate, startTime, endTime, remindTime, eventCategory, backgroundColor, recurringEvent, daysOfWeek, rrulesDesc)

}

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
  rrulesDesc: string
) {
  interface iMapDays {
    [key: string]: number;
  }

  console.log(startDate);
  console.log(startTime);

  const mapDays: iMapDays = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thurdays: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
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

      //sort in ascending order
      remappedDays.sort(function (a, b) {
        return a - b;
      });

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
      let eventStruct = {
        id: String(id),
        title: title,
        startTime: startTime,
        endTime: endTime,
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
