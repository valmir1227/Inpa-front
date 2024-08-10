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
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";

import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { Input, Select } from "../global/Select";
import { BsCalendar, BsFilter } from "react-icons/bs";
import { Button, ButtonLink } from "../global/Button";
import { differenceInDays, format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { colorStatus, translateStatus } from "utils/translateStatus";
import { AlertInpa } from "components/global/Alert";
import { ModalComprovanteDetalhesPagamento } from "components/paciente/sessoes/ModalComprovanteDetalhesPagamento";
import { LoadingInpa } from "components/global/Loading";
import { BASE_URL, DAYS_UNTIL_WITHDRAW } from "utils/CONFIG";
import { toReal } from "utils/toReal";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { STATUS, STATUS_OBJ } from "utils/STATUS";
import { toBrDate, toBrFullDate } from "utils/toBrDate";

export function Sessoes() {
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

  const urlFetch = filters
    ? "v1/appointments?admin=true" + filters + "&limit=" + limit
    : "v1/appointments?admin=true&limit=" + limit;

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

  const {
    isOpen: isOpenSaque,
    onOpen: onOpenSaque,
    onClose: onCloseSaque,
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
    function handleSaque(item: any) {
      onOpenSaque();
      setSelectedAppointment(item);
    }
    if (errorAppointment)
      return (
        <AlertInpa
          status="warning"
          text={
            errorAppointment?.response?.data?.error ||
            "Erro ao carregar sessões"
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
      return (
        <AlertInpa text="Nenhuma sessão encontrada com a data selecionada" />
      );

    return formattedData?.map((item: any) => {
      const taxa = item.service_value - item.net_liquid;

      const waitMoreDays =
        differenceInDays(new Date(), item.date.date) > DAYS_UNTIL_WITHDRAW;
      const notFinished =
        item.status !== "Finished" &&
        item.status !== "Finished(auto)" &&
        item.status !== "Absent(auto)";
      const canceled =
        item.status === "Canceled" || item.status === "Absent(auto)";
      const alreadyDraw = item.withdraw_status === "Withdrawn completed";
      const pending = item.withdraw_status === "Withdraw in progress";
      const shouldWithdraw =
        waitMoreDays && !notFinished && !alreadyDraw && !pending && !canceled;
      const reasonToDeny = () => {
        if (canceled) return "Sessão cancelada";
        if (alreadyDraw) return "Saque já realizado";
        if (pending) return "Saque em análise";
        if (!waitMoreDays)
          return `Prof poderá sacar em: 
          ${differenceInDays(item.date.date, new Date()) + DAYS_UNTIL_WITHDRAW}
          dias`;

        if (notFinished) return "A sessão ainda não foi finalizada";
      };
      /* console.log(
        "differenceInDays",
        differenceInDays(new Date(), item.date.date)
      ); */
      return (
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
          spacing={{ base: 4, md: 8 }}
          borderBottomWidth={1}
          direction={["column", "row"]}
        >
          <VStack>
            <HStack>
              <Avatar src={item.expert.avatar} w={46} />
              <VStack
                textAlign="start"
                align="start"
                w={170}
                lineHeight={1}
                spacing={0}
              >
                <Text>Prof: {item.expert.social_name || item.expert.name}</Text>
                {item.expert.social_name && (
                  <Text fontWeight={400} fontSize={11}>
                    ({item.expert.name})
                  </Text>
                )}
              </VStack>
            </HStack>
            <HStack>
              <Avatar src={item.patient.avatar} w={46} />
              <VStack
                textAlign="start"
                align="start"
                w={170}
                lineHeight={1}
                spacing={0}
              >
                <Text>
                  Paciente: {item.patient.social_name || item.patient.name}
                </Text>
                {item.patient.social_name && (
                  <Text fontWeight={400} fontSize={11}>
                    ({item.patient.name})
                  </Text>
                )}
              </VStack>
            </HStack>
          </VStack>
          <VStack spacing={0} w="80px">
            <Text>{item.date.week}</Text>
            <Text>{item.date.short}</Text>

            <Text w="60px">{item.date.hourShort}</Text>
          </VStack>
          <Center gap={1} w={44} flexDir="column">
            <Wrap align="center">
              <Text fontSize="xs">{toReal(item.service_value)}</Text> -
              <Text fontSize="xs">{toReal(taxa)}</Text>
            </Wrap>
            <Text w="60px" fontWeight={700}>
              {toReal(item.net_liquid)}
            </Text>
            <Tag
              color="white"
              bg={colorStatus(item.status)}
              p={2}
              fontSize={12}
              fontWeight={400}
            >
              {translateStatus(item.status)}
            </Tag>
            {item.withdraw_status && (
              <Tag
                color="white"
                bg={colorStatus(item.withdraw_status)}
                p={2}
                fontSize={12}
                fontWeight={400}
              >
                {translateStatus(item.withdraw_status)}
              </Tag>
            )}
            <Text fontWeight="normal" fontSize={12}>
              {reasonToDeny()}
            </Text>
          </Center>

          <Wrap
            flex={1}
            p={1}
            w="full"
            justify={{ base: "space-around", sm: "flex-end" }}
            spacing={{ base: 2, sm: 8 }}
            direction={["column", "row"]}
            align="center"
          >
            <VStack w="full" maxW={250}>
              <Accordion w="full" allowToggle>
                <AccordionItem border={0}>
                  <AccordionButton>
                    <AccordionIcon />
                    <Box as="span" flex="1" textAlign="left">
                      status: {item.order.transaction_data.status}
                    </Box>
                  </AccordionButton>
                  <AccordionPanel textAlign="start" pb={4}>
                    <Text>type: {item?.billing_type}</Text>
                    <Text>
                      method:{" "}
                      {item.order.transaction_data?.charges[0]?.payment_method}
                    </Text>
                    <Text>id-gat: {item.order.transaction_data.id}</Text>
                    <Text>id-inpa: {item.order_id}</Text>
                    <Text>code: {item.order.transaction_data.code}</Text>
                    <Text>
                      created_at:{" "}
                      {toBrFullDate(item.order.transaction_data.created_at)}
                    </Text>
                    <Text>
                      closed_at:{" "}
                      {toBrFullDate(item.order.transaction_data.closed_at)}
                    </Text>
                    <Text>
                      updated_at:{" "}
                      {toBrFullDate(item.order.transaction_data.updated_at)}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
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
        </Wrap>
      );
    });
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
        <Heading fontSize={28}>Sessões</Heading>

        <Wrap
          hidden={isOpen}
          align="flex-end"
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
          {/* <VStack maxW={600} w="full" align="flex-end">
            <HStack align="flex-end" w="full" maxW={600} spacing={0}>
              <Input
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
          </VStack> */}
          <Button
            type="submit"
            fontSize={14}
            lineHeight={1}
            px={8}
            borderRadius={6}
            color="amarelo"
            textColor="white"
            colorScheme="none"
            title="Pesquisar"
          />
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
        </Wrap>

        <Flex textAlign="center" gap={10} align="center" p={1} w="full" pb={2}>
          {/* <Heading
            w={220}
            justifyContent="start"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Usuários
          </Heading>
          <Heading
            w="60px"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
            justifyContent="center"
          >
            Data
          </Heading>
          <Heading
            justifyContent="center"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Horário
          </Heading>
          <Heading
            justifyContent="center"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Valor
          </Heading> */}
          {/* <ChakraButton
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
          </ChakraButton> */}
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
      </VStack>
      {selectedAppointment?.id && (
        <ModalComprovanteDetalhesPagamento
          selectedAppointment={selectedAppointment}
          onOpen={onOpenPagamento}
          isOpen={isOpenPagamento}
          onClose={onClosePagamento}
          type="expert"
          admin
          getAppointment={getAppointment}
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
