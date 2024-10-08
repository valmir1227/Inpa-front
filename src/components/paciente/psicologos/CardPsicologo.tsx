/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Text,
  Wrap,
  Avatar,
  VStack,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  Skeleton,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { Agenda } from "./Agenda";
import { toReal } from "utils/toReal";
import { useMyContext } from "contexts/Context";

function renderStars(avgStars: number) {
  const fullStars = 5;
  const filledStars = Math.round(avgStars);
  const stars = Array.from({ length: fullStars }, (_, index) => (
    <StarIcon
      key={index}
      boxSize="14px"
      color={index < filledStars ? "amarelo" : "gray.300"}
    />
  ));
  return stars;
}

interface ServiceProps {
  id: number;
  user_id: number;
  category: string | null;
  council: number;
  name: string;
  price: string;
  active: "string" | boolean;
  created_at: string;
  updated_at: string;
  credit_value: number;
  credit_discount: number;
}

export function CardPsicologo({ expert, isFetchingExpert, initialDate }: any) {
  const { user } = useMyContext();
  const avgStars = expert?.avgStars || 0;
  const gender = expert?.gender ? expert?.gender : "";
  const age = expert?.age ? expert?.age + " anos" : "";
  const comma = expert?.age && expert?.gender ? "," : "";
  const genderAndAge = `${gender}${comma} ${age}`;
  const reviewsCount = expert?.reviewsCount;
  const reviewText =
    reviewsCount === 0 || reviewsCount === null
      ? "0 Avaliações"
      : reviewsCount === 1
      ? "1 Avaliação"
      : `${reviewsCount} Avaliações`;
  const [address1] = expert?.addresses || [];
  const { city, state } = address1 || {};

  const [selectedService, setSelectedService] = useState({} as ServiceProps);

  const servicesSorted = expert?.services?.sort((a: any, b: any) => {
    if (a.name === "Psicoterapia Individual") return -1;
    return 0;
  });

  useEffect(() => {
    if (!selectedService.id) setSelectedService(servicesSorted[0]);
  }, [expert]);

  return (
    <Flex
      w="full"
      justify="space-between"
      flexDir={{ base: "column", md: "row" }}
      gap={4}
    >
      <VStack flex={1} pb={2}>
        <Flex
          flexDir={{ base: "column", lg: "row" }}
          gap={4}
          w="full"
          maxW={800}
        >
          <Avatar
            ignoreFallback
            src={expert?.avatar && expert?.avatar}
            w={150}
            h={150}
          />
          <VStack spacing={0} align="start" flex={1}>
            <Skeleton isLoaded={!isFetchingExpert}>
              <Heading fontSize={24}>{expert?.name}</Heading>
            </Skeleton>
            <HStack spacing={8}>
              {expert?.councils?.map((council: any) => (
                <Text
                  key={council.number}
                  color="amarelo"
                  fontSize={14}
                  fontWeight={500}
                >
                  {council?.council} - {council?.number}
                </Text>
              ))}
              <Text fontSize={12} fontWeight={500}>
                {genderAndAge}
              </Text>
            </HStack>
            <HStack pt={3} spacing={2} color="amarelo">
              {renderStars(avgStars)}
              <Text fontSize={12} pl={4}>
                {reviewText}
              </Text>
            </HStack>
            <VStack spacing={4} pt={5} align="start" fontSize={12}>
              {expert?.languages && (
                <Text>Idioma(s): {expert?.languages?.join(", ")}</Text>
              )}
              <Text>
                {city}, {state}.
              </Text>
            </VStack>
          </VStack>
          <VStack
            align={{ base: "start", lg: "inherit" }}
            textAlign={{ base: "left", lg: "right" }}
            spacing={1}
          >
            {servicesSorted
              ?.filter((item: any) => item.active)

              .map((service: any) => (
                <Text
                  p={1}
                  borderWidth={1}
                  borderColor={
                    service.id === selectedService.id ? "cinzaclaro" : "white"
                  }
                  fontWeight={
                    service.id === selectedService.id ? "bold" : "inherit"
                  }
                  _hover={{
                    border: "1px solid",
                    borderColor: "azul",
                    shadow: "md",
                    cursor: "pointer",
                  }}
                  key={service.id}
                  fontSize={12}
                  onClick={() => setSelectedService(service)}
                  sx={{ b: { color: "azul", fontSize: 14, fontWeight: 500 } }}
                >
                  {service.name} <br />
                  <b>{toReal(service, user)}</b>
                </Text>
              ))}
          </VStack>
        </Flex>
        <Breadcrumb
          pt={4}
          w="full"
          textAlign="center"
          fontSize={12}
          separator={
            <Text fontSize={20} color="azul">
              •
            </Text>
          }
        >
          <BreadcrumbItem>
            <Text fontWeight={700}>Atendimento:</Text>
          </BreadcrumbItem>
          {expert?.targets?.map((target: any) => (
            <BreadcrumbItem key={target.id}>
              <Text>{target.name}</Text>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
        <Wrap fontSize={13} pt={4} w="full">
          {expert?.tags?.map((tag: any) => (
            <Text
              key={tag.id}
              borderRadius={14}
              borderWidth={1}
              bg="white"
              p={2}
            >
              {tag.name}
            </Text>
          ))}
        </Wrap>
        <Text whiteSpace="pre-wrap" w="full" pt={2} fontSize={14}>
          {expert?.about}
        </Text>
      </VStack>
      <VStack>
        <Agenda
          expert={expert}
          selectedService={selectedService}
          initialDate={initialDate}
        />
        <FormControl
          alignSelf={{ base: "center", md: "flex-end" }}
          w="fit-content"
          pt={2}
        >
          <FormLabel fontWeight={400} alignSelf="start" fontSize={12}>
            Visualizando os horários como
          </FormLabel>
          <ChakraSelect
            disabled
            borderRadius={6}
            variant="filled"
            color="cinzaclaro"
            bg="azul"
            _focus={{ bg: "azul" }}
            _hover={{ bg: "azul" }}
            fontSize={14}
            boxShadow="0 10px 10px 2px #00000033"
            colorScheme="none"
          >
            <option value="sp">America/Sao_paulo</option>
          </ChakraSelect>
        </FormControl>
      </VStack>
    </Flex>
  );
}
