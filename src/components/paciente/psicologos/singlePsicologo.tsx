/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Text,
  Button,
  Wrap,
  VStack,
  Box,
  Image,
  Modal,
  ModalContent,
  useDisclosure,
  ModalOverlay,
  ModalCloseButton,
  HStack,
  IconButton,
  Tooltip,
  Spinner,
  Fade,
} from "@chakra-ui/react";

import Link from "next/link";
import { CardPsicologo } from "./CardPsicologo";
import { CartPopup } from "./CartPopup";
import { CardPsicologoDefault } from "./CardPsicologoDefault";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { LoadingInpa } from "components/global/Loading";
import { toReal } from "utils/toReal";
import { AlertInpa } from "components/global/Alert";
import { motion } from "framer-motion";
import { useMyContext } from "contexts/Context";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { subWeeks, addWeeks, startOfDay } from "date-fns";
import useSWR from "swr";
import { api, fetcher } from "utils/api";

export function SinglePsicologos() {
  const router = useRouter();

  const { id } = router.query;
  const [initialDate, setInitialDate] = useState(startOfDay(new Date()));

  const {
    data: dataExpert,
    error: errorExpert,
    mutate: mutateExpert,
    isLoading: isFetchingExpert,
    isValidating,
  } = useSWR(
    `/v1/experts/${id}?date=${initialDate.toISOString()}`,
    fetcher
  ) as any;

  const formatedDataExpert = {
    //adaptação ao formato de dados ser diferente do getAllExperts, a maior diferença é o objeto expert
    ...dataExpert,
    ...dataExpert?.expert,
    services: dataExpert?.services.filter((service: any) => service.active),
    addresses: [...(dataExpert?.addressSer || [])],
    calendars: [...(dataExpert?.calendarSer || [])],
  };

  // useEffect(() => {
  //   if (id) getExpert();
  // }, [id, initialDate]);

  const today = new Date();
  const [aPartirDe, setAPartirDe] = useState(today);
  const { onOpen, isOpen, onClose } = useDisclosure();

  if (errorExpert?.code)
    return <AlertInpa status="warning" text="Expert não encontrado" />;
  if (isFetchingExpert !== false) return <LoadingInpa />;

  const MotionFlex = motion(Flex);

  return (
    <Flex
      as={MotionFlex}
      bg="#f5f5f5"
      flexDir="column"
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
        align="center"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir="column"
        gap={6}
        mt={4}
      >
        <HStack alignSelf="flex-end">
          <Fade in={isValidating}>
            <Spinner />
          </Fade>
          <Tooltip label="Semana anterior">
            <IconButton
              variant="ghost"
              aria-label="Semana anterior"
              icon={<ChevronLeftIcon />}
              fontSize={20}
              color="cinzaescuro"
              onClick={() => {
                setInitialDate(subWeeks(initialDate || new Date(), 1));
                mutateExpert();
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
                setInitialDate(addWeeks(initialDate || new Date(), 1));
                mutateExpert();
              }}
            />
          </Tooltip>
        </HStack>
        <CardPsicologo
          expert={formatedDataExpert}
          isFetchingExpert={isFetchingExpert}
          initialDate={initialDate}
        />
        {formatedDataExpert?.services?.length > 0 && (
          <VStack pt={8} align="start" maxW={1000} w="full">
            <Heading color="azul" fontSize={20}>
              Modalidades
            </Heading>
            <Box w="full" maxW={1000} overflow="auto">
              <Wrap
                fontWeight={500}
                fontSize={14}
                w={1000}
                borderWidth={1}
                borderRadius={20}
                p="1rem"
                justify="space-between"
              >
                <VStack justify="flex-end" align="start">
                  <Text>Online</Text>
                  <Text>Presencial</Text>
                </VStack>

                {formatedDataExpert?.services?.map((service: any) => {
                  const active = service.active;
                  const value = active
                    ? //se usar contexto, vai criar um loop por causa setCart
                      toReal(+service?.price)
                    : "Indisponível";
                  return (
                    <VStack key={service.id} align="center">
                      <Text>{service.name}</Text>
                      <Text
                        fontSize={14}
                        fontWeight={400}
                        color={active ? "cinza" : "cinzaclaro"}
                      >
                        {value}
                      </Text>
                      <Text fontSize={12} fontWeight={400} color="cinzaclaro">
                        Indisponível
                      </Text>
                    </VStack>
                  );
                })}
              </Wrap>
              {/* <Wrap
              fontWeight={500}
              fontSize={14}
              w={1000}
              borderWidth={1}
              borderRadius={20}
              p="1rem"
              justify="space-between"
            >
              <VStack justify="flex-end" align="start">
                <Text>Online</Text>
                <Text>Presencial</Text>
              </VStack>
              <VStack align="center">
                <Text>Psicoterapia Individual</Text>
                <Text fontSize={12} fontWeight={400} color="cinza">
                  R$ 100,00
                </Text>
                <Text fontSize={12} fontWeight={400} color="cinza">
                  R$ 200,00
                </Text>
              </VStack>
              <VStack align="center">
                <Text>Psicoterapia Individual</Text>
                <Text fontSize={12} fontWeight={400} color="cinza">
                  R$ 100,00
                </Text>
                <Text fontSize={12} fontWeight={400} color="cinza">
                  R$ 200,00
                </Text>
              </VStack>
              <VStack align="center">
                <Text>Psicoterapia Individual</Text>
                <Text fontSize={12} fontWeight={400} color="cinza">
                  R$ 100,00
                </Text>
                <Text fontSize={12} fontWeight={400} color="cinza">
                  R$ 200,00
                </Text>
              </VStack>
              <VStack align="center">
                <Text>Psicoterapia Individual</Text>
                <Text fontSize={12} fontWeight={400} color="cinza">
                  R$ 100,00
                </Text>
                <Text fontSize={12} fontWeight={400} color="cinza">
                  R$ 200,00
                </Text>
              </VStack>
            </Wrap> */}
            </Box>
          </VStack>
        )}
        <Wrap w="full">
          <VStack pt={8} align="start" minW="40%">
            <Heading color="azul" fontSize={20}>
              Especialidades
            </Heading>
            {formatedDataExpert?.specialties?.map((specialty: any) => (
              <Text key={specialty.id} fontWeight={500} fontSize={14}>
                {specialty.name}
              </Text>
            ))}
          </VStack>
          <VStack pt={8} align="start" minW="40%">
            <Heading color="azul" fontSize={20}>
              Abordagens
            </Heading>
            {formatedDataExpert?.approaches?.map((approach: any) => (
              <Text key={approach.id} fontWeight={500} fontSize={14}>
                {approach.name}
              </Text>
            ))}
          </VStack>
          {/* <VStack pt={8} align="start" w="full">
          <Heading color="azul" fontSize={20}>
            Consultório
          </Heading>
          <Text fontWeight={500} fontSize={14}>
            Endereço Rua A bloco B número 2.
          </Text>

          <Wrap p={4} justify="space-evenly" w="full" spacing={14}>
            {Array.from({ length: 4 }, (item) => (
              <Image
                w={185}
                borderRadius={14}
                src="https://www.psicologosberrini.com.br/wp-content/uploads/cropped-consultorio-psicologa-1-1024x576.jpg"
                alt="Foto do ambiente"
                onClick={onOpen}
                _hover={{
                  cursor: "pointer",
                  filter: "contrast(110%)",
                  transform: "scale(1.01)",
                  transition: "all 200ms",
                }}
              />
            ))}
          </Wrap>
          <Modal allowPinchZoom size="6xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />

            <ModalContent>
              <ModalCloseButton bg="white" color="cinza" />
              <Image
                src="https://www.psicologosberrini.com.br/wp-content/uploads/cropped-consultorio-psicologa-1-1024x576.jpg"
                alt="Foto do ambiente"
                onClick={onClose}
              />
            </ModalContent>
          </Modal>
        </VStack> */}
          <VStack align="start">
            <Heading color="azul" fontSize={20}>
              Formação
            </Heading>
            {formatedDataExpert?.courses?.map((course: any) => (
              <VStack key={course.id} pt={2} align="start" w="full">
                <Text fontWeight={500} fontSize={14}>
                  {course.course_name}
                </Text>
                <Text fontWeight={400} fontSize={14}>
                  {`${course.initials} - ${course.institution}`}
                </Text>
                <Text fontWeight={400} fontSize={14}>
                  {`${course.year} - ${course.type_of_degree} - ${course.modality} `}
                </Text>
              </VStack>
            ))}
          </VStack>
        </Wrap>
      </Flex>
      <Box p={8} w="full" maxW={1200}>
        <Link href="/" passHref>
          <Button
            as="a"
            variant="ghost"
            borderRadius="full"
            bg="white"
            alignSelf="start"
            color="cinzaescuro"
            px={5}
          >
            Voltar
          </Button>
        </Link>
      </Box>
    </Flex>
  );
}
