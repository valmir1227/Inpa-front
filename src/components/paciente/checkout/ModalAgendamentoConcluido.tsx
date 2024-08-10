import { Box, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { ButtonLink } from "../../global/Button";
import { Modal } from "../../global/Modal";

export function ModalAgendamentoConluido({ isOpen, onClose }: any) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Seu agendamento foi realizado com sucesso."
    >
      <Stack w="full">
        <ButtonLink title="Ver minhas sessões" href="/paciente/sessoes" />
      </Stack>
    </Modal>
  );
}
