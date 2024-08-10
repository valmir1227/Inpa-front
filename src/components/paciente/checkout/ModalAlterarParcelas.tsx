import React, { useState, useEffect } from "react";
import { Button, Heading, Select, Text, VStack } from "@chakra-ui/react";
import { RiFilterLine } from "react-icons/ri";
import { Modal } from "../../global/Modal";
import { toReal } from "utils/toReal";

export function ModalAlterarParcelas({
  isOpen,
  onClose,
  onOpen,
  priceWithDiscount,
}: any) {
  const [parcelas, setParcelas] = useState(
    `1x de ${toReal(priceWithDiscount)}`
  );

  useEffect(() => {
    setParcelas(`1x de ${toReal(priceWithDiscount)}`);
  }, [priceWithDiscount]);

  return (
    <>
      <Text
        onClick={onOpen}
        sx={{ b: { color: "amarelo", pl: 2 } }}
        color="cinza"
        fontSize={12}
        alignSelf="start"
        _hover={{
          cursor: "pointer",
          b: { textDecoration: "underline" },
        }}
      >
        Em {parcelas} sem juros <b>Alterar</b>
      </Text>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Deseja dividir em quantas vezes?"
        cancelButton={
          <Button
            px={5}
            bg="white"
            color="cinza"
            borderRadius="full"
            onClick={onClose}
            mx={1}
            mt={2}
          >
            Voltar
          </Button>
        }
        confirmButton={
          <Button
            px={5}
            bg="amarelo"
            color="white"
            borderRadius="full"
            mx={1}
            mt={2}
            colorScheme="none"
          >
            Continuar
          </Button>
        }
      >
        <VStack spacing={10}>
          <Select
            borderRadius={6}
            color="cinza"
            variant="filled"
            _focus={{ bg: "white" }}
            bg="white"
            fontSize={14}
            w="fit-content"
            borderWidth={1}
            borderColor="cinzaclaro"
            value={parcelas}
            onChange={(e) => setParcelas(e.target.value)}
          >
            <option>1x de {toReal(priceWithDiscount / 1)}</option>
            <option>2x de {toReal(priceWithDiscount / 2)}</option>
            <option>3x de {toReal(priceWithDiscount / 3)}</option>
          </Select>
          <Text>Em {parcelas} sem juros</Text>
        </VStack>
      </Modal>
    </>
  );
}
