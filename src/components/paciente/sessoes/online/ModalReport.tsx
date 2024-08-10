import React, { useState } from "react";
import { Center, Wrap, Textarea } from "@chakra-ui/react";
import { Button } from "components/global/Button";

import { AlertInpaCall } from "components/global/Alert";
import { usePost } from "hooks/usePost";

import { Modal } from "components/global/Modal";

export const ModalReport = ({
  isOpenReportModal,
  onCloseReportModal,
  dataAppointment,
}: any) => {
  const [reportReason, setReportReason] = useState("");
  const DefaultReasonButton = ({ title }: any) => (
    <Button size="sm" onClick={() => setReportReason(title)} title={title} />
  );

  const [handlePost, data, error, isFetching] = usePost(
    `/v1/appointments/${dataAppointment?.data?.id}/report`
  );

  if (!dataAppointment?.data?.id) return null;

  return (
    <Modal
      title="Reportar ou enviar reclamação desta sessão"
      isOpen={isOpenReportModal}
      onClose={onCloseReportModal}
    >
      <Center alignItems="flex-end" flexDir="column" gap={2}>
        <Wrap>
          <DefaultReasonButton title="Profissional ausente" />
          <DefaultReasonButton title="Paciente ausente" />
        </Wrap>
        <Textarea
          placeholder="Escolha uma opção ou descreva o problema"
          onChange={(e) => setReportReason(e.target.value)}
          value={reportReason}
        />
        <Button
          isLoading={isFetching}
          disabled={!reportReason}
          title="Enviar"
          onClick={() =>
            handlePost({
              // reportedFile: "http://...",
              reportedNotes: reportReason,
            })
          }
        />
        <AlertInpaCall
          error={{
            validate: error,
            text: "Erro ao enviar reclamação",
          }}
          success={{
            validate: data?.status === 200,
            text: "Sua reclamação foi enviada",
          }}
        />
      </Center>
    </Modal>
  );
};
