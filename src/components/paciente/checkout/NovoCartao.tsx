/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useEffect } from "react";
import {
  Checkbox,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Text,
  VStack,
  Wrap,
  Select as ChakraSelect,
  Alert,
  AlertIcon,
  Tag,
} from "@chakra-ui/react";

import { Button } from "../../global/Button";
import { Input, Select } from "../../global/Select";
import ReactInputMask from "react-input-mask";
import { ESTADOS, ESTADOS_SIGLA } from "../../../utils/ESTADOS";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMyContext } from "contexts/Context";
import { usePost } from "hooks/usePost";
import { AlertInpa } from "components/global/Alert";
import { useFetch } from "hooks/useFetch";
import { LoadingInpa } from "components/global/Loading";

export function NovoCartao({
  setEtapaAgendamento,
  getCards,
  addressData,
}: any) {
  const { user } = useMyContext();

  const { dataAddress, isFetchingAddress, getAddress } = addressData;

  const [
    handlePostAddress,
    dataPostAddress,
    errorPostAddress,
    isPostingAddress,
  ] = usePost("v1/addresses");

  useEffect(() => {
    // getAddress();
  }, []);

  const [firstAddress] = dataAddress || [];

  const [handlePostCard, dataCard, errorCard, isPostingCard] =
    usePost("/v1/pagarme/card");

  async function handlePost(data: any) {
    const response = await axios.post("/api/cartao", data);

    if (response.data.id) return response.data.id;
    else return "erro";
  }

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  function sameBillingAddress(checked: boolean) {
    if (checked) {
      setValue("address", firstAddress?.street);
      setValue("address_number", firstAddress?.number);
      setValue("line_2", firstAddress?.complement);
      setValue("address_neighborhood", firstAddress?.neighborhood);
      setValue("city", firstAddress?.city);
      setValue("state", firstAddress?.state);
      setValue("zip_code", firstAddress?.zip_code, { shouldValidate: true });
      setValue("title", firstAddress?.title);
      setValue("reference", firstAddress?.reference);
    }
  }

  const onSubmit = async (data: any) => {
    const [exp_month, exp_year] = data.exp.split("/");
    const formattedData = {
      card: {
        billing_address: {
          line_1: `${data.address_number}, ${data.address}, ${data.address_neighborhood}`,
          line_2: data.line_2,
          zip_code: data.zip_code,
          city: data.city,
          state: data.state,
          country: "BR",
        },
        number: data.number,
        holder_name: data.holder_name,
        holder_document: data.holder_document.match(/\d/g).join(""),
        exp_month: +exp_month,
        exp_year: +exp_year,
        cvv: data.cvv,
      },
      type: "card",
    };

    //disparar apenas se o usuario nao tiver endereço cadastrado
    const formatedAddressData = {
      title: data.title,
      zipCode: data.zip_code,
      street: data.address,
      number: data.address_number,
      complement: data.line_2,
      reference: data.reference,
      neighborhood: data.address_neighborhood,
      city: data.city,
      state: data.state,
      country: "BR",
      billing: true,
    };

    try {
      const token = await handlePost(formattedData);

      if (token)
        await handlePostCard({
          customerId: user?.pagarme_id,
          token,
          billingAddress: formattedData.card.billing_address,
        });
      if (!firstAddress || !errorCard)
        await handlePostAddress(
          // console.log(
          // "submit",
          formatedAddressData
        );
    } catch (err) {
      alert("Cartão inválido, verifique os dados");
    }
  };

  useEffect(() => {
    if (dataCard.status === 200) {
      getCards();
      getAddress();
      setEtapaAgendamento("pagamento");
    }
  }, [dataCard]);

  if (isFetchingAddress) return <LoadingInpa />;

  return (
    <Flex
      bg="#f5f5f5"
      flexDir="column"
      justify="center"
      align="center"
      w="100%"
      gap={4}
      py={4}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
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
        gap={8}
        mt={4}
      >
        <Heading fontSize={28}>Cartão de crédito</Heading>
        <Wrap
          justify="space-between"
          w="full"
          flexDir={{ base: "column", md: "row" }}
          gap={5}
        >
          <Input
            as={ReactInputMask}
            mask={"9999 9999 9999 9999"}
            maskChar={null}
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={200}
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="Número do cartão"
            id="number"
            errors={errors}
            register={{
              ...register("number", {
                required: "Número do cartão",
                minLength: {
                  value: 16,
                  message: "Número inválido",
                },
                setValueAs: (v) => {
                  return v.replace(/\s+/g, "");
                },
              }),
            }}
          />
          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={300}
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="Nome do titular"
            id="holder_name"
            errors={errors}
            register={{
              ...register("holder_name", { required: "Nome" }),
            }}
          />
          <Input
            as={ReactInputMask}
            mask={"99/99"}
            maskChar="_"
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW="80px"
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="MM/AA"
            id="exp"
            errors={errors}
            register={{
              ...register("exp", { required: "Vencimento" }),
            }}
          />
          <Input
            as={ReactInputMask}
            mask={"999"}
            maskChar="_"
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW="80px"
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="Cód."
            id="cvv"
            errors={errors}
            register={{
              ...register("cvv", { required: "Código do cartão" }),
            }}
          />
          <Input
            as={ReactInputMask}
            mask={"999.999.999-99"}
            maskChar={null}
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={200}
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="CPF do titular"
            id="holder_document"
            errors={errors}
            register={{
              ...register("holder_document", { required: "CPF do titular" }),
            }}
          />
          {/* <VStack spacing={2} pt={2} align="start">
            <FormLabel
              htmlFor="salvar"
              bg="white"
              fontSize={14}
              color="cinzaescuro"
            >
              Salvar cartão
            </FormLabel>
            <Checkbox
              id="salvar"
              colorScheme="yellow"
              _checked={{
                span: { borderColor: "azul", backgroundColor: "azul" },
              }}
            ></Checkbox>
          </VStack> */}
        </Wrap>
      </Flex>
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
        gap={8}
        mt={4}
      >
        <Wrap gap={6} w="full" justify="space-between">
          <Heading fontSize={28}>Endereço de cobrança</Heading>
          {firstAddress && (
            <HStack>
              <Checkbox
                id="mesmoendereco"
                colorScheme="yellow"
                _checked={{
                  span: { borderColor: "azul", backgroundColor: "azul" },
                }}
                onChange={(e) => sameBillingAddress(e.target.checked)}
              />
              <FormLabel htmlFor="mesmoendereco" fontWeight={500}>
                Usar o mesmo endereço do cadastro
              </FormLabel>
            </HStack>
          )}
        </Wrap>

        <Wrap justify="space-around" spacing={5} w="full">
          <Input
            as={ReactInputMask}
            mask={"99.999-999"}
            maskChar={null}
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={200}
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="CEP"
            id="zip_code"
            errors={errors}
            register={{
              ...register("zip_code", { required: "CEP" }),
            }}
          />
          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            borderColor="cinza"
            maxW={900}
            borderWidth={1}
            bg="white"
            title="Endereço"
            id="address"
            errors={errors}
            register={{
              ...register("address", { required: "Endereço" }),
            }}
          />
          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            borderColor="cinza"
            borderWidth={1}
            maxW={210}
            bg="white"
            title="Número"
            id="address_number"
            errors={errors}
            register={{
              ...register("address_number", { required: "Número" }),
            }}
          />

          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={210}
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="Complemento"
            id="line_2"
            errors={errors}
            register={{
              ...register("line_2"),
            }}
          />

          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={210}
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="Bairro"
            id="address_neighborhood"
            errors={errors}
            register={{
              ...register("address_neighborhood", { required: "Bairro" }),
            }}
          />
          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={210}
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="Cidade"
            id="city"
            errors={errors}
            register={{
              ...register("city", { required: "Cidade" }),
            }}
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
              variant="filled"
              _focus={{ bg: "white" }}
              fontSize={14}
              borderWidth={1}
              borderColor="cinza"
              bg="white"
              id="state"
              // errors={errors}
              {...register("state")}
              isInvalid={!!errors.state}
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
            borderColor="cinza"
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
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="Referência"
            placeholder="Ex: Perto de, em frente a"
          />
        </Wrap>
      </Flex>
      <HStack pt={6} maxW={1200} w="full" justify="flex-end">
        {Object.keys(errors).length > 0 && (
          <Alert mt={2} status="warning">
            <AlertIcon />
            <Text fontWeight="bold">Campos obrigatórios</Text>
            <Wrap>
              {Object.values(errors)?.map((err: any) => {
                return (
                  <Tag
                    color="red.300"
                    bg="white"
                    mx={2}
                    key={err}
                    fontWeight={400}
                    lineHeight={1}
                  >
                    {err?.message}
                  </Tag>
                );
              })}
            </Wrap>
          </Alert>
        )}
        {errorCard && (
          <AlertInpa
            status="warning"
            text={errorCard.response.data.error.message}
          />
        )}
        <Button
          onClick={() => setEtapaAgendamento("pagamento")}
          color="white"
          textColor="cinza"
          title="Voltar"
        />
        <Button
          // onClick={() => setEtapaAgendamento("pagamento")}
          type="submit"
          px={8}
          title="Adicionar"
          isLoading={isPostingCard || isPostingAddress}
        />
      </HStack>
    </Flex>
  );
}
