import React from "react";
import {
  Flex,
  Heading,
  Wrap,
  VStack,
  Avatar,
  Checkbox,
  FormLabel,
  HStack,
  Select as ChakraSelect,
} from "@chakra-ui/react";

import { Input } from "../../global/Select";
import ReactInputMask from "react-input-mask";
import { ESTADOS, ESTADOS_SIGLA } from "../../../utils/ESTADOS";
import { CheckboxInpa } from "../../global/Checkbox";

export function Endereco() {
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
        <Heading fontSize={28}>Endereço Residencial</Heading>

        <Wrap justify="space-around" spacing={5} w="full">
          <Input
            as={ReactInputMask}
            mask={"99.999-999"}
            maskChar="_"
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={200}
            variant="outline"
            title="CEP"
            id="cep"
          />
          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            variant="outline"
            maxW={900}
            title="Endereço"
            id="endereco"
          />
          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            variant="outline"
            maxW="210"
            title="Número"
            id="numero"
          />

          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={210}
            variant="outline"
            title="Complemento"
            id="complemento"
          />

          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={210}
            variant="outline"
            title="Bairro"
            id="bairro"
          />
          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={210}
            variant="outline"
            title="Cidade"
            id="cidade"
          />
          <VStack maxW={{ base: "full", sm: 210 }} w="full">
            <FormLabel
              fontWeight={400}
              color="cinzaescuro"
              alignSelf="start"
              fontSize={14}
            >
              Estado
            </FormLabel>
            <ChakraSelect
              borderRadius={14}
              placeholder="UF"
              color="cinza"
              variant="outline"
              _focus={{ bg: "white" }}
              fontSize={14}
              id="estado"
            >
              {ESTADOS_SIGLA.map((item: any) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </ChakraSelect>
          </VStack>
        </Wrap>
      </Flex>
    </Flex>
  );
}
