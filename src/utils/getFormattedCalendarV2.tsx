import { useMyContext } from "contexts/Context";
import { add, format, isSameDay } from "date-fns";
import { toBrDate } from "./toBrDate";

export const getFormattedCalendarV2 = (
  calendars: any,
  initialDate: any = null
) => {
  const today = (initialDate || new Date()) as any;

  const empty7days = Array.from({ length: 7 }, (_, i) => {
    const thisDay = add(today, { days: i });

    const hours = calendars?.filter((day: any) => {
      return isSameDay(new Date(day.hour), thisDay);
    });

    return {
      date: thisDay,
      hours,
      location: "Online",
    };
  });

  return empty7days;
};
