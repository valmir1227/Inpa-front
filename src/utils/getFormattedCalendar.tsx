import { useMyContext } from "contexts/Context";
import { add, format } from "date-fns";
import { toBrDate } from "./toBrDate";

export const getFormattedCalendar = (calendars: any) => {
  const empty7days = Array.from({ length: 7 }, (_, i) => ({
    date: format(add(new Date(), { days: i }), "yyyy-MM-dd"),
    hours: [],
    location: "online",
  }));

  const diff = empty7days.filter((emptyDay) => {
    return !calendars?.some((x: any) => x.date === emptyDay.date);
  });

  const merged = [...diff, ...(calendars || [])];

  return merged?.map((calendar: any) => {
    /* const difference7days = (calendar: any) =>
      empty7days.filter(
        (emptyDay) =>
          !calendar?.hours.some((x: any) => x.minutes === emptyDay.minutes)
      ); */

    //cria um novo array, fazendo um merge dos dados do back + dados vazios para totalizar os 48 horarios
    /*     const merged7Days = formatedCalendar?.map((formattedDay: any) => ({
      date: formattedDay.date, //dia vem do back (sem alterações)
      hours: [...formattedDay.hours, ...difference7days(formattedDay)], //merge somando 48
      id: formattedDay.id,
      location: formattedDay.location,
    })); */

    const { id, location } = calendar;
    const [y, m, d] = calendar.date.split("-");
    const arrayHours = Object.entries(calendar.hours);
    const formatedHours = arrayHours
      .map((hour: any) => ({
        minutes: hour[0] * 60,
        free: hour[1],
      }))
      .filter((hour) => hour.free !== null)
      ?.sort((a, b) => a.minutes - b.minutes);

    return {
      ...calendar,
      date: {
        newdate: new Date(y, m - 1, d),
        y,
        m,
        d,
        saopaulo: toBrDate(calendar.date),
        original: calendar.date,
      },
      hours: formatedHours,
    };
  });
};
