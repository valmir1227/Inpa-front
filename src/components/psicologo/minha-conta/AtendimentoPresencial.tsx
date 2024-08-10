import React, { useState } from "react";
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
} from "@chakra-ui/react";

import { Input } from "../../global/Select";
import { EditIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import { CheckboxInpa } from "../../global/Checkbox";
import { Button, ButtonLink } from "../../global/Button";

export function AtendimentoPresencial() {
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
        gap={6}
      >
        <Heading fontSize={28}>Atendimento Presencial</Heading>
        <Text alignSelf="center" fontWeight={500}>
          Você também poderá atender presencialmente em seu consultório
          particular.
        </Text>
        <ButtonLink
          href="/psicologo/presencial"
          color="azul"
          title="Gerenciar"
          borderRadius={10}
          alignSelf="center"
          fontWeight={400}
        />
      </Flex>
    </Flex>
  );
}
