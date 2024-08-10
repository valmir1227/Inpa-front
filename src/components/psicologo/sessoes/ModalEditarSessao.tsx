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
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, ButtonLink } from "../../global/Button";
import { Modal } from "../../global/Modal";
import { Agenda } from "./Agenda";

export function ModalEditarSessao({
  isOpen,
  onClose,
  etapaEditarSessao,
  setEtapaEditarSessao,
}: any) {
  function ErroAlteracao() {
    return (
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <VStack align="start">
          <Text fontSize={22} fontWeight={500} sx={{ b: { color: "amarelo" } }}>
            Ops!
          </Text>

          <Text fontSize={14} sx={{ a: { color: "azul" } }}>
            Infelizmente seu atendimento não pode ter a data alterada pois não
            cumpre com as regras da{" "}
            <Link href="/suporte/cancelamento">
              <a>Política de cancelamento.</a>
            </Link>
          </Text>
          <Button
            alignSelf="flex-end"
            onClick={() => setEtapaEditarSessao("initialStep")}
            title="Voltar"
          />
        </VStack>
      </Modal>
    );
  }
  function ErroCancelamento() {
    return (
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <VStack align="start">
          <Text fontSize={22} fontWeight={500} sx={{ b: { color: "amarelo" } }}>
            Ops!
          </Text>

          <Text fontSize={14} sx={{ a: { color: "azul" } }}>
            Infelizmente sua consulta não pode ser cancelada pois não cumprecom
            as regras da{" "}
            <Link href="/suporte/cancelamento">
              <a>Política de cancelamento.</a>
            </Link>
          </Text>
          <Button
            alignSelf="flex-end"
            onClick={() => setEtapaEditarSessao("initialStep")}
            title="Voltar"
          />
        </VStack>
      </Modal>
    );
  }

  function Alterado() {
    return (
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <VStack align="start">
          <Text fontSize={22} fontWeight={500} sx={{ b: { color: "amarelo" } }}>
            Data alterada
          </Text>

          <Text fontSize={14}>
            Solicite a alteração da sua consulta para outra data de acordo com
            sua agenda.
          </Text>
          <Button alignSelf="flex-end" onClick={onClose} title="Voltar" />
        </VStack>
      </Modal>
    );
  }

  function Cancelado() {
    return (
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <VStack align="start">
          <Text fontSize={22} fontWeight={500} sx={{ b: { color: "amarelo" } }}>
            Sessão cancelada
          </Text>

          <Text fontSize={14}>Sua sessão foi cancelada com sucesso!</Text>
          <Button alignSelf="flex-end" onClick={onClose} title="Voltar" />
        </VStack>
      </Modal>
    );
  }

  function Cancelar() {
    return (
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <VStack align="start">
          <Text fontSize={22} fontWeight={500} sx={{ b: { color: "amarelo" } }}>
            Cancelar sessão
          </Text>

          <Text fontSize={14}>
            Você está prestes a cancelar sua sessão, tem certeza?
          </Text>
          <Wrap w="full" justify="flex-end" spacing={10} pt={6}>
            <Button
              alignSelf="flex-end"
              onClick={() => setEtapaEditarSessao("initialStep")}
              title="Voltar"
              color="cinza"
            />
            <Button
              alignSelf="flex-end"
              onClick={() => setEtapaEditarSessao("cancelado")}
              color="vermelho"
              title="Sim, desejo cancelar a sessão"
            />
          </Wrap>
        </VStack>
      </Modal>
    );
  }
  function AlterarData() {
    return (
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <VStack align="start">
          <Text fontSize={22} fontWeight={500} sx={{ b: { color: "amarelo" } }}>
            Escolha uma data
          </Text>
          <Agenda />

          <Wrap w="full" justify="flex-end" spacing={10} pt={6}>
            <Button
              alignSelf="flex-end"
              onClick={() => setEtapaEditarSessao("initialStep")}
              title="Voltar"
              color="cinza"
            />
            <Button
              alignSelf="flex-end"
              onClick={() => setEtapaEditarSessao("alterado")}
              color="vermelho"
              title="Alterar data"
            />
          </Wrap>
        </VStack>
      </Modal>
    );
  }

  function InitialStep() {
    return (
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <VStack align="start">
          <Text fontSize={22} fontWeight={500} sx={{ b: { color: "amarelo" } }}>
            Editando sessão
          </Text>
          <Text
            w="full"
            borderTopWidth={1}
            py={2}
            fontSize={16}
            fontWeight={500}
          >
            Alterar data
          </Text>

          <Text fontSize={14}>
            Solicite a alteração da sua consulta para outra data de acordo com
            sua agenda.
          </Text>
          <Button
            alignSelf="flex-end"
            onClick={() => setEtapaEditarSessao("alterar")}
            title="Alterar data"
          />

          <Text
            w="full"
            borderTopWidth={1}
            py={2}
            fontSize={16}
            fontWeight={500}
            sx={{ b: { color: "amarelo" } }}
          >
            Cancelar consulta
          </Text>
          <Text fontSize={14} sx={{ a: { color: "azul" } }}>
            Você poderá cancelar seu atendimento, de acordo com a{" "}
            <Link href="/suporte/cancelamento">
              <a>Política de cancelamento.</a>
            </Link>
          </Text>
          <Button
            alignSelf="flex-end"
            px={6}
            color="vermelho"
            textColor="white"
            title="Cancelar consulta"
            onClick={() => setEtapaEditarSessao("cancelar")}
          />
        </VStack>
      </Modal>
    );
  }
  switch (etapaEditarSessao) {
    case "cancelar":
      return <Cancelar />;
    case "alterar":
      return <AlterarData />;
    case "cancelado":
      return <Cancelado />;
    case "alterado":
      return <Alterado />;
    case "erroCancelamento":
      return <ErroCancelamento />;
    case "erroAlteracao":
      return <ErroAlteracao />;
    default:
      return <InitialStep />;
  }
}
