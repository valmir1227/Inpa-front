/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Text,
  Wrap,
  VStack,
  Box,
  Image,
  Modal,
  ModalContent,
  useDisclosure,
  ModalOverlay,
  ModalCloseButton,
  Avatar,
  HStack,
  Tag,
  IconButton,
  Stack,
  Slide,
  Button as ChakraButton,
  Center,
  Spinner,
} from "@chakra-ui/react";

import Link from "next/link";
import { DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import { FaCreditCard, FaEye, FaRemoveFormat } from "react-icons/fa";
import { ModalAlterarParcelas } from "../checkout/ModalAlterarParcelas";
import { useMyContext } from "../../../contexts/Context";
import Router from "next/router";
import { Input, Select } from "../../global/Select";
import { FiFilter, FiToggleRight } from "react-icons/fi";
import { BsCalendar, BsEye, BsFilter } from "react-icons/bs";
import { Button, ButtonLink } from "../../global/Button";
import { ModalComprovanteDetalhesPagamento } from "./ModalComprovanteDetalhesPagamento";
import { dateToDbDate, toBrDate } from "utils/toBrDate";
import { AlertInpa } from "components/global/Alert";
import { format, startOfDay, toDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LoadingInpa } from "components/global/Loading";
import { colorStatus, translateStatus } from "utils/translateStatus";
import { BASE_URL } from "utils/CONFIG";
import { useFetch } from "hooks/useFetch";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { STATUS, STATUS_OBJ } from "utils/STATUS";
import { ModalPagamentoComPix } from "../checkout/ModalPagamentoComPix";

export function Sessoes() {
  const {
    user,
    onOpenPagamentoComPix,
    isOpenPagamentoComPix,
    onClosePagamentoComPix,
  } = useMyContext();
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

  const [limit, setLimit] = useState(10);

  const [filters, setFilters] = useState("");

  const urlFetch = filters
    ? "v1/appointments?patient=true" + filters + "&limit=" + limit
    : "v1/appointments?patient=true&limit=" + limit;

  const [data, error, isFetching, get] = useFetch(urlFetch, null, true);

  function onSubmit(data: any) {
    const query = Object.entries(data)
      .filter((item) => !!item[1])
      .map((item) => `${[item[0]]}=${item[1]}`);
    setFilters(query?.length > 0 ? "&" + query.join("&") : "");
  }

  useEffect(() => {
    if (user?.id) get();
  }, [user, limit, filters]);

  // const today = new Date();
  // const [aPartirDe, setAPartirDe] = useState(today);
  // const { onOpen, isOpen, onClose } = useDisclosure();
  // const { onOpenAgendamentoConcluido } = useMyContext();

  // function handleAgendar() {
  //   onOpenAgendamentoConcluido();
  //   setEtapaAgendamento("concluido");
  // }

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
  function handleModalPix(selected: any) {
    setSelectedAppointment(selected);
    onOpenPagamentoComPix();
  }

  const Session = () => {
    if (error)
      return (
        <AlertInpa
          status="warning"
          text={error.response.data.error || "Erro ao carregar sessões"}
        />
      );

    if (isFetching) return <LoadingInpa />;
    if (filters && data?.data?.length < 1)
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

    if (error?.response.status === 404 || data?.data?.length === 0)
      return <AlertInpa text="Você não possui sessões agendadas" />;

    return data?.data
      ?.sort((a: any, b: any) => Date.parse(a.hour) - Date.parse(b.hour))
      .map((item: any) => {
        const userPhoto = item.expert?.avatar && item.expert?.avatar;

        return (
          <Wrap
            key={item.id}
            px={{ base: 2, md: "2rem" }}
            pb="10px"
            pt="14px"
            _hover={{ bg: "bg" }}
            align="center"
            textAlign="center"
            fontSize={13}
            fontWeight={500}
            w="full"
            spacing={{ base: 4, md: 16 }}
            borderBottomWidth={1}
            direction={{ base: "column", sm: "row" }}
          >
            <VStack w="120px">
              <Avatar src={userPhoto} w={46} />
              <Text>{item.expert.name}</Text>
            </VStack>
            <VStack w="80px">
              <Text textTransform="capitalize">
                {format(new Date(item.hour), "eeee", { locale: ptBR })}
              </Text>
              <Text>{toBrDate(item.hour)}</Text>
            </VStack>
            <Text w="60px">
              {new Date(item.hour).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            <VStack w="80px">
              <Text textTransform="capitalize" color="azul">
                {item.service_name}
              </Text>
              {/* <Text textTransform="capitalize" color="azul">
                {item.location}
              </Text> */}
            </VStack>
            <VStack flex={1} align="start">
              <Wrap p={1} w="full" justify="space-between" align="center">
                <Center gap={2} w={130} flexDir="column">
                  <Tag
                    bg={colorStatus(item.status)}
                    p={2}
                    fontSize={12}
                    fontWeight={400}
                    color="white"
                  >
                    {translateStatus(item.status)}
                  </Tag>
                  {item?.order?.transaction_data?.charges[0]?.last_transaction
                    ?.qr_code &&
                    item.status === "Reserved" && (
                      <Button
                        onClick={() => handleModalPix(item)}
                        size="xs"
                        title="QR CODE"
                      />
                    )}
                </Center>

                <ButtonLink
                  href={`/paciente/sessoes/${item.id}`}
                  fontSize={14}
                  title="Ver sessão"
                />
                <IconButton
                  icon={<FaEye />}
                  onClick={() => handleModal(item)}
                  // alignSelf={{ base: "center", md: "flex-end" }}
                  size="sm"
                  aria-label="Ver detalhes"
                  variant="ghost"
                  color="cinza"
                />
              </Wrap>
            </VStack>
          </Wrap>
        );
      });
  };

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
        bg="azul"
        color="white"
        borderTopRadius={20}
        borderWidth={1}
        align="start"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir="column"
        gap={6}
        mt={4}
      >
        <Heading fontSize={28}>Minhas sessões</Heading>

        <Wrap
          hidden={!isOpen}
          align="center"
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
          />
          <Select
            placeholder="Selecione"
            maxW={200}
            title="Status da sessão"
            values={STATUS}
            register={{
              ...register("status", {
                setValueAs: (v) =>
                  STATUS_OBJ.find((item: any) => item.label === v)?.value,
              }),
            }}
          />
          <HStack align="flex-end" w="full" maxW={600} spacing={0}>
            <Input
              register={{ ...register("name") }}
              borderEndRadius={0}
              color="cinza"
              title="Nome do profissional"
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
        </Wrap>

        <Flex textAlign="center" gap={16} align="center" p={1} w="full">
          <Heading
            justifyContent="center"
            w="120px"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Profissional
          </Heading>
          <Heading
            w="80px"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
            justifyContent="center"
          >
            Data
          </Heading>
          <Heading
            justifyContent="center"
            w="60px"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Horário
          </Heading>
          <Heading
            justifyContent="center"
            w="80px"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Atendimento
          </Heading>
          <ChakraButton
            ml="auto"
            justifySelf="flex-end"
            onClick={onToggle}
            mb={1}
            alignSelf="flex-end"
            color="white"
            colorScheme="blackAlpha"
            variant="ghost"
            rightIcon={<BsFilter />}
          >
            Filtros
          </ChakraButton>
          {filters && (
            <Button
              color="cinza"
              size="sm"
              title="Limpar filtros"
              onClick={() => {
                setFilters("");
                reset();
              }}
            />
          )}
        </Flex>
      </Flex>
      <VStack
        pt="1rem"
        bg="white"
        maxW={1200}
        w="full"
        align="start"
        spacing={0}
      >
        <Session />
      </VStack>
      {selectedAppointment?.id && (
        <ModalComprovanteDetalhesPagamento
          selectedAppointment={selectedAppointment}
          onOpen={onOpenPagamento}
          isOpen={isOpenPagamento}
          onClose={onClosePagamento}
          type="patient"
        />
      )}
      {data?.meta?.next_page_url && (
        <Button
          title="Ver mais"
          color="azul"
          size="sm"
          onClick={() => setLimit(limit + 10)}
          mt={2}
        />
      )}
      <ModalPagamentoComPix
        onOpen={onOpenPagamentoComPix}
        isOpen={isOpenPagamentoComPix}
        onClose={onClosePagamentoComPix}
        orderData={{ dataOrder: { data: selectedAppointment } }}
      />
    </Flex>
  );
}
