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
  Alert,
  AlertIcon,
  FormControl,
  Tag,
} from "@chakra-ui/react";

import { Input } from "../../global/Select";
import { EditIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import { CheckboxInpa } from "../../global/Checkbox";
import { BANCOS } from "../../../utils/BANCOS";
import { Controller, useForm } from "react-hook-form";
import { Button } from "components/global/Button";
import error from "next/error";
import { usePost } from "hooks/usePost";
import { useFetch } from "hooks/useFetch";
import { usePatch } from "hooks/usePatch";
import { usePut } from "hooks/usePut";
import Select from "react-select";
import { FormAlertsRequiredFields } from "components/global/FormAlertsRequiredFields";
import { transparentize } from "@chakra-ui/theme-tools";

export function DadosBancarios({
  dataBankAccounts,
  errorBankAccounts,
  isFetchingBankAccounts,
  getBankAccounts,
}: any) {
  const [firstBankAccount] = dataBankAccounts || [];
  const defaultBankFullName = BANCOS.find(
    (banco: any) => banco.COMPE === firstBankAccount?.bank_code
  )?.LongName;

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...firstBankAccount,
      bank: `${firstBankAccount?.bank_code} - ${defaultBankFullName}`,
    },
  });

  const [handlePost, dataPost, errorPost, isPosting] =
    usePost("/v1/bankaccounts");
    
  const [handlePut, dataPut, errorPut, isPuting] = usePut(
    `/v1/bankaccounts/${firstBankAccount?.id}`
  );

  const onSubmit = (data: any) => {
    delete data.bank;

    if (firstBankAccount) handlePut(data);
    else handlePost(data);
  };

  const formattedBanks = BANCOS?.map((item) => {
    const label = `${item.COMPE} - ${item.LongName}`;
    return { label, value: label };
  }) as any;

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
        <Heading fontSize={28}>Dados bancários</Heading>
        <Wrap
          w="full"
          align="center"
          justify="space-between"
          overflow="visible"
          position="relative"
        >
          {/* <Select
            id="bank"
            isInvalid={!!errors.bank}
            register={{
              ...register("bank", {
                required: "Informe o banco",
              }),
            }}
            placeholder="Selecione"
            title="Banco"
            maxW={240}
            variant="outline"
            titleColor="cinzaescuro"
            options={BANCOS.map((item) => `${item.COMPE} - ${item.LongName}`)}
            onChange={(e) => {
              console.log(
                `${firstBankAccount?.bank_code} - ${firstBankAccount?.bank_name}`
              );
              setValue("bank", e);
              setValue("bank_name", e.split("-")[1].trim());
              setValue("bank_code", e.split("-")[0].trim());
            }}
            borderRadius={14}
          /> */}
          {/* <Select
            id="account_type"
            {...register("account_type", {
              required: "Informe o tipo da conta",
            })}
            title="Tipo de conta"
            maxW={120}
            variant="outline"
            titleColor="cinzaescuro"
            options={[
              { value: "Corrente", label: "Corrente" },
              { value: "Poupança", label: "Poupança" },
            ]}
            borderRadius={14}
          /> */}

          <FormControl w="fit-content" pt={2}>
            <FormLabel fontWeight={400} alignSelf="start" fontSize={14}>
              Banco
            </FormLabel>
            <Controller
              name="bank"
              control={control}
              render={() => (
                <Select
                  noOptionsMessage={() => "Não encontrado"}
                  placeholder="Selecione"
                  options={formattedBanks}
                  onChange={(val: any) => {
                    setValue("bank", val?.value);
                    setValue("bank_name", val?.value?.split("-")[1].trim());
                    setValue("bank_code", val?.value?.split("-")[0].trim());
                  }}
                  isClearable
                  styles={{
                    control: (baseStyles: any, state: any) => ({
                      ...baseStyles,
                      borderRadius: 10,
                      borderColor: "#EEE",
                      width: 300,
                      fontSize: 14,
                    }),
                  }}
                  defaultValue={
                    firstBankAccount?.bank_code && {
                      value: `${firstBankAccount?.bank_code} - ${defaultBankFullName}`,
                      label: `${firstBankAccount?.bank_code} - ${defaultBankFullName}`,
                    }
                  }
                />
              )}
              rules={{ required: "Banco" }}
            />
          </FormControl>

          <FormControl w="fit-content" pt={2}>
            <FormLabel fontWeight={400} alignSelf="start" fontSize={14}>
              Tipo de conta
            </FormLabel>
            <Controller
              name="account_type"
              control={control}
              render={() => (
                <Select
                  noOptionsMessage={() => "Não encontrado"}
                  placeholder="Selecione"
                  options={[
                    { value: "Corrente", label: "Corrente" },
                    { value: "Poupança", label: "Poupança" },
                  ]}
                  onChange={(val: any) =>
                    setValue("account_type", val?.value || "")
                  }
                  isClearable
                  styles={{
                    control: (baseStyles: any, state: any) => ({
                      ...baseStyles,
                      borderRadius: 10,
                      borderColor: "#EEE",
                      width: 130,
                      fontSize: 14,
                    }),
                  }}
                  defaultValue={
                    firstBankAccount?.account_type && {
                      value: firstBankAccount?.account_type,
                      label: firstBankAccount?.account_type,
                    }
                  }
                />
              )}
              rules={{ required: "Tipo da conta" }}
            />
          </FormControl>

          <Input
            id="agency"
            errors={errors}
            register={{
              ...register("agency", {
                required: "Agência",
                valueAsNumber: true,
              }),
            }}
            labelColor="cinzaescuro"
            title="Agência"
            maxW={100}
            variant="outline"
            borderRadius={14}
          />
          <Input
            id="account"
            errors={errors}
            register={{
              ...register("account", { required: "Conta" }),
            }}
            labelColor="cinzaescuro"
            title="Conta"
            maxW={140}
            variant="outline"
            borderRadius={14}
          />
          <VStack spacing={4} maxW={400}>
            <Text textAlign="center" color="cinzaescuro">
              Preencha os campos com os dados da conta bancária na qual deseja
              receber os pagamentos futuros.{" "}
            </Text>
            <Text
              bg="#FFA61A22"
              p={2}
              borderColor="amarelo"
              borderWidth={1}
              borderRadius="md"
              textAlign="center"
              color="cinzaescuro"
              fontWeight={400}
            >
              <b>Importante:</b> Essa conta deve ter como titular o profissional
              que realiza os atendimentos ou empresa da qual ele(a) seja
              sócio(a) por meio de comprovação de envio do Contrato Social.
            </Text>
          </VStack>
        </Wrap>
        <Button
          isLoading={isPosting || isPuting}
          ml="auto"
          title={firstBankAccount ? "Atualizar conta" : "Cadastrar conta"}
          type="submit"
        />
        {(errorPost || errorPut) && (
          <Alert w="fit-content" ml="auto" mt={2} status="warning">
            <AlertIcon />
            {errorPost?.response.statusText ||
              errorPut?.response.statusText ||
              "Erro"}
          </Alert>
        )}
        {dataPost.status == 200 && (
          <Alert w="fit-content" ml="auto" mt={2} status="success">
            <AlertIcon />
            Conta bancária adicionada
          </Alert>
        )}
        {dataPut.status == 200 && (
          <Alert w="fit-content" ml="auto" mt={2} status="success">
            <AlertIcon />
            Conta bancária atualizada
          </Alert>
        )}

        <FormAlertsRequiredFields errors={errors} alignSelf="flex-end" />
      </Flex>
    </Flex>
  );
}
