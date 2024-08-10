import {
  Box,
  Image,
  Stack,
  Text,
  useClipboard,
  VStack,
} from "@chakra-ui/react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { toBrDate } from "utils/toBrDate";
import { Button, ButtonLink } from "../../global/Button";
import { Modal } from "../../global/Modal";
import { useCountdown } from "usehooks-ts";

export function ModalPagamentoComPix({ isOpen, onClose, orderData }: any) {
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 600,
      intervalMs: 10000,
    });
  const { dataOrder } = orderData;

  useEffect(() => {
    startCountdown();
  }, []);

  const { onCopy, value, setValue, hasCopied } = useClipboard(
    dataOrder?.data?.order?.transaction_data?.charges[0]?.last_transaction
      ?.qr_code
  ) as any;

  const expiresAt = new Date(
    dataOrder?.data?.order?.transaction_data?.charges[0]?.last_transaction?.expires_at
  );

  const [firstCharge] = dataOrder?.data?.order?.transaction_data?.charges || [];

  if (firstCharge?.payment_method !== "pix") {
    return null;
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Seu agendamento foi reservado, conclua o pagamento com Pix."
    >
      <Stack w="full">
        <Image
          h={400}
          filter={isPast(expiresAt) ? "blur(5px)" : "none"}
          opacity={isPast(expiresAt) ? 0.5 : 1}
          alt="Pix QR Code"
          src={
            dataOrder?.data?.order?.transaction_data?.charges[0]
              ?.last_transaction?.qr_code_url
          }
        />
        <VStack spacing={0} w="full">
          <Text fontWeight={600}>Copie e cole:</Text>
          <Text w="full">
            {
              dataOrder?.data?.order?.transaction_data?.charges[0]
                ?.last_transaction?.qr_code
            }
          </Text>
          <Button
            disabled={isPast(expiresAt)}
            size="sm"
            title={
              isPast(expiresAt)
                ? "Expirado"
                : hasCopied
                ? "Copiado"
                : "Copiar Pix"
            }
            onClick={onCopy}
            color={hasCopied ? "azul" : "amarelo"}
          />
          <Text pt={4}>
            {isPast(expiresAt) ? "Expirado " : "Expira "}
            {formatDistanceToNow(expiresAt, {
              locale: ptBR,
              addSuffix: true,
            })}
          </Text>
        </VStack>

        <ButtonLink title="Ver minhas sessões" href="/paciente/sessoes" />
      </Stack>
    </Modal>
  );
}
