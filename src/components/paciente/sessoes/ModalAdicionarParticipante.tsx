import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Center,
  Heading,
  HStack,
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { Button, ButtonLink } from "../../global/Button";
import { Modal } from "../../global/Modal";
import { Input, Select } from "../../global/Select";
import InputMask from "react-input-mask";
import { useForm } from "react-hook-form";
import { usePost } from "hooks/usePost";

export function ModalAdicionarParticipante({
  isOpen,
  onClose,
  get,
  addAppointmentParticipants = false,
}: any) {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const [handlePost, data, error, isFetching] = usePost("/v1/participants");

  useEffect(() => {
    if (data.status === 200) {
      addAppointmentParticipants && addAppointmentParticipants(data.data);
      reset();
      !addAppointmentParticipants && get();
      onClose();
    }
  }, [data]);

  const onSubmit = (data: any) => {
    handlePost({ ...data, doc: data.email });
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <Center as="form" onSubmit={handleSubmit(onSubmit)} flexDir="column">
        <Wrap>
          <Input
            id="name"
            errors={errors}
            register={{
              ...register("name", { required: "Informe o nome" }),
            }}
            borderRadius={14}
            labelColor="cinzaescuro"
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="Nome completo"
            maxW="full"
          />
          <Input
            id="birthday"
            errors={errors}
            register={{
              ...register("birthday", {
                required: "Informe a data de nascimento",
              }),
            }}
            as={InputMask}
            mask="99/99/9999"
            maskChar={null}
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={300}
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="Data de nascimento"
          />
          <Input
            id="email"
            errors={errors}
            register={{
              ...register("email", { required: "Informe o email" }),
            }}
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={300}
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="Email"
            type="email"
          />
          <Input
            id="phone"
            errors={errors}
            register={{
              ...register("phone", { required: "Informe o celular" }),
            }}
            as={ReactInputMask}
            mask={"(99) 99999-9999"}
            maskChar={null}
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={300}
            borderColor="cinza"
            borderWidth={1}
            bg="white"
            title="Celular"
          />
          <Select
            id="relationship"
            isInvalid={!!errors.relationship}
            register={{
              ...register("relationship", { required: "Informe o parentesco" }),
            }}
            titleColor="cinzaescuro"
            maxW={300}
            variant="outline"
            title="Grau de parentesco"
            values={[
              "Cônjuge",
              "Filho/Filha",
              "Pai/Mãe",
              "Irmão/Irmã",
              "Outro",
            ]}
            borderRadius={14}
            borderColor="cinza"
            borderWidth={1}
          />
        </Wrap>
        <HStack mt={10} spacing={6}>
          <Button
            onClick={onClose}
            color="white"
            textColor="cinza"
            title="Cancelar"
          />
          <Button
            isLoading={isFetching}
            type="submit"
            px={6}
            color="amarelo"
            textColor="white"
            title="Salvar"
          />
        </HStack>
        {error && (
          <Alert w="fit-content" ml="auto" mt={2} status="warning">
            <AlertIcon />
            {error?.response.statusText || "Erro"}
          </Alert>
        )}

        {Object.keys(errors).map((err) => (
          <Alert mt={2} key={err} status="warning">
            <AlertIcon />
            {errors[err]?.message}
          </Alert>
        ))}
      </Center>
    </Modal>
  );
}
