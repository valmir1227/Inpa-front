import {
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
import { AlertInpaCall } from "components/global/Alert";
import React, { useEffect, useState } from "react";
import { Button, ButtonLink } from "../../global/Button";
import { Modal } from "../../global/Modal";

export function ModalExcluirCartao({
  isOpen,
  onClose,
  selectedCard,
  get,
  dataDeleteCard,
}: any) {
  const { handleDelete, dataDelete, errorDelete, isDeleting } = dataDeleteCard;

  useEffect(() => {
    if (dataDelete.status === 200) {
      get();
      onClose();
    }
  }, [dataDelete]);

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <Center gap={2} flexDir="column">
        <Text
          maxW={360}
          textAlign="center"
          fontSize={18}
          fontWeight={500}
          sx={{ b: { color: "amarelo" } }}
        >
          Você deseja excluir{" "}
          <b>
            {selectedCard.brand} {selectedCard?.holder_name}
          </b>{" "}
          final <b>{selectedCard?.last_four_digits}</b> das suas formas de
          pagamento?
        </Text>
        <HStack mt={10} spacing={6}>
          <Button
            onClick={onClose}
            color="white"
            textColor="cinza"
            title="Cancelar"
          />
          <Button
            isLoading={isDeleting}
            px={6}
            color="#f00f0077"
            textColor="white"
            title="Excluir"
            onClick={() => handleDelete(selectedCard.id)}
          />
        </HStack>
        {
          <AlertInpaCall
            error={{ validate: errorDelete, text: "Erro ao excluir cartão" }}
          />
        }
      </Center>
    </Modal>
  );
}
