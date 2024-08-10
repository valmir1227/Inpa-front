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
import { LoadingInpa } from "components/global/Loading";
import { BASE_URL } from "utils/CONFIG";
import { useFetch } from "hooks/useFetch";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { STATUS, STATUS_OBJ } from "utils/STATUS";
import { useMyContext } from "contexts/Context";
import { ModalUserDetails } from "./ModalUserDetails";

export function Colaboradores({ dataPreRegister, setStep, creditsData }: any) {
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
  } = useForm();
  const [filters, setFilters] = useState("");

  const [dataMyUsers, errorMyUsers, isFetchingMyUsers, getMyUsers] = useFetch(
    "/v1/users/enterprise" + filters,
    null,
    true
  );
  const { dataCredits } = creditsData;

  const [limit, setLimit] = useState(10);

  /* const urlFetch = filters
    ? "v1/users/enterprise" + filters + "&limit=" + limit
    : "v1/appointments?expert=true&limit=" + limit; */

  const { isOpen, onToggle } = useDisclosure();
  const {
    isOpen: isOpenUserDetails,
    onOpen: onOpenUserDetails,
    onClose: onCloseUserDetails,
  } = useDisclosure();

  const [selectedUserId, setSelectedUserId] = useState({} as any);

  const formattedData = dataMyUsers?.data?.map((item: any) => ({
    ...item,
    id: item.id,
    avatar: item?.avatar && item.avatar,
  }));

  function handleModal(id: any) {
    setSelectedUserId(id);
    onOpenUserDetails();
  }

  function onSubmit(data: any) {
    const query = Object.entries(data)
      .filter((item) => !!item[1])
      .map((item) => `${[item[0]]}=${item[1]}`);
    setFilters(query?.length > 0 ? "?" + query.join("&") : "");
  }

  useEffect(() => {
    if (
      user?.id ||
      dataPreRegister.status === 200 ||
      dataCredits.status === 200
    )
      getMyUsers();
  }, [user, limit, filters, dataPreRegister, dataCredits]);

  function MyUsers() {
    if (errorMyUsers)
      return (
        <AlertInpa
          status="warning"
          text={
            errorMyUsers.response.data?.error || "Erro ao carregar usuários"
          }
        />
      );

    if (isFetchingMyUsers) return <LoadingInpa />;

    if (filters && dataMyUsers?.data?.length < 1)
      return (
        <Center p={4} w="full" flexDir="column">
          <AlertInpa text="Nenhum usuário encontrado com os termos selecionados." />
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
      return <AlertInpa text="Você não possui usuários" />;

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
        <HStack w="full" maxW={350}>
          <Avatar src={item.avatar} w={46} />
          <VStack align="start" w={200} lineHeight={1} spacing={0}>
            <Text>{item.name}</Text>
            <Text fontWeight={400} fontSize={12}>
              {item.email}
            </Text>
          </VStack>
        </HStack>
        <Text minW={120} flex={1}>
          {item.doc}
        </Text>
        <Text flex={1}>{item.gender || "-"}</Text>
        <Text flex={1}>{item.availableCredits}</Text>
        <Text flex={1}>{item.appointmentsCount}</Text>

        <Wrap
          p={1}
          w="full"
          maxW={95}
          justify={{ base: "space-around", sm: "flex-end" }}
          spacing={{ base: 2, sm: 16 }}
          direction={["column", "row"]}
          align="center"
        >
          <IconButton
            icon={<FaEye />}
            onClick={() => handleModal(item.id)}
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
        <Heading fontSize={28}>Meus Usuários</Heading>

        <Wrap
          align="end"
          p={1}
          w="full"
          justify="space-between"
          overflow="visible"
          spacing={6}
        >
          <VStack flex={1} w="full" align="flex-end">
            <HStack align="flex-end" w="full" spacing={0}>
              <Input
                register={{ ...register("name") }}
                bg="white"
                borderColor="cinza"
                labelColor="cinza"
                borderEndRadius={0}
                borderWidth={1}
                borderRightWidth={0}
                title="Nome do usuário"
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
          <Button
            onClick={() => setStep("Cadastrar")}
            borderRadius={6}
            title="Novo usuário"
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

        <Flex textAlign="center" gap={14} align="center" p={1} w="full" pb={2}>
          <Heading
            w="full"
            maxW={350}
            justifyContent="start"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Nome
          </Heading>
          <Heading
            flex={1}
            display={{ base: "none", md: "flex" }}
            fontSize={18}
            justifyContent="center"
          >
            CPF
          </Heading>
          <Heading
            flex={1}
            justifyContent="center"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Gênero
          </Heading>
          <Heading
            flex={1}
            justifyContent="center"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Créditos
          </Heading>
          <Heading
            flex={1}
            justifyContent="center"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Consulta
          </Heading>
          <Heading
            justifyContent="center"
            display={{ base: "none", md: "flex" }}
            fontSize={18}
          >
            Detalhes
          </Heading>
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
        <MyUsers />
      </VStack>

      {selectedUserId && (
        <ModalUserDetails
          selectedUserId={selectedUserId}
          onOpen={onOpenUserDetails}
          isOpen={isOpenUserDetails}
          onClose={onCloseUserDetails}
          enterpriseCredits={dataMyUsers?.meta?.enterpriseCredits}
          creditsData={creditsData}
          formattedData={formattedData}
          getMyUsers={getMyUsers}
        />
      )}

      {dataMyUsers?.meta?.next_page_url && (
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
