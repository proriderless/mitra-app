import React from "react";
import { EProductivity } from "../../Utils/enums";
import CalendarPage from './CalendarPage'

interface IProps {
  displayComponent: string;
}

function Productivity(props: IProps) {
  const { displayComponent } = props;

  switch (displayComponent) {
    case EProductivity.MAIN_CALENDAR:
      return (
        <>
          <CalendarPage />
        </>
      );
    default:
      return <>There's nothing in Productivity.</>;
  }
}

export default Productivity;
