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
import { FaEye, FaIdCard } from "react-icons/fa";
import { Input, Select } from "../global/Select";
import { BsCalendar, BsCardImage, BsEye, BsFilter } from "react-icons/bs";
import { Button, ButtonLink } from "../global/Button";
import {
  format,
  formatDistance,
  formatDistanceStrict,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { colorStatus, translateStatus } from "utils/translateStatus";
import { AlertInpa } from "components/global/Alert";
import { ModalComprovanteDetalhesPagamento } from "components/paciente/sessoes/ModalComprovanteDetalhesPagamento";
import { LoadingInpa } from "components/global/Loading";
import { BASE_URL } from "utils/CONFIG";
import { useFetch } from "hooks/useFetch";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import {
  COUNCIL_STATUS_OBJ,
  STATUS,
  STATUS_OBJ,
  WITHDRAW_STATUS_OBJ,
} from "utils/STATUS";
import { useMyContext } from "contexts/Context";
import { CheckIcon, DownloadIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { toReal } from "utils/toReal";
import { Modal } from "components/global/Modal";
import { toBrDate, toBrFullDate } from "utils/toBrDate";
import { usePut } from "hooks/usePut";

export function Saques() {
  const { user } = useMyContext();
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

  const [limit, setLimit] = useState(20);

  const [filters, setFilters] = useState("");

  const urlFetch = filters
    ? "v1/withdraws" + filters + "&limit=" + limit
    : "v1/withdraws?limit=" + limit;

  const [dataWithdraw, errorWithdraw, isFetchingWithdraw, getWithdraw] =
    useFetch(urlFetch, null, true);

  const { isOpen, onToggle } = useDisclosure();

  const {
    isOpen: isOpenWithdrawDetails,
    onOpen: onOpenWithdrawDetails,
    onClose: onCloseWithdrawDetails,
  } = useDisclosure();

  //2 opcoes, estado com o id do saque selecionado ou o objeto do saque selecionado
  const [selectedWithdraw, setSelectedWithdraw] = useState({} as any);
  const findWithdraw = dataWithdraw?.withdraws?.data?.find(
    (item: any) => item.id === selectedWithdraw.id
  );

  const [
    handlePutWithdraw,
    dataPutWithdraw,
    errorPutWithdraw,
    isPutingWithdraw,
  ] = usePut(`/v1/withdraws/${selectedWithdraw?.id}`);

  const formattedData = dataWithdraw?.withdraws?.data?.map((item: any) => ({
    ...item,
    id: item.id,
    user: {
      ...item.user,
      avatar: item.user?.avatar && item.user.avatar,
    },
    date: {
      iso: item.created_at,
      date: new Date(item.created_at),
      week: format(new Date(item.created_at), "EEEE", {
        locale: ptBR,
      }),
      short: format(new Date(item.created_at), "dd/MM/yy"),
      hourShort: format(new Date(item.created_at), "HH:mm"),
    },
  }));

  function onSubmit(data: any) {
    const query = Object.entries(data)
      .filter((item) => !!item[1])
      .map((item) => `${[item[0]]}=${item[1]}`);
    setFilters(query?.length > 0 ? "?" + query.join("&") : "");
  }

  function handleReproveWithDraw() {
    const reason = prompt(
      "Deseja REPROVAR o saque?, digite qualquer informação adicional"
    );
    if (reason) {
      handlePutWithdraw({ status: "Denied", transactionData: reason });
    }
  }
  function handleApproveWithDraw() {
    const reason = prompt(
      "Deseja APROVAR o saque?, digite qualquer informação adicional"
    );
    if (reason) {
      handlePutWithdraw({ status: "Paid", transactionData: reason });
    }
  }

  useEffect(() => {
    if (user?.id || dataPutWithdraw.status === 200) getWithdraw();
  }, [user, limit, filters, dataPutWithdraw]);

  function Cards() {
    if (errorWithdraw)
      return (
        <AlertInpa
          status="warning"
          text={errorWithdraw.response.data?.error || "Erro ao carregar saques"}
        />
      );

    if (isFetchingWithdraw) return <LoadingInpa />;

    if (filters && dataWithdraw?.data?.length < 1)
      return (
        <Center p={4} w="full" flexDir="column">
          <AlertInpa text="Nenhum saque encontrado com os termos selecionados." />
          <Button
            title="Limpar filtros"
            onClick={() => {
              setFilters("");
              reset();
            }}
          />
        </Center>
      );

    if (formattedData?.length === 0) return <AlertInpa text="Sem saques" />;

    function handleModal(selected: any) {
      setSelectedWithdraw(selected);
      onOpenWithdrawDetails();
    }

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
        <HStack flex={3}>
          <Avatar src={item.user.avatar} w={46} />
          <VStack align="start" lineHeight={1} spacing={0}>
            <Text>{item.user.social_name || item.user.name}</Text>
            {item.user.social_name && (
              <Text fontWeight={400} fontSize={11}>
                ({item.user.name})
              </Text>
            )}
          </VStack>
        </HStack>
        <VStack flex={1}>
          <Text>{item.type}</Text>
          <Text>
            {item.council} {item.number}
          </Text>
        </VStack>
        <VStack flex={1}>
          <Text>{item.date.hourShort}</Text>
          <Text>{item.date.short}</Text>
        </VStack>
        <VStack flex={2}>
          <Text>
            {toReal(item.sub_total)} - {toReal(item.tax)}
          </Text>
          <Text fontSize={16} fontWeight="bold">
            {toReal(item.total)}
          </Text>
        </VStack>
        <Center flex={1}>
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
          p={1}
          justify={{ base: "space-around", sm: "flex-end" }}
          w={120}
          spacing={0}
          direction={["column", "row"]}
          align="center"
        >
          {/*   <ButtonLink
            href={`/psicologo/sessoes/${item.id}`}
            fontSize={14}
            title="Ver sessão"
          /> */}

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
        <Heading fontSize={28}>Saques</Heading>

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
              setValue("date", date ? date.toISOString() : null);
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
            title="Status do Saque"
            placeholder="Selecione"
            values={WITHDRAW_STATUS_OBJ.map((item: any) => item.label)}
            register={{
              ...register("status", {
                setValueAs: (v) =>
                  WITHDRAW_STATUS_OBJ.find((item: any) => item.label === v)
                    ?.value,
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
          </VStack>
        </Wrap>

        <Flex textAlign="center" gap={14} align="center" p={1} w="full" pb={2}>
          <Heading
            flex={3}
            justifyContent="start"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Profissional
          </Heading>
          <Heading
            flex={1}
            display={{ base: "none", md: "flex" }}
            fontSize={18}
            justifyContent="center"
          >
            Solicitado em
          </Heading>
          <Heading
            flex={1}
            justifyContent="center"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Valor
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
              w={110}
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
        <Cards />
      </VStack>

      {dataWithdraw?.meta?.next_page_url && (
        <Button
          title="Ver mais"
          color="azul"
          size="sm"
          onClick={() => setLimit(limit + 20)}
          mt={2}
        />
      )}
      <Modal
        title="Detalhes do Saque"
        isOpen={isOpenWithdrawDetails}
        onClose={onCloseWithdrawDetails}
        size="sm"
      >
        <Wrap justify="space-between" align="center">
          <Button
            disabled={findWithdraw?.status === "Paid"}
            leftIcon={<NotAllowedIcon />}
            title="Reprovar saque"
            size="sm"
            aria-label="Reprovar saque"
            color="vermelho"
            onClick={handleReproveWithDraw}
          />
          <Button
            disabled={findWithdraw?.status === "Paid"}
            leftIcon={<CheckIcon />}
            title="Liberar saque"
            size="sm"
            aria-label="Aprovar"
            color="whatsapp.300"
            onClick={handleApproveWithDraw}
          />
        </Wrap>
        <Heading pt={2} fontSize={22}>
          Serviço
        </Heading>
        <Text>
          Solicitações pendentes: {findWithdraw?.count_withdraws_processing}
        </Text>
        <Text>Subtotal: {toReal(findWithdraw?.sub_total)}</Text>
        <Text>Taxa: {toReal(findWithdraw?.tax)}</Text>
        <Text>
          Total a pagar: <b>{toReal(findWithdraw?.total)}</b>
        </Text>
        <Heading pt={2} fontSize={22}>
          Sessão
        </Heading>
        {findWithdraw?.appointments.map((appoint: any) => {
          console.log(findWithdraw);
          //calculate the distance between the date of the appointment and the current date

          return (
            <VStack spacing={0} pb={2} w="full" align="start" key={appoint.id}>
              <Text>Status: {translateStatus(appoint?.status)}</Text>
              <Text>Data: {toBrFullDate(appoint?.hour)}</Text>
              <Text>
                {formatDistanceStrict(new Date(appoint?.hour), new Date(), {
                  unit: "day",
                  locale: ptBR,
                  addSuffix: true,
                })}
              </Text>
              <Heading pt={2} fontSize={22}>
                Paciente
              </Heading>
              <Text>Nome social: {appoint?.patient?.social_name}</Text>
              <Text>Nome: {appoint?.patient?.name}</Text>
            </VStack>
          );
        })}
        <Heading pt={2} fontSize={22}>
          Profissional
        </Heading>
        <Text>Nome: {findWithdraw?.user?.name}</Text>
        <Text>Doc: {findWithdraw?.user?.doc}</Text>
        <Text>
          Telefone:{" "}
          {`(${findWithdraw?.user?.area_code}) ${findWithdraw?.user?.phone}`}
        </Text>
        <Text>Email: {findWithdraw?.user?.email}</Text>

        <Heading pt={2} fontSize={22}>
          Conta bancária
        </Heading>
        <Text>Conta: {findWithdraw?.bankAccounts?.account}</Text>
        <Text>Tipo: {findWithdraw?.bankAccounts?.type}</Text>
        <Text>Agência: {findWithdraw?.bankAccounts?.agency}</Text>
        <Text>Banco: {findWithdraw?.bankAccounts?.bank_name}</Text>
        <Heading pt={2} fontSize={22}>
          Saque
        </Heading>
        <Text>Solicitado: {toBrFullDate(findWithdraw?.created_at)}</Text>
        <Text>Status: {translateStatus(findWithdraw?.status)}</Text>
      </Modal>
    </Flex>
  );
}
