import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  VStack,
  HStack,
  Center,
  Button,
  Wrap,
} from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";

export function Hero() {
  return (
    <Flex as="section" justify="center" align="center" w="100%">
      <Flex
        p="5rem 1rem"
        align="center"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir={{ base: "column", sm: "row" }}
        //flexDir="column"
      >
        <Heading
          color="blue.800"
          pt={100}
          _hover={{ color: darken("blue.800", 10) }}
        >
          Texto
        </Heading>
        <Heading pt={100}>Texto</Heading>
      </Flex>
    </Flex>
  );
}
