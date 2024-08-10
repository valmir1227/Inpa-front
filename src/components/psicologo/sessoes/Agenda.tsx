/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useState } from "react";
import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import { SEMANA } from "../../../utils/SEMANA";

export function Agenda() {
  const today = new Date();
  const [active, setActive] = useState<any>([]);

  const days = Array.from({ length: 7 });

  function dateFromMin(min: any) {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(min);
    // console.log(today.toLocaleTimeString("pt-BR", { timeStyle: "short" }));
    return today.toLocaleTimeString("pt-BR", { timeStyle: "short" });
  }

  return (
    <Flex flexDir="column">
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
        maxW={420}
        borderWidth="2px"
        _before={{
          content: "' '",
          w: "full",
          position: "absolute",
          top: 8,
          left: 0,
          h: 38,
          bg: "azul",
          zIndex: 0,
        }}
      >
        {days.map((_, indexDay) => {
          const random = Math.floor(Math.random() * (12 - 0) + 0);
          return (
            <VStack key={indexDay} zIndex={2}>
              <Text color={indexDay === 0 ? "amarelo" : "inherit"}>
                {
                  SEMANA[
                    new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() + indexDay
                    ).getDay()
                  ]
                }
              </Text>
              <Text p={2} bg="azul" color="white">
                {new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() + indexDay
                ).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </Text>
              {Array.from({ length: 48 }, (_, indexHour) => {
                const verificacao = active.filter(
                  (item: any) =>
                    item.indexHour === indexHour && item.indexDay === indexDay
                );
                return (
                  <VStack
                    key={indexHour}
                    spacing={0}
                    fontSize={12}
                    align="center"
                  >
                    {indexHour === 0 && indexDay === 0 && (
                      <Text alignSelf="start" pt={2} color="cinza">
                        Manhã
                      </Text>
                    )}
                    {indexHour === 12 && indexDay === 0 && (
                      <Text alignSelf="start" pt={2} color="cinza">
                        Tarde
                      </Text>
                    )}
                    {indexHour === 24 && indexDay === 0 && (
                      <Text alignSelf="start" pt={2} color="cinza">
                        Noite
                      </Text>
                    )}
                    {indexHour === 36 && indexDay === 0 && (
                      <Text alignSelf="start" pt={2} color="cinza">
                        Alternativo
                      </Text>
                    )}
                    <Button
                      mt={
                        indexDay !== 0 &&
                        (indexHour === 0 ||
                          indexHour === 12 ||
                          indexHour === 24 ||
                          indexHour === 36)
                          ? "26px"
                          : 0
                      }
                      h={7}
                      disabled={
                        (indexHour > 4 && indexHour < 7) ||
                        // random === indexHour ||
                        SEMANA[
                          new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            today.getDate() + indexDay
                          ).getDay()
                        ] === "Dom"
                      }
                      colorScheme="none"
                      color={verificacao.length ? "white" : "cinzaescuro"}
                      // _focus={{ bg: "amarelo", color: "white" }}
                      _hover={{ bg: "azul", color: "white" }}
                      _disabled={{
                        _hover: { bg: "red", color: "white" },
                        cursor: "not-allowed",
                        opacity: 0.3,
                      }}
                      w={45}
                      fontSize={14}
                      p={1}
                      bg={verificacao.length ? "amarelo" : "cinzaclaro"}
                      onClick={() => setActive([{ indexDay, indexHour }])}
                    >
                      {`${dateFromMin((indexHour + 12) * 30)}`}
                    </Button>
                  </VStack>
                );
              })}
            </VStack>
          );
        })}
      </Flex>
    </Flex>
  );
}
