/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  Flex,
  Heading,
  useDisclosure,
  VStack,
  Stack,
  IconButton,
  Text,
  CircularProgress,
  CircularProgressLabel,
  Tag,
  Badge,
  Wrap,
  Tooltip,
} from "@chakra-ui/react";

import { Button } from "../../global/Button";
import dynamic from "next/dynamic";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { LockIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { useFetch } from "hooks/useFetch";
import { AlertInpa, AlertInpaCall } from "components/global/Alert";
import { MdNotificationImportant } from "react-icons/md";
import { usePost } from "hooks/usePost";
import draftToHtml from "draftjs-to-html";
import { usePut } from "hooks/usePut";
import { Titulos } from "./Cids";
import { useMyContext } from "contexts/Context";
import { LoadingInpa } from "components/global/Loading";
import { darken } from "@chakra-ui/theme-tools";
import { useRouter } from "next/router";
import { Timeline } from "components/psicologo/TimeLine";
import useSwr from "swr";
import { fetcher } from "utils/api";
import { Anexos } from "components/paciente/sessoes/online/Anexos";
import { Participants } from "components/paciente/sessoes/online/Participants";
import { ModalReport } from "components/paciente/sessoes/online/ModalReport";
import { Jitsi } from "components/paciente/sessoes/online/Jitsi";
import { InviteUsersJitsi } from "components/paciente/sessoes/online/InviteUsersJitsi";
import { Prontuario } from "components/paciente/sessoes/online/Prontuario";
import { toBrDate } from "utils/toBrDate";
import { toBrFullDate } from "utils/toBrDate";
import { differenceInSeconds } from "date-fns";
import ModalAvaliarExpert from "./ModalAvaliarExpert";

let htmlToDraft = null;
if (typeof window === "object") {
  htmlToDraft = require("html-to-draftjs").default;
}

const ZoomMeetings = dynamic(
  () => import("../../../components/zoom/Zoom").then(({ Zoom }) => Zoom),
  {
    ssr: false, // Disable SSR for this component
  }
);

export function Online({ type, dataAppointment }) {
  const { user } = useMyContext();
  const isExpert = type === "expert";
  const { data } = dataAppointment;
  const { register, reset, handleSubmit, watch } = useForm({
    defaultValues: { notes },
  });

  const {
    data: dataMedicalRecords,
    error: errorMedicalRecords,
    isLoading: isFetchingMedicalRecords,
    mutate: getMedicalRecords,
  } = useSwr(
    isExpert && data?.patient_id
      ? `v1/medicalrecords?patientId=${data?.patient_id}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const {
    data: dataMedicalRecordsFromThisAppointment,
    mutate: getMedicalRecordsFromThisAppointment,
  } = useSwr(
    dataAppointment?.data
      ? `v1/medicalrecords?appointmentId=${dataAppointment?.data?.id} `
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const [firstMedicalRecord] = dataMedicalRecordsFromThisAppointment || [];

  const [
    handlePutMedicalRecord,
    dataPutMedicalRecord,
    errorPutMedicalRecord,
    isPutMedicalRecord,
  ] = usePut(`/v1/medicalrecords/${firstMedicalRecord?.id}`);

  const [
    handlePostMedicalRecord,
    dataPostMedicalRecord,
    isPostingMedicalRecord,
  ] = usePost("/v1/medicalrecords");

  const [titles, setTitles] = useState([]);

  useEffect(() => {
    if (firstMedicalRecord) setTitles(firstMedicalRecord.ci_ds);
  }, [dataMedicalRecords]);

  function onSubmit(data) {
    setTitles((prev) => [...prev, data.titulo]);
    reset();
  }

  const [notes, setNotes] = useState();

  useEffect(() => {
    if (firstMedicalRecord?.notes) {
      const contentBlock = htmlToDraft(firstMedicalRecord.notes);

      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        setNotes(editorState);
      }
    } else {
      setNotes(EditorState.createEmpty());
    }
  }, [firstMedicalRecord]);

  function saveMedicalRecord() {
    if (!firstMedicalRecord?.id)
      return alert("Erro, nenhum prontuário encontrado");
    handlePutMedicalRecord({
      type: "Default",
      notes: draftToHtml(convertToRaw(notes.getCurrentContent())),
      CIDs: titles,
      // attachments: selectedFiles,
    });
  }

  useEffect(() => {
    if (
      dataPutMedicalRecord.status === 202 ||
      dataPostMedicalRecord.status === 201
    ) {
      getMedicalRecords();
      getMedicalRecordsFromThisAppointment();
    }
  }, [dataPutMedicalRecord, dataPostMedicalRecord]);

  const [
    dataFinishOpenVidu,
    errorFinishOpenVidu,
    isFetchingFinishOpenVidu,
    getFinishOpenVidu,
  ] = useFetch(`/v1/appointments/${data?.id}/finish`);

  const draft = notes && draftToHtml(convertToRaw(notes.getCurrentContent()));
  const isDirty = firstMedicalRecord?.notes !== draft;
  const lastRender = new Date();

  if (!data?.id || !user.id) return null;

  if (typeof window === "undefined") {
    return null; //return nothing on the server-side
  }

  const {
    onOpen: onOpenAvaliarModal,
    isOpen: isOpenAvaliarModal,
    onClose: onCloseAvaliarModal,
  } = useDisclosure();

  useEffect(() => {
    if (data.status === "Finished" || data.status === "Finished(auto)") {
      onOpenAvaliarModal();
    }
  }, [data, status]);

  const finishedSession =
    data.status === "Finished" ||
    data.status === "Finished(auto)" ||
    dataFinishOpenVidu?.status === 200;

  const shouldMeet =
    dataAppointment.data.status !== "Finished" &&
    dataAppointment.data.status !== "Finished(auto)" &&
    dataAppointment.data.status !== "Absent" &&
    dataAppointment.data.status !== "Reserved" &&
    dataAppointment.data.status !== "Canceled";

  return (
    <Flex
      bg="#f5f5f5"
      flexDir="column"
      as="section"
      justify="center"
      align="center"
      w="100%"
      gap={6}
      py={4}
    >
      <Card
        data={data}
        shouldMeet={shouldMeet}
        finishedSession={finishedSession}
        isExpert={isExpert}
        dataAppointment={dataAppointment}
        saveMedicalRecord={saveMedicalRecord}
        finish={{
          dataFinishOpenVidu,
          errorFinishOpenVidu,
          isFetchingFinishOpenVidu,
          getFinishOpenVidu,
        }}
      />

      {isExpert && (
        <Flex
          p={{ base: "1rem", md: "2rem" }}
          bg="white"
          color="cinzaescuro"
          borderRadius={20}
          borderWidth={1}
          maxW={1200}
          w="full"
          flexDir={{ base: "column", lg: "row" }}
          gap={6}
          mt={4}
          justify="stretch"
        >
          {shouldMeet &&
            (firstMedicalRecord ? (
              <VStack w="full" align="start" flex={1}>
                <Flex borderWidth={1} h={400} justify="center" pb={30}>
                  <Prontuario notes={notes} setNotes={setNotes} />
                </Flex>
                {finishedSession && (
                  <Text alignSelf="end" color="red" fontSize="xs">
                    Não é possível alterar prontuários de sessões finalizadas
                  </Text>
                )}
                <Stack alignSelf="end">
                  {/* <Text>Renderizou: {toBrFullDate(new Date())}</Text> */}
                  <Wrap w="full" justify="flex-end">
                    <Cronometro
                      lastRender={lastRender}
                      saveMedicalRecord={saveMedicalRecord}
                      shouldStart={isDirty && !isPutMedicalRecord}
                    />
                    <Button
                      title="Salvar Alterações"
                      onClick={saveMedicalRecord}
                      isLoading={isPutMedicalRecord}
                      disabled={finishedSession || isPutMedicalRecord}
                      leftIcon={finishedSession && <LockIcon />}
                    />
                  </Wrap>
                  <AlertInpaCall
                    error={{
                      validate: errorPutMedicalRecord,
                      text: "Erro ao salvar prontuário",
                    }}
                    success={{
                      validate: dataPutMedicalRecord?.status === 202,
                      text: "Prontuário atualizado",
                    }}
                  />
                </Stack>
                <Heading fontSize={20}>Participantes</Heading>
                <Participants data={data} />

                <Titulos
                  form={{ onSubmit, handleSubmit, register }}
                  data={data}
                  titles={titles}
                  setTitles={setTitles}
                  firstMedicalRecord={firstMedicalRecord}
                />
              </VStack>
            ) : (
              <Center flexDir="column" flex={1}>
                <AlertInpa text="Não há prontuário para esta sessão" />
                <Button
                  isLoading={isPostingMedicalRecord}
                  title="Criar"
                  onClick={() =>
                    handlePostMedicalRecord({
                      appointmentId: data?.id,
                      type: "Evolução",
                    })
                  }
                />
              </Center>
            ))}
          <Box flex={1} pr={2} h={750} w="full" overflowY="auto">
            <Timeline
              data={dataMedicalRecords?.data}
              getMedicalRecords={getMedicalRecords}
            />
          </Box>
        </Flex>
      )}

      {isFetchingMedicalRecords ? (
        <LoadingInpa />
      ) : (
        <Anexos
          isExpert={isExpert}
          firstMedicalRecord={firstMedicalRecord}
          getMedicalRecords={getMedicalRecords}
          getMedicalRecordsFromThisAppointment={
            getMedicalRecordsFromThisAppointment
          }
        />
      )}

      <ModalAvaliarExpert
        isOpen={isOpenAvaliarModal}
        onClose={onCloseAvaliarModal}
        data={data}
        dataAppointment={dataAppointment}
      />
    </Flex>
  );
}

const Card = ({
  data,
  finishedSession,
  isExpert,
  dataAppointment,
  saveMedicalRecord,
  finish,
}) => {
  const router = useRouter();
  const { user } = useMyContext();

  const {
    onOpen: onOpenReportModal,
    isOpen: isOpenReportModal,
    onClose: onCloseReportModal,
  } = useDisclosure();

  const {
    dataFinishOpenVidu,
    errorFinishOpenVidu,
    isFetchingFinishOpenVidu,
    getFinishOpenVidu,
  } = finish;

  const openViduBaseUrl = process.env.NEXT_PUBLIC_VIDEO_URL;

  const { data: dataOvToken, isLoading: isFetchingOvToken } = useSwr(
    data?.id ? `/v2/appointments/${data?.id}/createSession` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  const isFamiliar = data.service_name === "Psicoterapia Familiar";

  const { data: health } = useSwr("/health", fetcher, {
    revalidateOnFocus: false,
  });

  if (finishedSession) return <AlertInpa text="Sessão finalizada" />;
  if (data.status === "Canceled") return <AlertInpa text="Sessão cancelada" />;
  if (data.status === "Absent" || data.status === "Absent(auto)")
    return <AlertInpa text="Sessão faltante" />;
  if (data.status === "Reserved")
    return <AlertInpa text="Sessão aguardando confirmação do pagamento" />;
  return (
    <VStack w="full" maxW={1200} alignSelf="center" justify="center">
      {/* {shouldMeet && (
        <OpenVidu
          openViduLink={openViduLink}
          isFetchingOvToken={isFetchingOvToken}
        />
      )} */}

      <Jitsi
        dataOvToken={dataOvToken}
        isFetchingOvToken={isFetchingOvToken}
        data={data}
        health={health}
      />

      {/* <ZoomMeetings
        dataOvToken={dataOvToken}
        health={health}
      />
 */}
      <Box w="100vw" h="90vh">
        <iframe
          src={`/zoom/${data.id}`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="microphone; camera"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-forms"
        ></iframe>
      </Box>
      {isExpert && dataFinishOpenVidu?.status !== 200 && (
        <Button
          title="Finalizar sessão"
          color="vermelho"
          onClick={() => {
            if (
              confirm(
                "Finalizar sessão? O prontuário será salvo automaticamente e não será possível alterá-lo."
              )
            ) {
              saveMedicalRecord();
              getFinishOpenVidu();
              router.push(
                isExpert ? "/psicologo/sessoes" : "/paciente/sessoes"
              );
            }
          }}
          isLoading={isFetchingFinishOpenVidu}
        />
      )}
      <AlertInpaCall
        error={{
          validate: errorFinishOpenVidu,
          text: "Erro ao finalizar sessão",
        }}
        success={{
          validate: dataFinishOpenVidu?.status === 200,
          text: "Sessão finalizada com sucesso",
        }}
      />

      <IconButton
        size="sm"
        color="white"
        bg="amarelo"
        isRound
        _hover={{ bg: darken("amarelo", 10) }}
        icon={<MdNotificationImportant size={20} />}
        m={2}
        onClick={onOpenReportModal}
      />

      {/* {isFamiliar && <InviteUsers />} */}
      {isFamiliar && <InviteUsersJitsi />}

      <ModalReport
        isOpenReportModal={isOpenReportModal}
        onCloseReportModal={onCloseReportModal}
        dataAppointment={dataAppointment}
      />
    </VStack>
  );
};

const Cronometro = ({ lastRender, saveMedicalRecord, shouldStart }) => {
  const [now, setNow] = useState();
  const seconds = differenceInSeconds(now, lastRender);

  useEffect(() => {
    let interval;

    if (shouldStart)
      interval = setInterval(() => {
        console.log("INTERVAL");
        setNow(new Date());
      }, 1000);
    return () => {
      setNow(null);
      clearInterval(interval);
    };
  }, []);

  const timeToSave = 15;

  if (!shouldStart || typeof seconds !== "number") return null;
  if (+seconds >= timeToSave) {
    saveMedicalRecord();
    return null;
  }
  return (
    <>
      <Tooltip label="Salvamento automático" bg="azul">
        <Center flexDir="column">
          <CircularProgress
            thickness={16}
            size={6}
            value={(+seconds / timeToSave) * 100}
            color="azul"
          />
          <Text fontSize="xs">{timeToSave - +seconds}s</Text>
        </Center>
      </Tooltip>
      {/* <Text>Cronometro: {seconds}</Text>
      <Text>Now: {toBrFullDate(now)}</Text>
      <Text>lastRender: {toBrFullDate(lastRender)}</Text> */}
    </>
  );
};
