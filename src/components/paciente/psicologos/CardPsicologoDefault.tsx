/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useState } from "react";
import {
  Flex,
  Heading,
  Text,
  Wrap,
  Avatar,
  VStack,
  HStack,
  Center,
  Breadcrumb,
  BreadcrumbItem,
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  useDisclosure,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { Agenda } from "./Agenda";

export function CardPsicologoDefault(props: any) {
  const today = new Date();

  return (
    <Flex
      w="full"
      justify="space-between"
      flexDir={{ base: "column", md: "row" }}
      gap={4}
    >
      <VStack pb={2}>
        <Flex
          flexDir={{ base: "column", lg: "row" }}
          gap={4}
          w="full"
          maxW={800}
        >
          <Avatar src={"https://i.pravatar.cc/150?img=5"} w={150} h={150} />
          <VStack spacing={0} align="start" flex={1}>
            <Heading fontSize={24}>Nome Sobrenome Fulano</Heading>
            <HStack spacing={8}>
              <Text color="amarelo" fontSize={14} fontWeight={500}>
                CRP - 01/12345
              </Text>
              <Text fontSize={12} fontWeight={500}>
                Homem, 25 anos
              </Text>
            </HStack>
            <HStack pt={3} spacing={2} color="cinza">
              <StarIcon boxSize="14px" />
              <StarIcon boxSize="14px" />
              <StarIcon boxSize="14px" />
              <StarIcon boxSize="14px" />
              <StarIcon boxSize="14px" />
              <Text fontSize={12} pl={4}>
                25 avaliações
              </Text>
            </HStack>
            <VStack spacing={4} pt={5} align="start" fontSize={12}>
              <Text>Idioma(s): Português, Inglês.</Text>
              <Text>Brasília, Distrito Federal.</Text>
            </VStack>
          </VStack>
          <VStack
            align={{ base: "start", lg: "inherit" }}
            textAlign={{ base: "left", lg: "right" }}
          >
            <Text
              fontSize={12}
              sx={{ b: { color: "azul", fontSize: 14, fontWeight: 500 } }}
            >
              Psicoterapia individual <br />
              <b>R$100</b>
            </Text>
            <Text
              fontSize={12}
              sx={{ b: { color: "azul", fontSize: 14, fontWeight: 500 } }}
            >
              Psicoterapia infantil <br />
              <b>R$100</b>
            </Text>
            <Text
              fontSize={12}
              sx={{ b: { color: "azul", fontSize: 14, fontWeight: 500 } }}
            >
              Psicoterapia familiar <br />
              <b>R$100</b>
            </Text>
            <Text
              fontSize={12}
              sx={{ b: { color: "azul", fontSize: 14, fontWeight: 500 } }}
            >
              Psicoterapia casais <br />
              <b>R$100</b>
            </Text>
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
            <Text>Crianças</Text>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Text>Adolecentes</Text>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Text>Adultos</Text>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Text>Idosos</Text>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Text>Casais</Text>
          </BreadcrumbItem>
        </Breadcrumb>
        <Wrap fontSize={12} pt={4} w="full">
          <Text borderRadius={14} borderWidth={1} bg="white" p={2}>
            Anorexia
          </Text>
          <Text borderRadius={14} borderWidth={1} bg="white" p={2}>
            Ansiedade
          </Text>
          <Text borderRadius={14} borderWidth={1} bg="white" p={2}>
            Bulimia
          </Text>
          <Text borderRadius={14} borderWidth={1} bg="white" p={2}>
            Depressão
          </Text>
          <Text borderRadius={14} borderWidth={1} bg="white" p={2}>
            Problemas no casamento
          </Text>
        </Wrap>
        <Text pt={2} fontSize={12}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna fringilla urna,
          porttitor rhoncus dolor purus non enim praesent elementum facilisis
          leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim
          diam,vel fringilla est ullamcorper eget nulla facilisi etiam dignissim
          diam ectetur adipiscing elit ut aliquam, purus sit amet lus sim
          dign...
        </Text>
      </VStack>
      <VStack w="full">
        <Agenda />
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
