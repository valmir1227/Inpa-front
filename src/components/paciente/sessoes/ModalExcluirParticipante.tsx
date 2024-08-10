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

export function ModalExcluirParticipante({
  isOpen,
  onClose,
  selectedParticipant,
  get,
}: any) {
  const [handleDelete, dataDel, errorDel, isDeleting] = useDel(
    `/v1/participants/${selectedParticipant?.id}`
  );

  useEffect(() => {
    if (dataDel.status === 200) {
      get();
      onClose();
    }
  }, [dataDel]);

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <Center flexDir="column">
        <Text
          maxW={360}
          textAlign="center"
          fontSize={18}
          fontWeight={500}
          sx={{ b: { color: "amarelo" } }}
        >
          Você está excluindo <b>{selectedParticipant?.name}</b> da sua lista de
          participantes, deseja prosseguir?
        </Text>
        <HStack mt={10} spacing={6}>
          <Button
            onClick={onClose}
            color="white"
            textColor="cinza"
            title="Cancelar"
          />
          <Button
            onClick={() => handleDelete()}
            isLoading={isDeleting}
            px={6}
            color="#f00f0077"
            textColor="white"
            title="Excluir"
          />
          {errorDel && (
            <Alert w="fit-content" ml="auto" mt={2} status="warning">
              <AlertIcon />
              {errorDel?.response.statusText || "Erro"}
            </Alert>
          )}
        </HStack>
      </Center>
    </Modal>
  );
}
