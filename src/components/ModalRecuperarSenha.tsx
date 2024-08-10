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
import { Input } from "./global/Select";
import InputMask from "react-input-mask";

export function ModalRecuperarSenha({ isOpen, onClose }: any) {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const [handlePost, data, error, isFetching] = usePost("/v1/auth/forgot");

  const onSubmit = (data: any) => {
    handlePost(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Center gap={6} flexDir="column">
          <Input
            id="doc"
            register={{
              ...register("doc", { required: "Informe um CPF ou CNPJ" }),
            }}
            title="DOC"
            labelColor="cinza"
            errors={errors}
            placeholder={"Documento do usuário (CPF OU CNPJ)"}
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
              title="Recuperar senha"
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
              text: error?.response?.data?.msg || "Erro",
            }}
            success={{
              validate: data.status === 200,
              text: "Link de recuperação de senha enviado nos emails vinculados ao CPF informado. (Listados abaixo)",
            }}
          />

          <VStack>
            {data.data?.emails?.map((email: any) => (
              <Tag fontWeight={400} key={email}>
                {email}
              </Tag>
            ))}
          </VStack>
        </Center>
      </form>
    </Modal>
  );
}
