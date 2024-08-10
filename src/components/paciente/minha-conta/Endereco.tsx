import { useEffect, useState } from "react";
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
  Alert,
  AlertIcon,
  Text,
  Spinner,
} from "@chakra-ui/react";

import { Input } from "../../global/Select";
import ReactInputMask from "react-input-mask";
import { ESTADOS, ESTADOS_SIGLA } from "../../../utils/ESTADOS";
import { useMyContext } from "contexts/Context";
import { useForm } from "react-hook-form";
import { usePatch } from "hooks/usePatch";
import { Button } from "components/global/Button";
import { usePost } from "hooks/usePost";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { useFetchUser } from "hooks/useFetchUser";

export function Endereco() {
  const { user } = useMyContext();
  const { mutate: mutateUser } = useFetchUser();

  const [handlePost, data, error, isFetching] = usePost("/v1/addresses");
  const [dataGet, errorGet, isFetchingGet, get] = useFetch("/v1/addresses");
  const [firstAddress] = dataGet || [];

  const [handlePatch, dataPatch, errorPatch, isPatching] = usePatch(
    `/v1/addresses/${firstAddress?.id}`
  );
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    if (firstAddress) handlePatch({ ...data, billing: true });
    else handlePost({ ...data, billing: true });
  };
  const router = useRouter() as any;
  useEffect(() => {
    get();
    if (data.status === 200 || dataPatch.status === 200) {
      mutateUser();
      if (router.query)
        router.push({
          pathname: router.query.redirect,
          query: router.query?.tab ? { tab: router.query.tab } : null,
        });
    }
  }, [data, dataPatch]);

  useEffect(() => {
    if (firstAddress) {
      setValue("city", firstAddress.city);
      setValue("complement", firstAddress.complement);
      setValue("country", firstAddress.country);
      setValue("neighborhood", firstAddress.neighborhood);
      setValue("number", firstAddress.number);
      setValue("reference", firstAddress.reference);
      setValue("state", firstAddress.state);
      setValue("street", firstAddress.street);
      setValue("title", firstAddress.title);
      setValue("zipCode", firstAddress.zip_code);
    }
  }, [dataGet]);

  if (isFetchingGet) return <Spinner />;

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
        gap={6}
      >
        <Heading fontSize={28}>Endereços</Heading>

        <Wrap justify="space-around" spacing={5} w="full">
          <Input
            id="zipCode"
            errors={errors}
            register={{
              ...register("zipCode", { required: "Informe seu CEP" }),
            }}
            as={ReactInputMask}
            mask="99.999-999"
            maskChar="_"
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={200}
            borderColor="cinzaclaro"
            borderWidth={1}
            bg="white"
            title="CEP"
            defaultValue={firstAddress?.zip_code}
          />
          <Input
            id="street"
            errors={errors}
            register={{
              ...register("street", { required: "Informe seu endereço" }),
            }}
            borderRadius={14}
            labelColor="cinzaescuro"
            borderColor="cinzaclaro"
            maxW={900}
            borderWidth={1}
            bg="white"
            title="Endereço"
            defaultValue={firstAddress?.street}
          />
          <Input
            id="number"
            errors={errors}
            register={{
              ...register("number", { required: "Informe um número" }),
            }}
            borderRadius={14}
            labelColor="cinzaescuro"
            borderColor="cinzaclaro"
            borderWidth={1}
            maxW="210"
            bg="white"
            title="Número"
          />

          <Input
            id="complement"
            errors={errors}
            register={{
              ...register("complement"),
            }}
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={210}
            borderColor="cinzaclaro"
            borderWidth={1}
            bg="white"
            title="Complemento"
          />

          <Input
            id="neighborhood"
            errors={errors}
            register={{
              ...register("neighborhood", { required: "Informe seu bairro" }),
            }}
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={210}
            borderColor="cinzaclaro"
            borderWidth={1}
            bg="white"
            title="Bairro"
          />
          <Input
            id="city"
            errors={errors}
            register={{
              ...register("city", { required: "Informe sua cidade" }),
            }}
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={210}
            borderColor="cinzaclaro"
            borderWidth={1}
            bg="white"
            title="Cidade"
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
              id="state"
              isInvalid={!!errors.state}
              {...register("state", { required: "Selecione um estado" })}
              borderRadius={14}
              placeholder="UF"
              color="cinza"
              variant="filled"
              _focus={{ bg: "white" }}
              fontSize={14}
              borderWidth={1}
              borderColor="cinzaclaro"
              bg="white"
            >
              {ESTADOS_SIGLA.map((item: any) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </ChakraSelect>
          </VStack>
          <Input
            id="title"
            errors={errors}
            register={{
              ...register("title"),
            }}
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW="48%"
            borderColor="cinzaclaro"
            borderWidth={1}
            bg="white"
            title="Título"
            placeholder="Ex: Casa, trabalho, outro"
          />
          <Input
            id="reference"
            errors={errors}
            register={{
              ...register("reference"),
            }}
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW="48%"
            borderColor="cinzaclaro"
            borderWidth={1}
            bg="white"
            title="Referência"
            placeholder="Ex: Perto de, em frente a"
          />
        </Wrap>
        <Button
          isLoading={isFetching || isPatching}
          ml="auto"
          title={firstAddress ? "Atualizar endereço" : "Cadastrar endereço"}
          type="submit"
        />
        {(error || errorPatch) && (
          <Alert w="fit-content" ml="auto" mt={2} status="warning">
            <AlertIcon />
            {error?.response.statusText ||
              errorPatch?.response.statusText ||
              "Erro"}
          </Alert>
        )}
        {data.status == 200 && (
          <Alert w="fit-content" ml="auto" mt={2} status="success">
            <AlertIcon />
            Endereço adicionado
          </Alert>
        )}
        {dataPatch.status == 200 && (
          <Alert w="fit-content" ml="auto" mt={2} status="success">
            <AlertIcon />
            Endereço atualizado
          </Alert>
        )}
        {Object.keys(errors).map((err) => (
          <Alert mt={2} key={err} status="warning">
            <AlertIcon />
            {errors[err]?.message}
          </Alert>
        ))}
        {/*  <Wrap>
          {dataGet?.length &&
            dataGet?.map((item: any) => (
              <Wrap
                key={item.id}
                // justify="space-between"
                align="center"
                borderRadius={20}
                bg="bg"
                p="1rem"
                w="full"
                fontSize={12}
              >
                <Text fontWeight="bold">{item.title}:</Text>
                <Text>{item.zip_code}</Text>
                <Text>{item.street}</Text>
                <Text>Nº {item.number}</Text>
                <Text>/ {item.complement}</Text>
                <Text> | {item.neighborhood}</Text>
                <Text>({item.reference})</Text>
                <Text>{item.city}</Text>
                <Text>/ {item.state}</Text>
                <Text>| {item.country}</Text>
              </Wrap>
            ))}
          {firstAddress && (
            <Wrap
              bg="azul"
              // justify="space-between"
              align="center"
              borderRadius={20}
              p="1rem"
              w="full"
              fontSize={12}
            >
              <Text fontWeight="bold">{firstAddress.title}:</Text>
              <Text>{firstAddress.zip_code}</Text>
              <Text>{firstAddress.street}</Text>
              <Text>Nº {firstAddress.number}</Text>
              <Text>/ {firstAddress.complement}</Text>
              <Text> | {firstAddress.neighborhood}</Text>
              <Text>({firstAddress.reference})</Text>
              <Text>{firstAddress.city}</Text>
              <Text>/ {firstAddress.state}</Text>
              <Text>| {firstAddress.country}</Text>
            </Wrap>
          )}
        </Wrap> */}
      </Flex>
    </Flex>
  );
}
