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
import { Button, ButtonLink } from "../../global/Button";
import { Modal } from "../../global/Modal";

export function ModalExcluir({
  isOpen,
  onClose,

  get,

  confirmText,

  handleDelete,
  dataDelete,
  errorDelete,
  isFetchingDelete,
}: any) {
  useEffect(() => {
    if (dataDelete.status === 200) {
      get();
      onClose();
    }
  }, [dataDelete]);

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <Center flexDir="column">
        <Box
          maxW={360}
          textAlign="center"
          fontSize={18}
          fontWeight={500}
          sx={{ b: { color: "amarelo" } }}
          dangerouslySetInnerHTML={{ __html: confirmText }}
        />
        <HStack mt={10} spacing={6}>
          <Button
            onClick={onClose}
            color="white"
            textColor="cinza"
            title="Cancelar"
          />
          <Button
            onClick={handleDelete}
            isLoading={isFetchingDelete}
            px={6}
            color="#f00f0077"
            textColor="white"
            title="Excluir"
          />
          {errorDelete && (
            <Alert w="fit-content" ml="auto" mt={2} status="warning">
              <AlertIcon />
              {errorDelete?.response.statusText || "Erro"}
            </Alert>
          )}
        </HStack>
      </Center>
    </Modal>
  );
}
