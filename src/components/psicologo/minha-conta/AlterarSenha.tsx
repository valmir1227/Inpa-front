import React, { useState } from "react";
import {
  Button as ChakraButton,
  Flex,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { Button } from "../../global/Button";

export function AlterarSenha() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
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
        gap={2}
      >
        <Heading fontSize={28}>Alterar senha</Heading>
        <Text color="cinza" fontSize={12}>
          Deixe em branco se não quiser alterar
        </Text>

        <Wrap mt={10} spacing={10} justify="space-between" w="full">
          <VStack maxW={530} w="full" spacing={0}>
            <FormLabel
              fontWeight={400}
              // color={labelColor}
              alignSelf="start"
              fontSize={14}
              htmlFor="senha"
            >
              Nova senha
            </FormLabel>
            <InputGroup mt={8}>
              <Input
                type={show ? "text" : "password"}
                fontSize={14}
                variant="outline"
                _placeholder={{ color: "cinza" }}
                placeholder="Nova senha"
                id="senha"
                w="full"
                borderRadius={16}
              />
              <InputRightElement>
                <ChakraButton
                  justifySelf="center"
                  variant="ghost"
                  size="sm"
                  onClick={handleClick}
                >
                  {show ? (
                    <AiOutlineEye color="#777" />
                  ) : (
                    <AiOutlineEyeInvisible color="#777" />
                  )}
                </ChakraButton>
              </InputRightElement>
            </InputGroup>
          </VStack>
          <VStack mt={10} maxW={530} w="full" spacing={0}>
            <FormLabel
              fontWeight={400}
              // color={labelColor}
              alignSelf="start"
              fontSize={14}
              htmlFor="novasenha"
            >
              Confirmar nova senha
            </FormLabel>
            <InputGroup mt={8}>
              <Input
                type={show ? "text" : "password"}
                fontSize={14}
                variant="outline"
                _placeholder={{ color: "cinza" }}
                placeholder="Confirmar nova senha"
                id="novasenha"
                w="full"
                borderRadius={16}
              />
              <InputRightElement>
                <ChakraButton
                  justifySelf="center"
                  variant="ghost"
                  size="sm"
                  onClick={handleClick}
                >
                  {show ? (
                    <AiOutlineEye color="#777" />
                  ) : (
                    <AiOutlineEyeInvisible color="#777" />
                  )}
                </ChakraButton>
              </InputRightElement>
            </InputGroup>
          </VStack>
        </Wrap>
      </Flex>
    </Flex>
  );
}
