import React, { useEffect, useState } from "react";
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
  Checkbox,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  useDisclosure,
} from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { Input } from "./global/Input";
import { usePost } from "hooks/usePost";
import { useForm } from "react-hook-form";
import Router, { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import { getCookie, setCookie } from "cookies-next";
import { ModalRecuperarSenha } from "./ModalRecuperarSenha";
import { AlertInpaCall } from "./global/Alert";

export function Login({ onOpenModalExcluir }: any) {
  const { setUser } = useMyContext();
  const router = useRouter();
  const [patient, setPatient] = useState(true);
  const loginType = patient ? "paciente" : "psicologo";
  const patientRedirect = (
    router.query?.redirect ? `/?redirect=${router.query?.redirect}` : "/"
  ) as any;

  const redirect = patient ? patientRedirect : `${loginType}/sessoes`;
  const token = getCookie("inpatoken");
  // const permissions = (getCookie("inpa") && getCookie("inpa")) || ({} as any);

  // const handlePatient = () => setPatient(!patient);

  const [handlePost, data, error, isFetching] = usePost("/v2/auth/login");
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (data.status === 200) {
      // cookies.set("inpatoken", data.data.token, { path: "/" });
      setCookie("inpatoken", data.data.token, { path: "/", secure: true });
    }
  }, [data]);

  const [dataGetMe, errorGetMe, isFetchingGetMe, getMe] =
    useFetch("/v1/users/me");

  useEffect(() => {
    if (data.data?.token) {
      getMe();
    }
  }, [data]);

  useEffect(() => {
    if (data.status === 200) {
      if (dataGetMe?.name && token) {
        setUser(dataGetMe);
        setCookie("inpa", JSON.stringify(dataGetMe?.permissions), {
          path: "/",
          secure: true,
        });
        window.open(redirect, "_self");
      }
    }
  }, [dataGetMe, data]);

  /* useEffect(() => {
    Object.values(permissions).length && window.open(redirect, "_self");
    // Object.values(permissions).length && router.push(redirect);
  }, [permissions]); */

  /* useEffect(() => {
    if (data.status === 200) getMe();
  }, [data]); */

  const onSubmit = (data: any) => {
    handlePost(data);
  };

  useEffect(() => {
    if (error) {
      setError("login", {
        type: "custom",
        message:
          error.response?.data?.msg?.["pt-BR"].message ||
          error.response?.data?.msg?.["pt-BR"] ||
          "Erro no login",
      });
    } else clearErrors("login");
  }, [error]);

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      justify="center"
      align="center"
      w="100%"
    >
      <Flex
        p="5rem 1rem"
        align="center"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir="column"
      >
        <Link href="/" passHref>
          <a>
            <Image src="/logo.png" alt="Logo Inpa" width={220} height={120} />
          </a>
        </Link>
        <Heading
          textAlign="center"
          pt={20}
          fontSize={16}
          sx={{ b: { color: "azul" } }}
          color="cinzaescuro"
        >
          Comece agora sua trajetória com a terapia online{" "}
          <b>de onde estiver.</b>
        </Heading>
        {/* <Button
          fontWeight={500}
          mt={6}
          variant="outline"
          borderColor="azul"
          bg={patient ? "white" : "azul"}
          color={patient ? "cinza" : "white"}
          onClick={handlePatient}
          colorScheme="none"
        >
          {patient ? "Entrar como paciente" : "Entrar como psicólogo"}
        </Button> */}
        <Flex align="center" flexDir="column" my={10} w="full" maxW="350">
          <Input
            id="login"
            register={{
              ...register("login", {
                required: "Informe um usuário",
                setValueAs: (value) => value.trim(),
              }),
            }}
            errors={errors}
            placeholder={`email@${loginType}.com.br`}
          />

          <Input
            id="password"
            register={{
              ...register("password", { required: "Informe sua senha" }),
            }}
            errors={errors}
            password
            placeholder="******"
          />

          <HStack my={4} alignSelf="start">
            <Checkbox
              colorScheme="yellow"
              _checked={{
                span: { borderColor: "azul", backgroundColor: "azul" },
              }}
            >
              <Text bg="white" fontSize={14} color="cinza">
                Manter-me conectado
              </Text>
            </Checkbox>
          </HStack>
          {Object.keys(errors).map((err) => (
            <Alert key={err} status="warning">
              <AlertIcon />
              {errors[err]?.message}
            </Alert>
          ))}
          <AlertInpaCall
            error={{
              validate: error?.code === "ERR_NETWORK",
              text: "Servidor indisponível",
            }}
          />
          <Button
            type="submit"
            bgGradient="linear(to-tr, amarelogradient1, amarelogradient2)"
            _hover={{
              bgGradient: "linear(to-tr, amarelogradient2, amarelogradient1)",
            }}
            fontWeight={400}
            borderRadius="full"
            // bg="amarelo"
            w="fit-content"
            color="white"
            py={4}
            px={10}
            mt={8}
            isLoading={isFetching || isFetchingGetMe}
          >
            Entrar
          </Button>
          <Button
            onClick={onOpenModalExcluir}
            mt={6}
            fontSize={12}
            color="azul"
            variant="ghost"
          >
            Esqueci minha senha
          </Button>
          <Link href="/cadastro" passHref>
            <Heading
              as="a"
              mt={8}
              fontSize={20}
              color="cinzaescuro"
              sx={{ b: { color: "amarelo" } }}
              textAlign="center"
            >
              Ainda não possui uma conta? <b>Criar conta</b>
            </Heading>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
