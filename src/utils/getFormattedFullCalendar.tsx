import { Horarios } from "components/psicologo/horarios/Horarios";
import { toBrDate } from "./toBrDate";

export function getFormatedFullCalendar(formatedCalendar: any) {
  //cria array com 48 horarios vazios
  const empty48lines = Array.from({ length: 48 }, (_, i) => ({
    minutes: i * 30,
    free: null,
  }));

  //filtra os 48, deixando apenas os que nao vieram do back
  //metodo 'some' verifica se ja existe um registro com aquele 'minute' e o 'filter' ignora se existir
  const difference48lines = (diaDoBack: any) =>
    empty48lines.filter(
      (emptyLine) =>
        !diaDoBack?.hours.some((x: any) => x.minutes === emptyLine.minutes)
    );

  //cria um novo array, fazendo um merge dos dados do back + dados vazios para totalizar os 48 horarios
  const fullCalendar = formatedCalendar?.map((formattedDay: any) => ({
    ...formattedDay,
    date: formattedDay.date, //dia vem do back (sem alterações)
    hours: [...formattedDay.hours, ...difference48lines(formattedDay)], //merge somando 48
  }));

  //retorna o array completo ordenado ASC, contendo apenas os dias recebidos pelo back, mas agora com os horarios vazios
  return fullCalendar
    ?.sort((a: any, b: any) => a.minutes - b.minutes)
    ?.sort((a: any, b: any) => a.date.newdate - b.date.newdate);
}
