import { Horarios } from "components/psicologo/horarios/Horarios";
import {
  add,
  eachMinuteOfInterval,
  getTime,
  isSameDay,
  isSameHour,
  parse,
  set,
  setHours,
} from "date-fns";
import { toBrDate } from "./toBrDate";

export function getFormattedFullCalendarV2(formatedCalendar: any) {
  //cria array com 48 horarios vazios
  const formatted = formatedCalendar.map((calendar: any, i: any) => {
    const today = calendar.date;

    const hoursEmpty = eachMinuteOfInterval(
      {
        start: set(today, {
          hours: 0,
          minutes: 0,
          seconds: 0,
        }),
        end: set(today, {
          hours: 23,
          minutes: 59,
          seconds: 59,
        }),
      },
      { step: 30 }
    );

    const dataCalendarHours = calendar.hours?.map((hourDoBack: any) => ({
      ...hourDoBack,
      hour: new Date(hourDoBack.hour),
    }));

    const empty = hoursEmpty
      .filter(
        (empty: any) =>
          !dataCalendarHours?.some((hour: any) => {
            return Date.parse(hour.hour) === Date.parse(empty);
          })
      )
      .map((empty) => ({
        location: "Online",
        hour: empty,
        status: null,
      }));

    return {
      date: set(calendar.date, { hours: 0, minutes: 0 }),
      hours: [...empty, ...(dataCalendarHours || [])],
    };
  });

  return formatted;
}
