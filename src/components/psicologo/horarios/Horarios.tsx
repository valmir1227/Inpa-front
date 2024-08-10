import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Wrap,
  VStack,
  Avatar,
  Icon,
  Center,
  FormLabel,
  Text,
  HStack,
  Box,
  Button as ChakraButton,
  Circle,
  useFocusEffect,
  Tag,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";

import { Input } from "../../global/Select";
import { ChevronLeftIcon, ChevronRightIcon, EditIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import { CheckboxInpa } from "../../global/Checkbox";
import { Button, ButtonLink } from "../../global/Button";
import { Agenda } from "./Agenda";
import Link from "next/link";
import { DatePickerInput } from "../../global/DatePickerInput";
import { useMyContext } from "contexts/Context";
import { usePost } from "hooks/usePost";
import { useFetch } from "hooks/useFetch";
import { AlertInpa } from "components/global/Alert";
import {
  add,
  addDays,
  addWeeks,
  format,
  getHours,
  isToday,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { FiCalendar } from "react-icons/fi";

export function Horarios() {
  const { user } = useMyContext();
  const [selectedDay, setSelectedDay] = useState<any>();
  const [days, setDays] = useState<any>([]);
  const selectedDayFormatted = format(
    addDays(selectedDay || new Date(), 7),
    "yyyy-MM-dd",
    {
      locale: ptBR,
    }
  );

  const [dataCalendars, errorCalendars, isFetchingCalendars, getCalendars] =
    useFetch(`/v2/calendars/${user?.id}?end="${selectedDayFormatted}"`);

  const [
    handlePostCalendars,
    dataPostCalendars,
    errorPostCalendars,
    isPostingCalendars,
  ] = usePost("/v2/calendars");

  function convertToLelonV2() {
    const convert = days?.map((day: any) => {
      const clearNulledHours = day.hours
        .filter((hour: any) => hour.status !== null)
        .map((hour: any) => ({ ...hour, hour: hour.hour.toISOString() }));

      return {
        ...day,
        date: day.date,
        hours: clearNulledHours,
        user_id: user?.id,
      };
    });
    return convert?.reduce((obj: any, cur: any) => {
      return [...obj, ...cur.hours];
    }, []);
  }

  const [weekDays, setWeekDays] = useState([""]);
  const [shiftTime, setShiftTime] = useState([""]);

  const [isDirty, setIsDirty] = useState(false);

  function handleAutoFillDays() {
    setIsDirty(true);
    const updatedDays = days.map((day: any) => {
      return {
        date: day.date,
        hours: day.hours.map((hour: any) => {
          // console.log("hour", format(hour.hour, "EEEE", { locale: ptBR }));
          const updateToTrue = () => {
            const dayMatch = weekDays.some(
              (week) =>
                week.toLowerCase() ===
                format(hour.hour, "EEEE", { locale: ptBR })
            );

            const hourNumber = hour.hour.getHours();

            const shiftCheck = (shiftName: string) =>
              shiftTime.includes(shiftName);

            const shiftMatch =
              (shiftCheck("Noturno (18:00 até 23:30)") &&
                hourNumber >= 18 &&
                hourNumber < 24) ||
              (shiftCheck("Matutino (06:00 até 11:30)") &&
                hourNumber >= 6 &&
                hourNumber < 12) ||
              (shiftCheck("Vespertino (12:00 até 17:30)") &&
                hourNumber >= 12 &&
                hourNumber < 18) ||
              (shiftCheck("Alternativo (00:00 até 05:30)") &&
                hourNumber >= 0 &&
                hourNumber < 6);

            if (dayMatch && shiftMatch) return true;
          };
          if (updateToTrue()) return { ...hour, status: "true" };
          return hour;
        }),
      };
    });
    setDays(updatedDays);
  }

  useEffect(() => {
    if (user?.id) getCalendars();
  }, [user, selectedDay]);

  useEffect(() => {
    if (dataPostCalendars.status === 200) {
      getCalendars();
      setIsDirty(false);
    }
  }, [dataPostCalendars]);

  return (
    <Flex
      bg="#f5f5f5"
      flexDir="column"
      as="section"
      justify="center"
      align="center"
      w="100%"
      gap={4}
      py={4}
    >
      <Flex
        p={{ base: "1rem", md: "2rem" }}
        bg="white"
        color="cinzaescuro"
        borderRadius={20}
        borderWidth={1}
        align="start"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir="column"
        gap={4}
        mt={4}
        fontSize={14}
      >
        <Flex w="full" justify="space-between" align="center">
          <Heading fontSize={["26", "28"]}>Horários</Heading>
          <Heading fontSize={["16", "18"]}>Preenchimento automático</Heading>
        </Flex>
        <Text py={4} w="full" textAlign="center">
          Para facilitar saber quais são seus horários disponíveis, marque os
          campos abaixo de acordo com sua preferência:
        </Text>
        {/* <Text fontSize={16} fontWeight={500}>
          Escolha quais datas você deseja preencher
        </Text>

        <Wrap
          opacity={0.4}
          overflow="visible"
          spacing={8}
          justify="center"
          w="full"
        >
          <DatePickerInput disabled title="De" />
          <DatePickerInput disabled title="Até" />
        </Wrap> */}

        <Text fontSize={16} fontWeight={500}>
          Escolha seus dias da semana
        </Text>
        <Wrap justify="center" w="full">
          <CheckboxInpa
            values={[
              "Segunda-feira",
              "Terça-feira",
              "Quarta-feira",
              "Quinta-feira",
              "Sexta-feira",
              "Sábado",
              "Domingo",
            ]}
            setState={setWeekDays}
          />
        </Wrap>

        <Text pt={4} fontSize={16} fontWeight={500}>
          Escolha seus horários
        </Text>
        <Wrap justify="center" w="full">
          <CheckboxInpa
            values={[
              "Matutino (06:00 até 11:30)",
              "Vespertino (12:00 até 17:30)",
              "Noturno (18:00 até 23:30)",
              "Alternativo (00:00 até 05:30)",
            ]}
            setState={setShiftTime}
          />
        </Wrap>
        <Flex
          w="full"
          justify="space-between"
          gap={[6, 16]}
          flexDir={["column", "row"]}
          align="center"
        >
          <Text flex={1} fontSize={12}>
            {/* Dicas:
            <br />
            Após marcar os campos desejados clique no botão “Aplicar” e então
            seus horários serão atualizados de acordo com as marcações. Caso
            tenha aplicado mas deseja voltar para as marcações anteriores clique
            em “Cancelar” no final da página.
            <br /> */}
            Suas alterações só serão salvas ao clicar em “Salvar” no final da
            página.
          </Text>
          <Button
            onClick={handleAutoFillDays}
            title="Aplicar"
            borderRadius={10}
            px={8}
          />
        </Flex>
        <Heading mt={8} fontSize={[26, 28]}>
          Agenda
        </Heading>
        {isDirty ? (
          <Flex
            flexDir="column"
            gap={0}
            p={4}
            w="full"
            maxW={1200}
            justify="center"
            align="center"
          >
            <Button
              onClick={() => handlePostCalendars(convertToLelonV2())}
              // onClick={convertToLelonV2}
              variant="ghost"
              borderRadius="full"
              px={8}
              title="Salvar"
              isLoading={isPostingCalendars}
            />
          </Flex>
        ) : (
          <Flex
            zIndex={9} //sobrepondo agenda
            align="flex-end"
            alignSelf="center"
            // flexDir="column"
            maxW={900}
            w="full"
            justify="space-between"
          >
            <HStack>
              <Tooltip label="Semana anterior">
                <IconButton
                  variant="ghost"
                  aria-label="Semana anterior"
                  icon={<ChevronLeftIcon />}
                  fontSize={20}
                  color="cinzaescuro"
                  onClick={() =>
                    setSelectedDay(subWeeks(selectedDay || new Date(), 1))
                  }
                />
              </Tooltip>
              <Tooltip label="Próxima semana">
                <IconButton
                  variant="ghost"
                  aria-label="Próxima semana"
                  icon={<ChevronRightIcon />}
                  fontSize={20}
                  color="cinzaescuro"
                  onClick={() =>
                    setSelectedDay(addWeeks(selectedDay || new Date(), 1))
                  }
                />
              </Tooltip>
            </HStack>
            <Box>
              {dataPostCalendars?.status === 200 && (
                <AlertInpa text="Agenda atualizada" status="success" />
              )}
              {errorPostCalendars && (
                <AlertInpa text="Erro ao atualizar agenda" status="warning" />
              )}
            </Box>
            <DatePickerInput
              title="Ver dia"
              setState={setSelectedDay}
              selected={selectedDay}
            />
          </Flex>
        )}
        {dataCalendars === undefined && (
          <AlertInpa text="Erro ao carregar agenda" status="warning" />
        )}
        {dataCalendars && (
          <Agenda
            days={days}
            setDays={setDays}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            setIsDirty={setIsDirty}
            dataCalendars={dataCalendars}
            getCalendars={getCalendars}
            isFetchingCalendars={isFetchingCalendars}
          />
        )}
        <Flex fontSize={12} alignSelf="center" maxW={900} w="full">
          <HStack>
            <Circle size={6} bg="azul" />
            <Text pr={4}>Agendado</Text>
            <Circle size={6} bg="amarelo" />
            <Text pr={4}>Disponível</Text>
            <Circle size={6} bg="cinza" />
            <Text pr={4}>Não selecionados</Text>
          </HStack>
        </Flex>
      </Flex>
      <Flex flexDir="column" gap={0} p={4} w="full" maxW={1200} justify="end">
        <Button
          onClick={() => handlePostCalendars(convertToLelonV2())}
          // onClick={convertToLelonV2}
          variant="ghost"
          borderRadius="full"
          alignSelf="end"
          px={8}
          title="Salvar"
          isLoading={isPostingCalendars}
        />
        <Box alignSelf="flex-end">
          {dataPostCalendars?.status === 200 && (
            <AlertInpa text="Agenda atualizada" status="success" />
          )}
          {errorPostCalendars && (
            <AlertInpa text="Erro ao atualizar agenda" status="warning" />
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
