/* eslint-disable jsx-a11y/aria-proptypes */
import React from "react";
import {
  Flex,
  Heading,
  useDisclosure,
  Link as ChakraLink,
} from "@chakra-ui/react";

import { ModalAgendamentoConluido } from "./ModalAgendamentoConcluido";
import Link from "next/link";
import { Button, ButtonLink } from "../../global/Button";
import { useMyContext } from "../../../contexts/Context";
import { ModalPagamentoComPix } from "./ModalPagamentoComPix";
import { FaQrcode } from "react-icons/fa";

export function CarrinhoVazio({ orderData }: any) {
  const {
    onOpenAgendamentoConcluido,
    isOpenAgendamentoConcluido,
    onCloseAgendamentoConcluido,
    onOpenPagamentoComPix,
    isOpenPagamentoComPix,
    onClosePagamentoComPix,
  } = useMyContext();
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
        <Heading fontSize={28}>Carrinho Vazio</Heading>
        <Heading w="full" textAlign="center" fontSize={20}>
          Seu carrinho está vazio, volte para a lista de psicólogos
        </Heading>
        {orderData?.dataOrder?.data?.order?.transaction_data?.charges[0]
          ?.last_transaction?.qr_code && (
          <Button
            alignSelf="center"
            leftIcon={<FaQrcode />}
            onClick={onOpenPagamentoComPix}
            color="azul"
            // variant="secondary"
            title="QR CODE PIX"
          />
        )}
        <ButtonLink href="/" title="Voltar para navegação" />
      </Flex>
      <ModalAgendamentoConluido
        onOpen={onOpenAgendamentoConcluido}
        isOpen={isOpenAgendamentoConcluido}
        onClose={onCloseAgendamentoConcluido}
      />
      <ModalPagamentoComPix
        onOpen={onOpenPagamentoComPix}
        isOpen={isOpenPagamentoComPix}
        onClose={onClosePagamentoComPix}
        orderData={orderData}
      />
    </Flex>
  );
}
