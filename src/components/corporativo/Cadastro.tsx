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
  Select,
  Tooltip,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  InputLeftElement,
  Spinner,
  useBoolean,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import Image from "next/image";
import { BsCalendar } from "react-icons/bs";
import Link from "next/link";
import { Input } from "../global/Input";
import DatePicker from "react-datepicker";
import InputMask from "react-input-mask";
import ptBR from "date-fns/locale/pt-BR";
import { GENEROS } from "../../utils/GENEROS";
import { useForm } from "react-hook-form";
import { usePost } from "../../hooks/usePost";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { ButtonLink } from "../global/Button";
import { useMyContext } from "contexts/Context";

export function Cadastro({ preRegisterData, setStep }: any) {
  const {
    handlePostPreRegister,
    dataPreRegister,
    errorPreRegister,
    creatingAccount,
  } = preRegisterData;

  const { user } = useMyContext();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    const [area_code, phone] = data.phone?.split(")");
    delete data.password2;
    // console.log(
    handlePostPreRegister({
      ...data,
      countryCode: "55",
      areaCode: area_code.replace("(", ""),
      phone: phone.replace("-", ""),
      type: "patient",
    });
  };

  useEffect(() => {
    if (dataPreRegister.status === 200) setStep("Usuarios");
  }, [dataPreRegister]);

  const checkPass = () => {
    if (getValues("password2")?.length < 6) {
      setError("password2", {
        type: "custom",
        message: "A senha deve ter no mínimo 6 caracteres",
      });
      return false;
    } else if (getValues("password") !== getValues("password2")) {
      setError("password2", {
        type: "custom",
        message: "Senhas não conferem",
      });
      return false;
    } else {
      clearErrors("password2");
      return true;
    }
  };

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
        <Wrap
          justify="space-between"
          align="center"
          my={8}
          w="full"
          maxW={920}
          spacing={8}
        >
          <Input
            id="name"
            register={{ ...register("name", { required: "Informe seu nome" }) }}
            errors={errors}
            maxW={440}
            placeholder="Nome"
          />

          <Input
            as={InputMask}
            mask={"(99) 99999-9999"}
            maskChar={null}
            id="phone"
            register={{
              ...register("phone", {
                required: "Informe seu número de celular",
                setValueAs: (v) => {
                  return v.replace(/\s+/g, "");
                },
              }),
            }}
            errors={errors}
            maxW={440}
            placeholder="Celular"
          />
          <Input
            id="email"
            register={{
              ...register("email", { required: "Informe seu e-mail" }),
            }}
            errors={errors}
            maxW={440}
            placeholder="Email"
            type="email"
          />
          <Input
            id="doc"
            register={{ ...register("doc", { required: "Informe seu CPF" }) }}
            errors={errors}
            as={InputMask}
            mask={"999.999.999-99"}
            maskChar={null}
            maxW={440}
            placeholder="CPF / Passaporte"
          />

          <Input
            as={InputMask}
            mask="99/99/9999"
            maskChar={null}
            id="birthday"
            register={{
              ...register("birthday", {
                setValueAs: (v) => {
                  if (!v) return false;
                  const ymd = v.split("/");
                  const formatted = `${ymd[2]}-${ymd[1]}-${ymd[0]}`;
                  return formatted || "";
                },
                required: "Informe a data de nascimento",
                minLength: {
                  value: 10,
                  message: "Data inválida, digite no formato dd/mm/aaaa",
                },
              }),
            }}
            errors={errors}
            placeholder="Data de nascimento"
            // as={DatePicker}
            // selected={dataDeNascimento}
            // onChange={(date: any) => setDataDeNascimento(date)}
            // locale={ptBR}
            // dateFormat="dd/MM/yyyy"
            icon={<BsCalendar color="#777" />}
            maxW={280}
          />
          <Input
            id="creditLimit"
            register={{
              ...register("creditLimit", {
                min: { value: 1, message: "Digite um número entre 1 e 1000" },
                max: {
                  value: 1000,
                  message: "Digite um número entre 1 e 1000",
                },
              }),
            }}
            errors={errors}
            maxW={280}
            placeholder="Limite de créditos por sessão"
          />
          <VStack maxW={280} w="full" pt={2}>
            <Text alignSelf="start">Gênero</Text>
            <Select
              borderRadius={14}
              borderColor="cinzaescuro"
              placeholder="Selecione uma opção"
              {...register("gender", { required: "Selecione seu gênero" })}
              isInvalid={!!errors.gender}
            >
              {GENEROS.map((item: any) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </VStack>
          <Input
            id="password"
            register={{
              ...register("password", {
                minLength: {
                  value: 6,
                  message: "A senha deve ter no mínimo 6 caracteres",
                },
              }),
            }}
            errors={errors}
            password
            maxW={440}
            placeholder="Senha"
          />
          <Input
            id="password2"
            register={{
              ...register("password2", {
                validate: (value: any) => checkPass() || "Senhas não conferem",
              }),
            }}
            errors={errors}
            password
            // onBlur={checkPass}
            maxW={440}
            placeholder="Confirme sua senha"
          />
        </Wrap>

        <Flex align="center" flexDir="column">
          {dataPreRegister.status === 200 && (
            <Alert
              flexDir="column"
              gap={4}
              justifyContent="space-between"
              mt={4}
              status="success"
              p={6}
            >
              <AlertIcon color="azul" boxSize={10} />
              Conta criada com sucesso
              <ButtonLink
                color="azul"
                href="/login"
                size="sm"
                ml="auto"
                title="Entrar"
              />
            </Alert>
          )}

          <Button
            type="submit"
            bgGradient="linear(to-tr, azulgradient1, azulgradient2)"
            _hover={{
              bgGradient: "linear(to-tr, azulgradient2, azulgradient1)",
            }}
            fontWeight={400}
            borderRadius="full"
            // bg="amarelo"
            w="fit-content"
            color="white"
            py={5}
            px={10}
            mt={10}
            isLoading={creatingAccount}
          >
            Cadastrar
          </Button>
          <Button
            mt={5}
            color="cinza"
            variant="ghost"
            onClick={() => setStep("Usuarios")}
          >
            Cancelar
          </Button>
          {errorPreRegister && (
            <Alert mt={2} status="warning">
              <AlertIcon />
              {errorPreRegister.response.data?.message || "Erro"}
            </Alert>
          )}

          {Object.keys(errors).map((err) => (
            <Alert mt={2} key={err} status="warning">
              <AlertIcon />
              {errors[err]?.message}
            </Alert>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
