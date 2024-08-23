/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Text,
  Wrap,
  VStack,
  Box,
  useDisclosure,
  Avatar,
  HStack,
  Tag,
  IconButton,
  Spinner,
} from "@chakra-ui/react";

import { Button, ButtonLink } from "../../global/Button";
import { FiX } from "react-icons/fi";
import { Select } from "../../global/Select";
import { ModalAdicionarParticipante } from "./ModalAdicionarParticipante";
import { LoadingInpa } from "components/global/Loading";
import { differenceInHours, formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertInpa, AlertInpaCall } from "components/global/Alert";
import { useMyContext } from "contexts/Context";
import { toBrDate0GMT } from "utils/toBrDate";
import { Modal } from "components/global/Modal";
import { useFetch } from "hooks/useFetch";
import { usePatch } from "hooks/usePatch";
import { usePost } from "hooks/usePost";
import { BackButton } from "components/global/BackButton";

export function SingleSessao({
  dataAppointment,
  dataParticipants,
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

  /* const { handlePatch, dataPatch, errorPatch, isPatching } = patch; */

  const [handlePatch, dataPatch, errorPatch, isPatching] = usePatch(
    `/v1/appointments/${router.query.id}`
  );

  const {
    onOpen: onOpenModalCancelApp,
    isOpen: isOpenModalCancelApp,
    onClose: onCloseModalCancelApp,
  } = useDisclosure();

  const {
    onOpen: onOpenModalAdicionar,
    isOpen: isOpenModalAdicionar,
    onClose: onCloseModalAdicionar,
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
    const merged = [...appointmentParticipants, item];
    setAppointmentParticipants((prev: any) => merged);
    handlePatch({ participantsId: merged.map((item: any) => item.id) });
  }

  function handleRemoveParticipant(item: any) {
    const filtered = appointmentParticipants.filter(
      (participant: any) => participant.id !== item.id
    );
    setAppointmentParticipants(filtered);
    handlePatch({ participantsId: filtered.map((item: any) => item.id) });
  }

  function handleCancelAppointment() {
    onOpenModalCancelApp();
    getCancelApp();
  }

  useEffect(() => {
    setAppointmentParticipants(data?.participant_id || []);
  }, [data]);

  /* useEffect(() => {
    if (dataPatch.status === 200) {
      // getParticipant();
      // get();
      
    }
  }, []); */

  const hableToCancel = data?.status === "Scheduled";
  const statusMsg = () => {
    if (data.status === "Finished") return "Sessão finalizada";
    if (data.status === "inProgress") return "Sessão em andamento";
    if (data.status === "Canceled") return "Sessão cancelada";
    return "";
  };

  if (isFetching) return <LoadingInpa />;
  if (!formattedData?.expert) return null;

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
            <Heading fontSize={20}>Profissional</Heading>
            <HStack>
              <Avatar
                ignoreFallback
                src={formattedData.expert.avatar}
                w={100}
                h={100}
              />
              <VStack fontSize={12} spacing={0} align="start">
                <Text fontSize={15}>{formattedData.expert.name}</Text>
                {formattedData.expert.councils.map((item: any) => (
                  <Text key={item}>{item}</Text>
                ))}
                <Text>{formattedData.expert.address}</Text>
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
              href={`/paciente/sessoes/${data.id}?online`}
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
                href={`/paciente/sessoes/${data.id}?online`}
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
          <Heading
            sx={{ b: { color: "azul" } }}
            pb={6}
            alignSelf="center"
            textAlign="center"
            fontSize={{ base: 14, sm: 18 }}
          >
            Para poder realizar a <b>Psicoterapia Familiar</b> é necessário
            adicionar seus participantes.
          </Heading>
          <Flex pb={4} align="center" gap={5} w="full" justify="space-between">
            <Heading fontSize={{ base: 20, sm: 30 }}>Participantes</Heading>
            <Button
              fontSize={14}
              borderRadius={10}
              title="Adicionar participante"
              onClick={onOpenModalAdicionar}
            />
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
            <Box w={6} />
          </Wrap>
          {appointmentParticipants?.map((item: any) => (
            <Wrap
              key={item.id}
              justify="space-between"
              align="center"
              borderRadius={20}
              bg="bg"
              p="1rem"
              w="full"
              fontSize={12}
              direction={{ base: "column", sm: "row" }}
            >
              <Text flex={1}>{item.name}</Text>
              <Text flex={1}>{item.email || "*****"}</Text>
              <Text flex={1}>{toBrDate0GMT(item?.birthday)}</Text>
              <Text flex={1}>{item.phone || "*****"}</Text>
              <Text flex={1}>{item.relationship}</Text>
              <IconButton
                size="xs"
                aria-label="Remover participante"
                variant="ghost"
                onClick={() => handleRemoveParticipant(item)}
              >
                <FiX color="#f00f0077" />
              </IconButton>
            </Wrap>
          ))}
          <VStack mt={6} align="end" alignSelf="end">
            <Text fontSize={18} fontWeight={500}>
              Deseja adicionar algum perfil já vinculado?
            </Text>
            <Select
              values={
                dataParticipant?.map(
                  (item: any) => `${item.name} (${item.relationship})`
                ) || []
              }
              title="Perfil(s) vinculado(s):"
              maxW={200}
              titleColor="cinza"
              variant="outline"
              size="sm"
              placeholder="Selecione"
              onChange={(e) => {
                const participantObject = dataParticipant.find((item: any) =>
                  e.target.value.includes(item.name)
                );
                return setSelectedAppointmentParticipant(participantObject);
              }}
            />
            <Wrap>
              <Button
                onClick={() =>
                  addAppointmentParticipants(selectedAppointmentParticipant)
                }
                disabled={
                  appointmentParticipants.includes(
                    selectedAppointmentParticipant
                  ) || !selectedAppointmentParticipant?.id
                }
                title="Adicionar"
                borderRadius={6}
              />
            </Wrap>
            <AlertInpaCall
              error={{
                validate: errorPatch,
                text: errorPatch?.response?.data?.messages["pt-BR"],
              }}
              success={{
                validate: dataPatch.status === 200,
                text: "Participantes atualizados",
              }}
            />
          </VStack>
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
      <ModalAdicionarParticipante
        isOpen={isOpenModalAdicionar}
        onClose={onCloseModalAdicionar}
        get={getParticipant}
        addAppointmentParticipants={addAppointmentParticipants}
      />
      <Modal
        title="Cancelar Sessão"
        isOpen={!!isOpenModalCancelApp}
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
            title="Cancelar a sessão e receber saldo de volta"
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
