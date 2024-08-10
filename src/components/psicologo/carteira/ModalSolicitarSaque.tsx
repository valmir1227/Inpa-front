import {
  Avatar,
  Box,
  Center,
  Checkbox,
  Heading,
  HStack,
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { AlertInpa, AlertInpaCall } from "components/global/Alert";
import { LoadingInpa } from "components/global/Loading";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import { usePost } from "hooks/usePost";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toReal } from "utils/toReal";
import { Button, ButtonLink } from "../../global/Button";
import { Modal } from "../../global/Modal";
import { Agenda } from "../../paciente/psicologos/Agenda";

export function ModalSolicitarSaque({
  isOpen,
  onClose,
  selectedAppointment,
  dataAppointment,
  getAppointment,
}: any) {
  const { user } = useMyContext();
  const [
    dataBankAccounts,
    errorBankAccounts,
    isFetchingBankAccounts,
    getBankAccounts,
  ] = useFetch("/v1/bankaccounts");

  const [handlePostWithdraw, dataWithdraw, errorWithdraw, isPostingWithdraw] =
    usePost("/v1/withdraws");

  useEffect(() => {
    getBankAccounts();
    getAppointment();
  }, [dataWithdraw]);

  const [firstBankAccount] = dataBankAccounts || [];

  const [termos, setTermos] = useState<boolean>(false);
  const handleTermos = () => setTermos(!termos);

  const Card = () => {
    if (!firstBankAccount?.id) {
      return (
        <VStack>
          <AlertInpa text="Você ainda não tem uma conta bancária definida" />
          <ButtonLink
            href="/psicologo/minha-conta"
            title="Adicionar conta bancária"
            color="cinza"
          />
        </VStack>
      );
    }

    const subTotal = selectedAppointment?.service_value || 0;
    const tax = subTotal * (user?.tax / 100);
    const total = subTotal - tax;

    const formattedData = {
      bankAccountId: firstBankAccount.id,
      items: [
        {
          id: selectedAppointment.id,
          value: subTotal,
        },
      ],
      subTotal,
      tax,
      total,
    };

    const { bank_name, agency, account, account_type } = firstBankAccount;

    return (
      <VStack spacing={6} align="start">
        <Text fontSize={22} fontWeight={500} sx={{ b: { color: "amarelo" } }}>
          Confirme seus dados
        </Text>

        <Text
          fontSize={14}
          sx={{ b: { color: "azul" }, span: { color: "amarelo" } }}
        >
          Você está solicitando a transferência para a{" "}
          <b>Conta {account_type}</b> do banco
          <b> {bank_name}</b>, agência <b>{agency}</b> e conta <b>{account}</b>,
          no valor de <span>{toReal(total)}</span>.
        </Text>
        <Text
          fontSize={14}
          sx={{
            b: { color: "azul", textDecor: "underline" },
            span: { color: "amarelo" },
          }}
        >
          Conforme os{" "}
          <b>
            <a
              href="https://docs.google.com/document/d/e/2PACX-1vTh9peRhbR7u7XVgqmUyJKbzmPJFZgJhH58KqL0B8zCiP8zJjUie9UwPMQDfAvj2M9EFd6SFP7BfHqR/pub"
              target="_blank"
              rel="noreferrer"
            >
              TERMOS E CONDIÇÕES DA PLATAFORMA
            </a>
          </b>
          , as solicitações de saques serão atendidas sempre que completarem a
          quantidade mínima de 4 solicitações. Essa será a sua solicitação de
          número <b>{dataAppointment.countWithdrawProcessing + 1}</b>.
        </Text>
        <Checkbox
          size="lg"
          // checked={termos}
          colorScheme="yellow"
          _checked={{
            span: { borderColor: "azul", backgroundColor: "azul" },
          }}
          defaultChecked={termos}
          onChange={handleTermos}
        >
          <Text bg="white" fontSize={14}>
            Sim, declaro que li e concordo com os{" "}
            <a
              href="https://docs.google.com/document/d/e/2PACX-1vTh9peRhbR7u7XVgqmUyJKbzmPJFZgJhH58KqL0B8zCiP8zJjUie9UwPMQDfAvj2M9EFd6SFP7BfHqR/pub"
              target="_blank"
              rel="noreferrer"
            >
              <b>Termos de Serviços</b>
            </a>
            , incluindo a <b>Política de Privacidade</b>.
          </Text>
        </Checkbox>

        <Wrap w="full" align="center" justify="space-between" spacing={6}>
          <ButtonLink
            href="/psicologo/minha-conta"
            title="Alterar conta bancária"
            color="cinza"
          />

          <Button onClick={onClose} color="cinza" title="Voltar" />
          <Button
            disabled={!termos}
            onClick={() => handlePostWithdraw(formattedData)}
            h={14}
            alignSelf="flex-end"
            title="Confirmar e solicitar"
            isLoading={isPostingWithdraw}
          />
        </Wrap>
        <Box alignSelf="flex-end">
          <AlertInpaCall
            error={{
              validate: errorWithdraw,
              text:
                errorWithdraw?.response?.data?.messages?.at(1)["pt-BR"] ||
                "Erro",
            }}
            success={{
              validate: dataWithdraw.status === 201,
              text: `Saque 0${
                dataAppointment.countWithdrawProcessing + 1
              } de 04 solicitado. Os valores somados serão creditados na sua conta cadastrada em até 02 dias úteis. Obrigado.`,
            }}
          />
        </Box>
      </VStack>
    );
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      {isFetchingBankAccounts ? <LoadingInpa /> : <Card />}
    </Modal>
  );
}
