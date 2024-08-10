import React, { useState } from "react";
import {
  Alert,
  AlertIcon,
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
import { useMyContext } from "contexts/Context";
import { usePatch } from "hooks/usePatch";
import { useForm } from "react-hook-form";

export function AlterarSenha() {
  const { user } = useMyContext();

  const [handlePatch, data, error, isFetching] = usePatch(
    `/v1/users/${user?.id}`
  );

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    handlePatch({ password: data.password });
  };

  const checkPass = () => {
    if (getValues("password2")?.length < 6) {
      setError("password2", {
        type: "custom",
        message: "A senha deve ter no mínimo 6 caracteres",
      });
      return;
    } else if (getValues("password") !== getValues("password2")) {
      setError("password2", {
        type: "custom",
        message: "Senhas não conferem",
      });
      return;
    } else clearErrors("password2");
  };

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
        as="form"
        onSubmit={handleSubmit(onSubmit)}
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
          <VStack maxW={450} w="full" spacing={0}>
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
                {...register("password", {
                  validate: (value) =>
                    value.length >= 6 ||
                    "A senha deve ter no mínimo 6 caracteres",
                })}
                isInvalid={!!errors.password}
                type={show ? "text" : "password"}
                fontSize={14}
                variant="outline"
                _placeholder={{ color: "cinza" }}
                placeholder="Nova senha"
                id="senha"
                w="full"
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
          <VStack mt={10} maxW={450} w="full" spacing={0}>
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
                {...register("password2", {
                  validate: (value) =>
                    value === getValues("password") || "Senhas não conferem",
                })}
                isInvalid={!!errors.password}
                onBlur={checkPass}
                type={show ? "text" : "password"}
                fontSize={14}
                variant="outline"
                _placeholder={{ color: "cinza" }}
                placeholder="Confirmar nova senha"
                id="novasenha"
                w="full"
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
        <Button
          type="submit"
          variant="ghost"
          borderRadius="full"
          alignSelf="start"
          px={8}
          mt={2}
          ml="auto"
          title="Alterar senha"
        />
        {error && (
          <Alert w="fit-content" ml="auto" mt={2} status="warning">
            <AlertIcon />
            {error?.response.statusText || "Erro"}
          </Alert>
        )}
        {data.status == 200 && (
          <Alert w="fit-content" ml="auto" mt={2} status="success">
            <AlertIcon />
            Senha atualizada
          </Alert>
        )}
        {Object.keys(errors).map((err) => (
          <Alert mt={2} key={err} status="warning">
            <AlertIcon />
            {errors[err]?.message}
          </Alert>
        ))}
      </Flex>
      {/* <Flex gap={4} p={8} w="full" maxW={1200} justify="end">
        <Link href="/paciente/minha-conta" passHref>
          <ChakraButton
            as="a"
            variant="ghost"
            borderRadius="full"
            bg="white"
            alignSelf="start"
            color="cinzaescuro"
            px={5}
          >
            Cancelar
          </ChakraButton>
        </Link>
      </Flex> */}
    </Flex>
  );
}
