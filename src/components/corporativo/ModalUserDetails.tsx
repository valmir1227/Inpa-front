import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
  Input,
} from "@chakra-ui/react";
import { AlertInpa, AlertInpaCall } from "components/global/Alert";
import { expertCityState } from "components/global/expertCityState";
import { LoadingInpa } from "components/global/Loading";
import { useMyContext } from "contexts/Context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePost } from "hooks/usePost";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { BASE_URL } from "utils/CONFIG";
import { toReal } from "utils/toReal";
import { colorStatus, translateStatus } from "utils/translateStatus";
import { Button, ButtonLink } from "../global/Button";
import { Modal } from "../global/Modal";
import { usePatch } from "hooks/usePatch";

export function ModalUserDetails({
  isOpen,
  onClose,
  selectedUserId,
  enterpriseCredits,
  creditsData,
  formattedData,
  getMyUsers,
}: any) {
  const { isFetchingCredits } = creditsData;

  const selectedUser = formattedData?.find(
    (user: any) => user.id === selectedUserId
  );

  if (!selectedUserId || !selectedUser?.id) return null;

  const Card = ({ title, text }: any) => {
    if (!text) return null;
    return (
      <VStack spacing={5}>
        <Heading fontSize={20}>{title}</Heading>
        <Text fontSize={14}>{text}</Text>
      </VStack>
    );
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <Flex gap={8} flexDir="column" w="full">
        <Wrap
          align="center"
          justify="space-between"
          spacing={{ base: 8, sm: 12 }}
          w="full"
        >
          <Card title="Nome" text={selectedUser.name} />
          <Card title="Gênero" text={selectedUser.gender} />
          <Card title="Idade" text={selectedUser.age} />
          <Card
            title={selectedUser.permissions?.enterprise ? "CNPJ" : "CPF"}
            text={selectedUser.doc}
          />
          <Card title="Email" text={selectedUser.email} />
          <Card
            title="Telefone"
            text={`+${selectedUser.country_code} (${selectedUser.area_code}) ${selectedUser.phone}`}
          />
          <Card
            title="Limite de crédito por sessão"
            text={selectedUser.credit_limit}
          />
        </Wrap>
        <Wrap
          justify="space-between"
          p={4}
          gap={4}
          borderWidth={1}
          borderRadius={16}
        >
          <Text fontWeight={500}>Créditos do usuário</Text>
          <Tag colorScheme="green">
            Disponíveis: {selectedUser.availableCredits}
          </Tag>
          <Tag colorScheme="yellow">Usados: {selectedUser.usedCredits}</Tag>
          <Tag colorScheme="red">Perdidos: {selectedUser.lostCredits}</Tag>
        </Wrap>
        <Wrap spacing={6} align="center" justify="center" textAlign="center">
          <Text color="azul" w="full">
            Sua carteira:
            <b>
              {" "}
              {isFetchingCredits ? (
                <Box w={100}>
                  <LoadingInpa />
                </Box>
              ) : (
                `${enterpriseCredits} créditos`
              )}
            </b>
          </Text>

          <SendCredits
            creditsData={creditsData}
            selectedUser={selectedUser}
            enterpriseCredits={enterpriseCredits}
          />
          <UpdateCreditLimit
            selectedUser={selectedUser}
            getMyUsers={getMyUsers}
          />
        </Wrap>
      </Flex>
    </Modal>
  );
}

const SendCredits = ({ creditsData, selectedUser, enterpriseCredits }: any) => {
  const { handlePostCredits, dataCredits, errorCredits, isFetchingCredits } =
    creditsData;
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
    reset,
  } = useForm() as any;

  const onSubmit = async (data: any) => {
    // alert("validação ok, implementar envio de dados");
    const formattedData = {
      data: [
        {
          amount: +data.amount,
          toUserId: selectedUser?.id,
        },
      ],
    };

    //open a confirmation modal
    if (
      confirm(
        `Deseja realmente enviar ${data.amount} créditos para ${selectedUser.name} ?`
      )
    ) {
      handlePostCredits(formattedData);
    }
  };
  return (
    <VStack
      alignSelf="end"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      align="start"
    >
      <Text>Atribuir créditos:</Text>
      <HStack align="start" spacing={0}>
        <Input
          {...register("amount", {
            required: "Informe um valor",
            max: {
              value: enterpriseCredits,
              message: "Valor máximo de " + enterpriseCredits,
            },
            min: {
              value: 1,
              message: "Valor mínimo de 1",
            },
          })}
          type="number"
          bg="white"
          borderColor="cinza"
          borderEndRadius={0}
          borderWidth={1}
          borderRightWidth={0}
          placeholder="Digite o valor desejado"
        />

        <Button
          type="submit"
          fontSize={14}
          lineHeight={1}
          px={8}
          borderRadius={6}
          borderStartRadius={0}
          color="amarelo"
          textColor="white"
          colorScheme="none"
          title="Enviar créditos"
          isLoading={isFetchingCredits}
        />
      </HStack>
      <AlertInpaCall
        error={{
          validate: errorCredits,
          text: "Erro transferir créditos",
        }}
      />
      {errors.amount && (
        <AlertInpa text={errors.amount.message || "Valor inválido"} />
      )}
    </VStack>
  );
};

const UpdateCreditLimit = ({ selectedUser, getMyUsers }: any) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
  } = useForm({
    defaultValues: { creditLimit: selectedUser.credit_limit },
  }) as any;

  const [handlePatchUser, data, error, updatingLimit] = usePatch(
    `/v1/users/${selectedUser.id}`
  );

  const onSubmit = async (data: any) => {
    handlePatchUser(data);
  };

  useEffect(() => {
    if (data.statusText === "OK") {
      getMyUsers();
    }
  }, [data]);

  if (!selectedUser || !selectedUser?.from_id) return null;

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} align="start">
      <Text>Definir limite de créditos por sessão:</Text>
      <HStack align="start" spacing={0}>
        <Input
          {...register("creditLimit", {
            required: "Informe um valor",
            min: { value: 1, message: "Digite um número entre 1 e 1000" },
            max: {
              value: 1000,
              message: "Digite um número entre 1 e 1000",
            },
          })}
          type="number"
          bg="white"
          borderColor="cinza"
          borderEndRadius={0}
          borderWidth={1}
          borderRightWidth={0}
          placeholder="Digite o valor desejado"
        />

        <Button
          type="submit"
          fontSize={14}
          lineHeight={1}
          px={8}
          borderRadius={6}
          borderStartRadius={0}
          color="amarelo"
          textColor="white"
          colorScheme="none"
          title="Atualizar limite"
          isLoading={updatingLimit}
        />
      </HStack>
      <AlertInpaCall
        error={{
          validate: error,
          text: "Erro ao atualizar limite",
        }}
        success={{
          validate: data.statusText === "OK",
          text: "Limite atualizado com sucesso",
        }}
      />
      {errors.creditLimit && (
        <AlertInpa text={errors.creditLimit.message || "Valor inválido"} />
      )}
    </VStack>
  );
};
