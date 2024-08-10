/* eslint-disable jsx-a11y/aria-proptypes */
import React, { memo, useMemo, useState } from "react";
import {
  Button,
  Flex,
  HStack,
  Tag,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { SEMANA } from "../../../utils/SEMANA";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { darken } from "@chakra-ui/theme-tools";
import { useEffect } from "react";
import { useFetch } from "hooks/useFetch";
import { useMyContext } from "contexts/Context";
import { getFormattedCalendar } from "utils/getFormattedCalendar";
import { getFormatedFullCalendar } from "utils/getFormattedFullCalendar";
import { getFormattedCalendarV2 } from "utils/getFormattedCalendarV2";
import { getFormattedFullCalendarV2 } from "utils/getFormattedFullCalendarV2";
import {
  differenceInMinutes,
  format,
  getHours,
  getMilliseconds,
  getMinutes,
  getSeconds,
  getTime,
  isToday,
  millisecondsToMinutes,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { LoadingInpa } from "components/global/Loading";

export function Agenda({
  selectedDay,
  days,
  setDays,
  dataCalendars,
  isFetchingCalendars,
  setIsDirty,
}: any) {
  const { user } = useMyContext();

  const [today, setToday] = useState(new Date());

  useEffect(() => {
    if (selectedDay) setToday(selectedDay);
  }, [selectedDay]);

  const formatedCalendar =
    getFormattedCalendarV2(dataCalendars, selectedDay) || [];

  const formatedFullCalendar =
    (getFormattedFullCalendarV2(formatedCalendar) as any) || [];

  useEffect(() => {
    setDays(formatedFullCalendar);
  }, [dataCalendars]);

  function handleSelectHour(selectedHour: any, selectedDay: any) {
    setIsDirty(true);

    const diff = days.filter((day: any) => day.date !== selectedDay.date);

    const updatedDay = {
      date: selectedDay.date,
      hours: [
        ...selectedDay.hours?.filter(
          (dia: any) => dia.hour !== selectedHour.hour
        ),
        {
          ...selectedHour,
          hour: selectedHour.hour,
          status:
            selectedHour.status === "true"
              ? "false"
              : selectedHour.status === "false"
              ? "null"
              : "true",
        },
      ],
    };

    setDays([...diff, updatedDay]?.sort((a: any, b: any) => a.date - b.date));
  }

  return (
    <Flex maxW={900} w="full" flexDir="column" alignSelf="center">
      {isFetchingCalendars && <LoadingInpa />}
      <Flex
        alignSelf="start"
        fontSize={14}
        fontWeight={500}
        bg="bg"
        overflow="auto"
        justify={["start", "space-around"]}
        position="relative"
        py={2}
        // pl={[12, 4]}
        w="full"
        // h={700}
        borderWidth="2px"
        _before={{
          content: "' '",
          w: "full",
          position: "absolute",
          top: 9,
          left: 0,
          h: 38,
          bg: "azul",
          zIndex: 0,
        }}
        borderRadius={16}
      >
        {days?.map((day: any, indexDay: any) => {
          // const numberToday = today.getDate() + indexDay;

          return (
            <Memoized
              key={day.date}
              day={day}
              indexDay={indexDay}
              handleSelectHour={handleSelectHour}
              isFetchingCalendars={isFetchingCalendars}
            />
          );
        })}
      </Flex>
    </Flex>
  );
}

const Dia = (props: any) => {
  const { day, indexDay, handleSelectHour, isFetchingCalendars } = props;
  return (
    <VStack key={day.date} zIndex={2}>
      <Text
        textTransform="capitalize"
        color={isToday(day.date) ? "amarelo" : "inherit"}
      >
        {format(day.date, "EEEEEE", { locale: ptBR })}
      </Text>
      <Text p={2} bg="azul" color="white">
        {format(day.date, "dd/MM", { locale: ptBR })}
      </Text>
      {day?.hours
        ?.sort((a: any, b: any) => a.hour - b.hour)
        ?.map((item: any, indexHour: any) => {
          const minutes = differenceInMinutes(item.hour, startOfDay(item.hour));
          const periodo = () => {
            switch (minutes) {
              case 1080:
                return "Noite";
              case 720:
                return "Tarde";
              case 360:
                return "Manhã";
              case 0:
                return "Alternativo";
              default:
                return null;
            }
          };

          const disabledHour =
            item.status === "false" &&
            (item.status_by === "999999" || item.status_by === "999999+");

          return (
            <VStack key={item.date} spacing={0} fontSize={12} align="center">
              {indexDay === 0 && periodo() && (
                <Text alignSelf="start" pt={2} color="cinza">
                  {periodo()}
                </Text>
              )}

              <Button
                disabled={isFetchingCalendars || disabledHour}
                onClick={() => handleSelectHour(item, day)}
                mt={indexDay !== 0 && periodo() ? 25 : 0}
                h={[7, 10]}
                colorScheme="none"
                color={
                  item.status === "true" || item.status === "false"
                    ? "white"
                    : "cinzaescuro"
                }
                _disabled={{
                  _hover: { bg: "red", color: "white" },
                  cursor: "not-allowed",
                  opacity: 0.3,
                }}
                w={[45, 70]}
                fontSize={14}
                p={1}
                bg={
                  item.status === "true"
                    ? "amarelo"
                    : item.status === "false"
                    ? "azul"
                    : "cinzaclaro"
                }
              >
                {item.hour.toLocaleTimeString("pt-BR", {
                  timeStyle: "short",
                })}
              </Button>
            </VStack>
          );
        })}
    </VStack>
  );
};
const Memoized = React.memo(Dia);
