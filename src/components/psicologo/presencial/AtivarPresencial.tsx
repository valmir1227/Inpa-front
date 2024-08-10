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
  HStack,
  Tag,
  Badge,
  Button as ChakraButton,
  useDisclosure,
} from "@chakra-ui/react";

import { Input, Select } from "../../global/Select";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import { CheckboxInpa } from "../../global/Checkbox";
import { IDIOMAS } from "../../../utils/IDIOMAS";
import { darken } from "@chakra-ui/theme-tools";
import { FiX } from "react-icons/fi";
import Link from "next/link";
import { Button } from "../../global/Button";

export function AtivarPresencial({ isOpen, onToggle }: any) {
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
        align="center"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir="column"
        gap={6}
      >
        <Heading
          alignSelf="start"
          sx={{ b: { color: isOpen ? "azul" : "cinza" } }}
          fontSize={28}
        >
          Atendimento presencial <b>{isOpen ? "ativado" : "desativado"}</b>
        </Heading>
        <CheckboxInpa
          setState={() =>
            alert(
              "A função de atendimento presencial será disponibilizada em breve"
            )
          }
          // setState={onToggle}
          values={["Ativar atendimento presencial"]}
        />
      </Flex>
    </Flex>
  );
}
