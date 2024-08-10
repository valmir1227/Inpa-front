import { formatISO, isValid } from "date-fns";

export function toBrDate(date: any) {
  const formatedDate = new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  return formatedDate;
}

export function toBrFullDate(date: any) {
  const formatedDate = new Date(date).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  return formatedDate;
}

export function toBrFullDate0GMT(date: any) {
  const formatedDate = new Date(date).toLocaleString("pt-BR", {
    timeZone: "Etc/GMT",
  });
  return isValid(new Date(date)) ? formatedDate : "-";
}
export function toBrDate0GMT(date: any) {
  const formatedDate = new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "Etc/GMT",
  });
  return isValid(new Date(date)) ? formatedDate : "-";
  // return formatedDate;
}

export function dateToDbDate(date: any) {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatISO(d, { representation: "date" });
}

export function brDateToDate(date: any) {
  const [d, m, y] = date.split("/");
  return new Date(y, m, d);
}
