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
} from "@chakra-ui/react";

import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { Input, Select } from "../global/Select";
import { BsCalendar, BsFilter } from "react-icons/bs";
import { Button, ButtonLink } from "../global/Button";
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

export function Carteira() {
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
      date: null,
    },
  } as any);

  const [limit, setLimit] = useState(10);

  const [filters, setFilters] = useState("");

  const urlFetch = filters
    ? "v1/appointments?enterprise=true" + filters + "&limit=" + limit
    : "v1/appointments?enterprise=true&limit=" + limit;

  const [
    dataAppointment,
    errorAppointment,
    isFetchingAppointment,
    getAppointment,
  ] = useFetch(urlFetch, null, true);

  const { isOpen, onToggle } = useDisclosure();
  const {
    isOpen: isOpenPagamento,
    onOpen: onOpenPagamento,
    onClose: onClosePagamento,
  } = useDisclosure();

  const [selectedAppointment, setSelectedAppointment] = useState({} as any);

  function handleModal(selected: any) {
    setSelectedAppointment(selected);
    onOpenPagamento();
  }

  const formattedData = dataAppointment?.data?.map((item: any) => ({
    ...item,
    id: item.id,
    patient: {
      ...item.patient,
      avatar: item.patient.avatar && item.patient.avatar,
    },
    expert: {
      ...item.expert,
      avatar: item.expert.avatar && item.expert.avatar,
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

  useEffect(() => {
    if (user?.id) getAppointment();
  }, [user, limit, filters]);

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
      return <AlertInpa text="Seus usuários não possuem sessões agendadas" />;

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
        <HStack flex={2.5}>
          <Avatar src={item.patient.avatar} w={46} />
          <VStack textAlign="start" align="start" lineHeight={1} spacing={0}>
            <Text>{item.patient.social_name || item.patient.name}</Text>
            {item.patient.social_name && (
              <Text fontWeight={400} fontSize={11}>
                ({item.patient.name})
              </Text>
            )}
          </VStack>
        </HStack>
        <HStack flex={2.5}>
          <Avatar src={item.expert.avatar} w={46} />
          <VStack textAlign="start" align="start" lineHeight={1} spacing={0}>
            <Text>{item.expert.social_name || item.expert.name}</Text>
            {item.expert.social_name && (
              <Text fontWeight={400} fontSize={11}>
                ({item.expert.name})
              </Text>
            )}
          </VStack>
        </HStack>
        <VStack flex={1}>
          <Text>{item.date.week}</Text>
          <Text>{item.date.short}</Text>
        </VStack>
        <Text flex={1}>{item.date.hourShort}</Text>
        <Center flex={1} w={100}>
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
        <Wrap
          flex={1.2}
          p={1}
          justify={{ base: "space-around", sm: "flex-end" }}
          spacing={{ base: 2, sm: 16 }}
          direction={["column", "row"]}
          align="center"
        >
          {/*   <ButtonLink
            href={`/psicologo/sessoes/${item.id}`}
            fontSize={14}
            title="Ver sessão"
          /> */}
          {/* <IconButton
            icon={<FaEye />}
            onClick={() => handleModal(item)}
            // alignSelf={{ base: "center", md: "flex-end" }}
            size="sm"
            aria-label="Ver detalhes"
            variant="ghost"
            color="cinza"
          /> */}
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
        <Heading fontSize={28}>Sessões (Histórico de uso dos créditos)</Heading>

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
            selected={watch("date") ? new Date(watch("date")) : null}
            // selected={getValues("date")}
            onChange={(date: any) => {
              setValue("date", date ? startOfDay(date).toISOString() : null);
            }}
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
            icon={<BsCalendar color="white" />}
            register={{ ...register("date") }}
            autoComplete="off"
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
            flex={2.5}
            justifyContent="start"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Usuário
          </Heading>
          <Heading
            flex={2.5}
            justifyContent="start"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Profissional
          </Heading>

          <Heading
            flex={1}
            justifyContent="center"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Data
          </Heading>
          <Heading
            flex={1}
            justifyContent="center"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Horário
          </Heading>
          <Heading
            flex={1}
            justifyContent="center"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Status
          </Heading>

          {filters ? (
            <Button
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
      {selectedAppointment?.id && (
        <ModalComprovanteDetalhesPagamento
          selectedAppointment={selectedAppointment}
          onOpen={onOpenPagamento}
          isOpen={isOpenPagamento}
          onClose={onClosePagamento}
          type="expert"
        />
      )}
      {dataAppointment?.meta?.next_page_url && (
        <Button
          title="Ver mais"
          color="azul"
          size="sm"
          onClick={() => setLimit(limit + 10)}
          mt={2}
        />
      )}
    </Flex>
  );
}
