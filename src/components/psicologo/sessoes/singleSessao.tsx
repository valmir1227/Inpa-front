/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Text,
  Wrap,
  VStack,
  useDisclosure,
  Avatar,
  HStack,
  Tag,
  Spinner,
} from "@chakra-ui/react";

import { Button, ButtonLink } from "../../global/Button";
import { LoadingInpa } from "components/global/Loading";
import { differenceInHours, formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertInpa, AlertInpaCall } from "components/global/Alert";
import { useMyContext } from "contexts/Context";
import { toBrDate0GMT } from "utils/toBrDate";
import { Modal } from "components/global/Modal";
import { useFetch } from "hooks/useFetch";
import { usePost } from "hooks/usePost";
import { BackButton } from "components/global/BackButton";

export function SingleSessao({
  dataAppointment,
  dataParticipants,
  patch,
  cancelAppData,
  router,
}: any) {
  const { user } = useMyContext();
  const { formattedData, data, error, isFetching, isValidating, get } =
    dataAppointment;
  const {
    dataParticipant,
    errorParticipant,
    isFetchingParticipant,
    getParticipant,
  } = dataParticipants;
  const [dataCancelApp, errorCancelApp, isFetchingCancelApp, getCancelApp] =
    useFetch(`/v1/appointments/${router.query.id}/cancel`);

  const [
    handlePost,
    dataCancelAppoinment,
    errorCancelAppoinment,
    isFetchingCancelAppoinment,
  ] = usePost(`/v1/appointments/${data?.id}/cancel/`);

  const { handlePatch, dataPatch, errorPatch, isPatching } = patch;

  const {
    onOpen: onOpenModalCancelApp,
    isOpen: isOpenModalCancelApp,
    onClose: onCloseModalCancelApp,
  } = useDisclosure();

  const hoursLeft = differenceInHours(
    new Date(dataAppointment?.data?.hour),
    new Date()
  );

  const [selectedAppointmentParticipant, setSelectedAppointmentParticipant] =
    useState({} as any);
  const [appointmentParticipants, setAppointmentParticipants] = useState(
    [] as any
  );

  function addAppointmentParticipants(item: any) {
    setAppointmentParticipants((prev: any) => [...prev, item]);
  }

  function handleRemoveParticipant(item: any) {
    setAppointmentParticipants((prev: any) =>
      prev.filter((participant: any) => participant.id !== item.id)
    );
  }

  const arrayOfParticipantsId = appointmentParticipants.map(
    (item: any) => item.id
  );

  function handleCancelAppointment() {
    onOpenModalCancelApp();
    getCancelApp();
  }

  useEffect(() => {
    setAppointmentParticipants(data?.participant_id || []);
  }, [data]);

  useEffect(() => {
    if (dataPatch.status === 200) {
      getParticipant();
      get();
    }
  }, [dataPatch]);

  const hableToCancel = data?.status === "Scheduled";
  const statusMsg = () => {
    if (data.status === "Finished") return "Sessão finalizada";
    if (data.status === "inProgress") return "Sessão em andamento";
    if (data.status === "Canceled") return "Sessão cancelada";
    return "";
  };

  if (isFetching) return <LoadingInpa />;

  if (!isFetching && data.expert_id !== user?.id)
    return <AlertInpa text="Acesso negado" status="warning" />;

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
      <BackButton />
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
        gap={6}
        mt={4}
      >
        <HStack>
          <Heading fontSize={30}>Resumo</Heading>
          {isValidating && <Spinner />}
        </HStack>
        <Wrap justify="space-between" spacing={8} w="full">
          <VStack spacing={5}>
            <Heading fontSize={20}>Paciente</Heading>
            <HStack>
              <Avatar
                ignoreFallback
                src={formattedData.patient.avatar}
                w={100}
                h={100}
              />
              <VStack fontSize={14} spacing={0} textAlign="start" align="start">
                <Text>
                  {formattedData.patient.social_name ||
                    formattedData.patient.name}
                </Text>
                {formattedData.patient.social_name && (
                  <Text fontWeight={400} fontSize={11}>
                    ({formattedData.patient.name})
                  </Text>
                )}
                {/*   {formattedData.expert.councils.map((item: any) => (
                  <Text key={item}>{item}</Text>
                ))}
                <Text>{formattedData.expert.address}</Text> */}
              </VStack>
            </HStack>
          </VStack>

          <VStack spacing={5}>
            <Heading fontSize={20}>Data</Heading>
            <VStack fontSize={12} spacing={0}>
              <Text textTransform="capitalize">
                {formattedData.date.weekShort}
              </Text>
              <Text>{formattedData.date.short}</Text>
            </VStack>
          </VStack>
          <VStack spacing={5}>
            <Heading fontSize={20}>Horário</Heading>
            <Tag px={4} color="white" bg="amarelo">
              <Text fontSize={12}>{formattedData.date.hourShort}</Text>
            </Tag>
          </VStack>

          <VStack fontSize={12} spacing={5}>
            <Heading fontSize={20}>Modalidade</Heading>
            <Text
              textAlign="end"
              sx={{ b: { fontWeight: 500, color: "azul" } }}
            >
              {formattedData.service.name} <br />
              <b>{formattedData.service.location}</b>
            </Text>
          </VStack>

          <VStack fontSize={12} spacing={5}>
            <Heading fontSize={20}>Valor</Heading>
            <Text>{formattedData.service.value}</Text>
          </VStack>
          <VStack fontSize={12} spacing={3}>
            <Heading fontSize={20}>Sessão</Heading>
            <Text>
              {formatDistanceToNowStrict(formattedData.date.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </Text>
            <ButtonLink
              href={`/psicologo/sessoes/${data.id}?online`}
              isDisabled={
                hoursLeft > 1 ||
                hoursLeft < -2 ||
                data?.status === "Canceled" ||
                data?.status === "Reserved"
              }
              title="Iniciar sessão"
            />
            {process.env.NODE_ENV === "development" && (
              <ButtonLink
                href={`/psicologo/sessoes/${data.id}?online`}
                title="Iniciar sessão DEV"
              />
            )}
            {hableToCancel && (
              <Button
                title="Cancelar sessão"
                size="xs"
                variant="ghost"
                color="white"
                textColor="red"
                fontWeight="normal"
                onClick={handleCancelAppointment}
              />
            )}
            <Text
              size="xs"
              variant="ghost"
              color="white"
              textColor="cinza"
              fontWeight="normal"
            >
              {statusMsg()}
            </Text>
          </VStack>
        </Wrap>
      </Flex>
      {formattedData.service.familiar && (
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
          gap={2}
          mt={4}
        >
          <Flex pb={4} align="center" gap={5} w="full" justify="space-between">
            <Heading fontSize={{ base: 20, sm: 30 }}>Participantes</Heading>
          </Flex>
          <Wrap
            justify="space-between"
            align="center"
            borderRadius={20}
            px="1rem"
            w="full"
            fontSize={13}
            fontWeight={500}
            display={{ base: "none", sm: "block" }}
          >
            <Text flex={1}>Nome</Text>
            <Text flex={1}>E-mail</Text>
            <Text flex={1}>Data de nascimento</Text>
            <Text flex={1}>Celular</Text>
            <Text flex={1}>Parentesco</Text>
          </Wrap>
          {appointmentParticipants?.map((participant: any) => {
            return (
              <Wrap
                key={participant.id}
                justify="space-between"
                align="center"
                borderRadius={20}
                bg="bg"
                p="1rem"
                w="full"
                fontSize={12}
                direction={{ base: "column", sm: "row" }}
              >
                <Text flex={1}>{participant.name}</Text>
                <Text flex={1}>{participant.email || "*****"}</Text>
                <Text flex={1}>{toBrDate0GMT(participant?.birthday)}</Text>
                <Text flex={1}>{participant.phone || "*****"}</Text>
                <Text flex={1}>{participant.relationship}</Text>
              </Wrap>
            );
          })}
        </Flex>
      )}
      {/* <Flex gap={4} p={8} w="full" maxW={1200} justify="end">
        <Link href="/" passHref>
          <ChakraButton
            as="a"
            variant="ghost"
            borderRadius="full"
            bg="white"
            alignSelf="start"
            color="cinzaescuro"
            px={5}
          >
            Cancelar
          </ChakraButton>
        </Link>
        <Link href="/paciente/sessoes" passHref>
          <Button
            as="a"
            variant="ghost"
            borderRadius="full"
            alignSelf="start"
            px={8}
            title="Salvar"
          />
        </Link>
      </Flex> */}
      <Modal
        title="Cancelar Sessão"
        isOpen={isOpenModalCancelApp}
        onClose={onCloseModalCancelApp}
      >
        {isFetchingCancelApp && <LoadingInpa />}
        {errorCancelApp && (
          <AlertInpa
            status="warning"
            text={errorCancelApp?.response?.data?.messages["pt-BR"] || "Erro"}
          />
        )}
        {!errorCancelApp && !dataCancelAppoinment.status && (
          <Button
            isLoading={isFetchingCancelAppoinment}
            w="full"
            m={2}
            title="Cancelar a sessão"
            onClick={() =>
              handlePost({
                refundType: "CREDIT",
              })
            }
          />
        )}
        <AlertInpaCall
          success={{
            validate: dataCancelAppoinment.status === 200,
            text: dataCancelAppoinment?.data?.messages["pt-BR"],
          }}
        />
        {/* {dataCancelApp?.allowedOptions?.map((item: any) => {
          return <Button w="full" m={2} title={item} key={item} />;
        })} */}
      </Modal>
    </Flex>
  );
}
