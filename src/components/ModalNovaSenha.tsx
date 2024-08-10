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
import { useDel } from "hooks/useDel";
import { usePost } from "hooks/usePost";
import error from "next/error";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertInpaCall } from "./global/Alert";
import { Button, ButtonLink } from "./global/Button";
import { Modal } from "./global/Modal";
import { Input } from "./global/Input";
import InputMask from "react-input-mask";
import { useRouter } from "next/router";

export function ModalNovaSenha({ isOpen, onClose }: any) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const [handlePost, data, error, isFetching] = usePost("/v1/auth/reset/");

  const onSubmit = (data: any) => {
    handlePost({ ...data, token: router.query.reset });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Center gap={6} flexDir="column">
          <Input
            password
            id="password"
            register={{
              ...register("password", {
                required: "Informe a nova senha",
                minLength: {
                  value: 6,
                  message: "A senha deve ter no mínimo 6 caracteres",
                },
              }),
            }}
            title="Senha"
            labelColor="cinza"
            errors={errors}
            placeholder={"Nova senha"}
          />

          <HStack spacing={6}>
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
              title="Confirmar nova senha"
            />
          </HStack>

          {Object.keys(errors).map((err) => (
            <Alert mt={2} key={err} status="warning">
              <AlertIcon />
              {errors[err]?.message}
            </Alert>
          ))}

          <AlertInpaCall
            error={{
              validate: error,
              text:
                error?.response?.data?.messages["pt-BR"]?.mensagem || "Erro",
            }}
            success={{
              validate: data.status === 200,
              text: "Senha alterada com sucesso",
            }}
          />
          {data?.status === 200 && (
            <Button title="Voltar para Login" onClick={onClose} />
          )}
        </Center>
      </form>
    </Modal>
  );
}
