/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Text,
  Wrap,
  VStack,
  useDisclosure,
  HStack,
  Tag,
  IconButton,
  Button as ChakraButton,
  Center,
  Avatar,
  Spinner,
} from "@chakra-ui/react";

import Link from "next/link";
import { FaEye, FaFileMedical, FaNotesMedical } from "react-icons/fa";
import { Input, Select } from "../../global/Select";
import { BsCalendar, BsFilter, BsRecord } from "react-icons/bs";
import { Button, ButtonLink } from "../../global/Button";
import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { colorStatus, translateStatus } from "utils/translateStatus";
import { AlertInpa } from "components/global/Alert";
import { ModalComprovanteDetalhesPagamento } from "components/paciente/sessoes/ModalComprovanteDetalhesPagamento";
import { LoadingInpa } from "components/global/Loading";
import { BASE_URL } from "utils/CONFIG";
import { useFetch } from "hooks/useFetch";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { STATUS, STATUS_OBJ } from "utils/STATUS";
import { useMyContext } from "contexts/Context";
import useSWR from "swr";
import { fetcher } from "utils/api";
import { RiHealthBookLine, RiRegisteredFill } from "react-icons/ri";
import { Modal } from "components/global/Modal";
import { Timeline } from "../TimeLine";

export function Sessoes({ appointmentData }: any) {
  const { user } = useMyContext();
  const today = new Date();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: today,
    },
  } as any);

  const [limit, setLimit] = useState(20);

  const [filters, setFilters] = useState("");
  1;

  const urlFetch = filters
    ? "v1/appointments?expert=true" + filters + "&limit=" + limit
    : "v1/appointments?expert=true&limit=" + limit;

  const {
    data: dataAppointment,
    error: errorAppointment,
    isLoading: isFetchingAppointment,
    isValidating,
  } = useSWR(urlFetch, fetcher, { refreshInterval: 1000 * 60 * 10 }) as any; //10min

  const { isOpen, onToggle } = useDisclosure();

  const {
    isOpen: isOpenPagamento,
    onOpen: onOpenPagamento,
    onClose: onClosePagamento,
  } = useDisclosure();

  const {
    isOpen: isOpenTimeline,
    onOpen: onOpenTimeline,
    onClose: onCloseTimeline,
  } = useDisclosure();

  const [selectedAppointment, setSelectedAppointment] = useState({} as any);

  function handleModalPaymentDetails(selected: any) {
    setSelectedAppointment(selected);
    onOpenPagamento();
  }
  function handleModalTimeline(selected: any) {
    setSelectedAppointment(selected);
    onOpenTimeline();
  }

  const formattedData = dataAppointment?.data?.map((item: any) => ({
    ...item,
    id: item.id,
    patient: {
      ...item.patient,
      avatar: item.patient.avatar && item.patient.avatar,
    },
    expert: {
      name: item.expert.name,
    },
    date: {
      iso: item.hour,
      date: new Date(item.hour),
      week: format(new Date(item.hour), "EEEE", {
        locale: ptBR,
      }),
      short: format(new Date(item.hour), "dd/MM"),
      hourShort: format(new Date(item.hour), "HH:mm"),
    },
  }));

  function onSubmit(data: any) {
    const query = Object.entries(data)
      .filter((item) => !!item[1])
      .map((item) => `${[item[0]]}=${item[1]}`);
    setFilters(query?.length > 0 ? "&" + query.join("&") : "");
  }

  /* useEffect(() => {
    if (user?.id) getAppointment();
  }, [user, limit, filters]); */

  function Appointments() {
    if (errorAppointment)
      return (
        <AlertInpa
          status="warning"
          text={
            errorAppointment.response.data?.error || "Erro ao carregar sessões"
          }
        />
      );

    if (isFetchingAppointment) return <LoadingInpa />;

    if (filters && dataAppointment?.data?.length < 1)
      return (
        <Center p={4} w="full" flexDir="column">
          <AlertInpa text="Nenhuma sessão encontrada com os termos selecionados." />
          <Button
            title="Limpar filtros"
            onClick={() => {
              setFilters("");
              reset();
            }}
          />
        </Center>
      );

    if (formattedData?.length === 0)
      return <AlertInpa text="Você não possui sessões agendadas" />;

    return formattedData?.map((item: any) => (
      <Wrap
        key={item.id}
        borderColor="cinza"
        px={{ base: 2, md: "2rem" }}
        pb="10px"
        pt="14px"
        _hover={{ bg: "bg" }}
        align="center"
        textAlign="center"
        fontSize={13}
        fontWeight={500}
        w="full"
        spacing={{ base: 4, md: 14 }}
        borderBottomWidth={1}
        direction={["column", "row"]}
      >
        <HStack>
          <Avatar src={item.patient.avatar} w={46} ignoreFallback />
          <VStack
            textAlign="start"
            align="start"
            w={200}
            lineHeight={1}
            spacing={0}
          >
            <Text>{item.patient.social_name || item.patient.name}</Text>
            {item.patient.social_name && (
              <Text fontWeight={400} fontSize={11}>
                ({item.patient.name})
              </Text>
            )}
          </VStack>
        </HStack>
        <VStack w="100px">
          <Text>{item.date.week}</Text>
          <Text>{item.date.short}</Text>
        </VStack>
        <VStack w="80px">
          <Text w="80px">{item.service_name}</Text>
          <Text w="80px">{item.date.hourShort}</Text>
        </VStack>
        <Wrap
          flex={1}
          p={1}
          w="full"
          justify={{ base: "space-around", sm: "flex-end" }}
          spacing={{ base: 2, sm: 16 }}
          direction={["column", "row"]}
          align="center"
        >
          <Center w={120}>
            <Tag
              color="white"
              bg={colorStatus(item.status)}
              p={2}
              fontSize={12}
              fontWeight={400}
            >
              {translateStatus(item.status)}
            </Tag>
          </Center>
          <ButtonLink
            href={`/psicologo/sessoes/${item.id}`}
            fontSize={14}
            title="Ver sessão"
          />
          <HStack>
            <IconButton
              icon={<FaNotesMedical />}
              onClick={() => handleModalTimeline(item)}
              size="sm"
              aria-label="Ver prontuario"
              variant="ghost"
              color="cinza"
            />
            <IconButton
              icon={<FaEye />}
              onClick={() => handleModalPaymentDetails(item)}
              size="sm"
              aria-label="Ver detalhes"
              variant="ghost"
              color="cinza"
            />
          </HStack>
        </Wrap>
      </Wrap>
    ));
  }

  return (
    <Flex
      bg="#f5f5f5"
      flexDir="column"
      as="section"
      justify="center"
      align="center"
      w="100%"
      gap={0}
      pb={6}
    >
      <Flex
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        p={{ base: "1rem 1rem 0px", md: "2rem 2rem 0px" }}
        bg="white"
        borderTopRadius={20}
        borderWidth={1}
        borderColor="cinza"
        align="start"
        maxW={1100}
        w="full"
        justify="space-between"
        flexDir="column"
        gap={6}
        mt={4}
      >
        <Heading fontSize={28}>
          Minhas sessões {isValidating && <Spinner />}
        </Heading>
        <Wrap
          hidden={!isOpen}
          align="start"
          p={1}
          w="full"
          justify="space-between"
          overflow="visible"
        >
          <Input
            zIndex={5}
            maxW={150}
            title="A partir do dia"
            id="date"
            bg="amarelo"
            color="white"
            _focus={{ bg: "amarelo" }}
            _hover={{ bg: "amarelogradient1" }}
            // placeholderText="Data de nascimento"
            as={DatePicker}
            selected={new Date(watch("date"))}
            // selected={getValues("date")}
            onChange={(date: any) => {
              setValue("date", startOfDay(date).toISOString());
            }}
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
            icon={<BsCalendar color="white" />}
            register={{ ...register("date") }}
            labelColor="cinza"
          />
          <Select
            bg="white"
            borderColor="cinza"
            borderWidth={1}
            titleColor="cinza"
            color="cinza"
            maxW={200}
            title="Status da sessão"
            placeholder="Selecione"
            values={STATUS}
            register={{
              ...register("status", {
                setValueAs: (v) =>
                  STATUS_OBJ.find((item: any) => item.label === v)?.value,
              }),
            }}
          />
          <VStack maxW={600} w="full" align="flex-end">
            <HStack align="flex-end" w="full" maxW={600} spacing={0}>
              <Input
                register={{ ...register("name") }}
                bg="white"
                borderColor="cinza"
                labelColor="cinza"
                borderEndRadius={0}
                borderWidth={1}
                borderRightWidth={0}
                title="Nome do paciente"
                type="search"
              />
              <Button
                type="submit"
                fontSize={14}
                lineHeight={1}
                px={8}
                borderRadius={6}
                borderStartRadius={0}
                color="amarelo"
                textColor="white"
                colorScheme="none"
                title="Pesquisar"
              />
            </HStack>
          </VStack>
        </Wrap>
        <Flex textAlign="center" gap={14} align="center" p={1} w="full" pb={2}>
          <Heading
            justifyContent="start"
            w={250}
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Paciente
          </Heading>
          <Heading
            w={100}
            display={{ base: "none", md: "flex" }}
            fontSize={18}
            justifyContent="center"
          >
            Data
          </Heading>
          <Heading
            justifyContent="center"
            w="75px"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Horário
          </Heading>
          <Heading
            justifyContent="center"
            w="135px"
            textAlign="left"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Status
          </Heading>

          {filters ? (
            <Button
              ml="auto"
              color="cinza"
              size="sm"
              title="Limpar filtros"
              onClick={() => {
                setFilters("");
                reset();
              }}
            />
          ) : (
            <ChakraButton
              ml="auto"
              justifySelf="flex-end"
              onClick={onToggle}
              mb={1}
              alignSelf="flex-end"
              color="cinza"
              colorScheme="blackAlpha"
              variant="ghost"
              rightIcon={<BsFilter />}
            >
              Filtros
            </ChakraButton>
          )}
        </Flex>
      </Flex>
      <VStack
        bg="white"
        maxW={1100}
        w="full"
        align="start"
        spacing={0}
        borderX="1px"
        borderColor="cinza"
      >
        <Appointments />
        {/*  <Wrap
          borderColor="cinza"
          px={{ base: 2, md: "2rem" }}
          pb="10px"
          pt="14px"
          _hover={{ bg: "bg" }}
          align="center"
          textAlign="center"
          fontSize={13}
          fontWeight={500}
          w="full"
          spacing={{ base: 4, md: 14 }}
          borderBottomWidth={1}
          direction={["column", "row"]}
        >
          <Text w="110px">Uilson Moreira</Text>
          <VStack w="80px">
            <Text>Terça-feira</Text>
            <Text>15/07/2020</Text>
          </VStack>
          <Text w="80px">18:00</Text>
          <Wrap
            flex={1}
            p={1}
            w="full"
            justify={{ base: "space-around", sm: "flex-end" }}
            spacing={{ base: 2, sm: 16 }}
            direction={["column", "row"]}
            align="center"
          >
            <Center w={100}>
              <Tag bg="#FDBBB5" p={2} fontSize={12} fontWeight={400}>
                Realizado
              </Tag>
            </Center>
            <Button maxW={200} fontSize={14} title="Iniciar Sessão" />
            <Link href="/psicologo/sessoes/sessao-de-teste" passHref>
              <IconButton
                as="a"
                alignSelf="center"
                size="xs"
                aria-label="Ver detalhes"
                variant="ghost"
                color="cinza"
              >
                <FaEye />
              </IconButton>
            </Link>
          </Wrap>
        </Wrap> */}
      </VStack>
      <Modal
        p={0}
        isCentered={false}
        size="4xl"
        isOpen={isOpenTimeline}
        onClose={onCloseTimeline}
      >
        <MedicalRecords selectedAppointment={selectedAppointment} />
      </Modal>
      {selectedAppointment?.id && (
        <ModalComprovanteDetalhesPagamento
          selectedAppointment={selectedAppointment}
          onOpen={onOpenPagamento}
          isOpen={isOpenPagamento}
          onClose={onClosePagamento}
          type="expert"
          records={true}
        />
      )}
      {dataAppointment?.meta?.next_page_url && (
        <Button
          title="Ver mais"
          color="azul"
          size="sm"
          onClick={() => setLimit(limit + 50)}
          mt={2}
        />
      )}
    </Flex>
  );
}

const MedicalRecords = ({ selectedAppointment }: any) => {
  const patientName =
    selectedAppointment?.patient?.social_name ||
    selectedAppointment?.patient?.name;
  const { data, isLoading, isValidating, error, mutate } = useSWR(
    "/v1/medicalrecords?patientId=" + selectedAppointment.patient_id,
    fetcher
  );

  if (isLoading) return <LoadingInpa />;
  if (!data?.data?.length)
    return (
      <AlertInpa
        w="full"
        text="Nenhum prontuário encontrado para este paciente"
      />
    );

  return (
    <Wrap justify="center" p={0} w="full">
      <Avatar
        src={selectedAppointment.patient.avatar}
        w={33}
        h={33}
        ignoreFallback
      />
      <Text fontSize={20}>
        Prontuário de <b>{patientName}</b>
      </Text>
      {(isLoading || isValidating) && <Spinner />}
      <Timeline data={data.data} getMedicalRecords={mutate} />
    </Wrap>
  );
};
