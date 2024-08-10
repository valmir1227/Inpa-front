/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { SEMANA } from "../../../utils/SEMANA";
import { toBrDate, toBrFullDate } from "../../../utils/toBrDate";
import { FiShoppingCart } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { getFormattedCalendar } from "utils/getFormattedCalendar";
import { getFormattedCalendarV2 } from "utils/getFormattedCalendarV2";
import {
  add,
  addWeeks,
  differenceInMinutes,
  getDay,
  getMinutes,
  getTime,
  hoursToMinutes,
  isFuture,
  isPast,
  isSameDay,
  millisecondsToMinutes,
  set,
  subWeeks,
} from "date-fns";
import { useMyContext } from "contexts/Context";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useCart } from "stores/useCart";
import { produce } from "immer";
import { useImmer } from "use-immer";
import { useUsers } from "stores/useUser";

export function Agenda({
  showFooter = false,
  expert,
  selectedService,
  initialDate = false,
}: any) {
  // const firstDay = new Date();
  const { firstDay } = useMyContext();

  const notNulled = useMemo(() => {
    return expert?.calendars.filter((item: any) => item.status !== "null");
  }, [expert?.calendars]);

  const formatedCalendar = getFormattedCalendarV2(
    //oculta os dias que não tem horários disponíveis "null"
    notNulled,
    initialDate || firstDay
  );

  const [days, setDays] = useState<any>(formatedCalendar || []);
  const { setCart, cart, setCartRaw, cartRaw } = useCart();

  const expertData = {
    name: expert?.name,
    id: expert?.id,
  };

  const { user } = useUsers();

  function handleSelectHour(selectedHour: any, service: any = null) {
    // const diff = days.filter((day: any) => day.date !== selectedDay.date);

    /* const updatedDay = {
      date: selectedDay.date,
      expertData,
      hours: [
        ...selectedDay.hours?.filter(
          (dia: any) => dia.hour !== selectedHour.hour
        ),
        {
          ...selectedHour,
          hour: selectedHour.hour,
          status: invertStatusOnClick,
          selectedService,
        },
      ],
    }; */

    const immer = produce(days, (draft: any) => {
      selectedHour.forEach((eachHour: any) => {
        if (isPast(new Date(eachHour?.hour))) return;
        const invertStatusOnClick =
          eachHour.status === "cart" ? "true" : "cart";
        const indexDay = draft.findIndex((day: any) =>
          isSameDay(day?.date, new Date(eachHour?.hour))
        );
        if (indexDay !== -1) {
          const indexPast = draft[indexDay]?.hours?.findIndex((hour: any) =>
            isPast(new Date(hour?.hour))
          );
          if (indexPast !== -1) {
            /* alert(
              `O horário ${toBrFullDate(
                draft[indexDay].hours[indexPast].hour
              )} foi removido do carrinho porque não está mais disponível}`
            ); */
            draft[indexDay].hours[indexPast].status = "null";
          }
          const indexHour = draft[indexDay]?.hours?.findIndex(
            (hour: any) => hour?.id === eachHour?.id
          );
          if (indexHour !== -1) {
            draft[indexDay].hours[indexHour].status = invertStatusOnClick;
            draft[indexDay].hours[indexHour].selectedService =
              eachHour.selectedService || selectedService;
          }
        }
      });
    }) as any;

    // console.log(immer);

    /* const state = [...diff, updatedDay]?.sort(
      (a: any, b: any) => a.date - b.date
    ); */
    setDays(immer);

    const active = immer?.reduce((acc: any, cur: any) => {
      const carts = cur.hours?.filter(
        (hour: any) => hour.status === "cart" && isFuture(new Date(hour?.hour))
      );
      if (carts) return [...acc, ...carts];
      else return [...acc];
    }, []);

    const filtered = immer?.filter(
      (item: any) => item.expert?.id !== expert?.id && item.expert
    );

    const subTotalCartPrice = active.reduce((acc: any, cur: any) => {
      const price = user?.from_id
        ? +cur.selectedService?.credit_value || 0
        : +cur.selectedService?.price || 0;
      // const price = +cur.selectedService?.price || 0;
      return (acc += price);
    }, 0);

    if (active.length > 0)
      setCart([...filtered, { expert, cart: active, subTotalCartPrice }]);
    else setCart([...filtered]);
  }

  //Tentativa de atualizar days baseado no cart (ao carregar a pagina ou refetch do swr)
  useEffect(() => {
    updateDays();
  }, []);

  const updateDays = () => {
    handleSelectHour(cartRaw?.map((raw: any) => raw.selectedHour));
  };

  //FUNCAO MOVIDA PARA O ONLICK ACIMA
  /* useEffect(() => {
    const active = days?.reduce((acc: any, cur: any) => {
      const carts = cur.hours?.filter((hour: any) => hour.status === "cart");
      if (carts) return [...acc, ...carts];
      else return [...acc];
    }, []);

    const filtered = cart?.filter(
      (item: any) => item.expert?.id !== expert?.id && item.expert
    );

    const subTotalCartPrice = active.reduce((acc: any, cur: any) => {
      const price = +cur.selectedService?.price || 0;
      return (acc += price);
    }, 0);

    if (active.length > 0)
      setCart([...filtered, { expert, cart: active, subTotalCartPrice }]);
    else setCart([...filtered]);
  }, [days]); */

  return (
    <Flex flexDir="column">
      {/* <Button onClick={updateDays}>Atualizar</Button> */}
      <Flex
        fontSize={14}
        fontWeight={500}
        bg="white"
        overflowY="auto"
        justify="space-between"
        position="relative"
        zIndex={2}
        p={1}
        w="full"
        h={300}
        maxW={350}
        borderWidth="2px"
        _before={{
          content: "' '",
          w: "full",
          position: "absolute",
          top: 8,
          left: 0,
          h: 30,
          bg: "azul",
          zIndex: 0,
        }}
      >
        {[...days].map((calendarDay: any, indexDay: any) => {
          return (
            <VStack key={indexDay} zIndex={2}>
              <Text color={indexDay === 0 ? "amarelo" : "inherit"}>
                {SEMANA[getDay(calendarDay.date)]}
              </Text>
              <Text p={1} bg="azul" color="white">
                {add(initialDate || firstDay, {
                  days: indexDay,
                }).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </Text>

              <VStack spacing={2} fontSize={12} align="center">
                {calendarDay?.hours.map((item: any, index: any) => {
                  const disabledHour = () => {
                    if (item.status === "false" && item.status !== "cart") {
                      // se o horario estiver indisponivel (do backend)
                      return true;
                    }
                    if (isPast(new Date(item.hour))) {
                      // se o horario ja passou (da hora atual)
                      return true;
                    }
                    if (
                      // se o horario for menor que 31 minutos do proximo horario indisponivel
                      calendarDay?.hours[index + 1]?.status === "false" &&
                      differenceInMinutes(
                        new Date(calendarDay?.hours[index + 1]?.hour),
                        new Date(item.hour)
                      ) < 31
                    ) {
                      return true;
                    }
                    if (
                      // se o horario for menor que 31 minutos do proximo horario no carrinho
                      calendarDay?.hours[index + 1]?.status === "cart" &&
                      differenceInMinutes(
                        new Date(calendarDay?.hours[index + 1]?.hour),
                        new Date(item.hour)
                      ) < 31
                    ) {
                      return true;
                    }
                    if (
                      // se o horario for menor que 31 minutos do horario anterior no carrinho
                      calendarDay?.hours[index - 1]?.status === "cart" &&
                      differenceInMinutes(
                        new Date(item.hour),
                        new Date(calendarDay?.hours[index - 1]?.hour)
                      ) < 31
                    ) {
                      return true;
                    }
                    //libera o horario caso nao entre em nenhuma das condicoes acima
                    return false;
                  };

                  return (
                    <Button
                      key={item.id}
                      // mt={"26px"}
                      h={7}
                      colorScheme="none"
                      color={item.status === "cart" ? "white" : "inherit"}
                      bg={
                        item.status === "true"
                          ? "cinzaclaro"
                          : item.status === "cart"
                          ? "amarelo"
                          : "cinzaclaro"
                      }
                      // _focus={{ bg: "amarelo", color: "white" }}
                      _hover={{ bg: "azul", color: "white" }}
                      w="40px"
                      fontSize={13}
                      p={1}
                      _disabled={{
                        _hover: { bg: "red", color: "white" },
                        cursor: "not-allowed",
                        opacity: 0.3,
                      }}
                      isDisabled={disabledHour()}
                      onClick={() => {
                        handleSelectHour([item], calendarDay);
                        setCartRaw({
                          selectedHour: { ...item, selectedService },
                          // selectedDay: calendarDay,
                          expertData,
                        });
                      }}
                    >
                      {new Date(item.hour)?.toLocaleTimeString("pt-BR", {
                        timeStyle: "short",
                      })}
                    </Button>
                  );
                })}
              </VStack>
            </VStack>
          );
        })}
      </Flex>
      <Flex w="full">
        <HStack
          overflow="hidden"
          borderBottomRadius={10}
          color="white"
          spacing={0}
          w="full"
        >
          <Button
            colorScheme="blackAlpha"
            _hover={{ bg: "azul" }}
            borderRadius={0}
            bg="amarelo"
            fontWeight={500}
          >
            Online
          </Button>
          <Tooltip
            shouldWrapChildren
            hasArrow
            label="Indisponível para atendimento presencial"
            bg="red.600"
            fontWeight={400}
            fontSize={12}
          >
            <Button
              disabled
              colorScheme="blackAlpha"
              bg="cinza"
              borderRadius={0}
              fontWeight={500}
            >
              Presencial
            </Button>
          </Tooltip>
          {/* <Spacer /> */}
          {/* <UpdateWeeks /> */}
        </HStack>
        <Link href="/checkout" passHref>
          <Button
            as="a"
            display={cart?.length > 0 ? "flex" : "none"}
            leftIcon={<FaShoppingCart />}
            borderTopRadius={0}
            ml="auto"
            colorScheme="none"
            bg="amarelo"
            fontWeight={500}
          >
            Agendar
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
}

const UpdateWeeks = () => {
  const { setFirstDay, firstDay } = useMyContext();
  return (
    <HStack>
      <Tooltip label="Semana anterior">
        <IconButton
          variant="ghost"
          aria-label="Semana anterior"
          icon={<ChevronLeftIcon />}
          fontSize={20}
          color="cinzaescuro"
          onClick={() => {
            setFirstDay(subWeeks(firstDay || new Date(), 1));
          }}
        />
      </Tooltip>
      <Tooltip label="Próxima semana">
        <IconButton
          variant="ghost"
          aria-label="Próxima semana"
          icon={<ChevronRightIcon />}
          fontSize={20}
          color="cinzaescuro"
          onClick={() => {
            setFirstDay(addWeeks(firstDay || new Date(), 1));
          }}
        />
      </Tooltip>
    </HStack>
  );
};
