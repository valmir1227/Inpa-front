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
  Tooltip,
  Alert,
  AlertIcon,
  Box,
  Table,
  TableContainer,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
} from "@chakra-ui/react";

import { FaDollarSign, FaEye } from "react-icons/fa";
import { Input, Select } from "../global/Select";
import { BsCalendar, BsFilter, BsLock } from "react-icons/bs";
import { Button } from "../global/Button";

import { ptBR } from "date-fns/locale";
import { colorStatus, translateStatus } from "utils/translateStatus";
import { AlertInpa, AlertInpaCall } from "components/global/Alert";
import { LoadingInpa } from "components/global/Loading";
import { useFetch } from "hooks/useFetch";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useMyContext } from "contexts/Context";
import { CheckIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { Modal } from "components/global/Modal";
import { toBrDate } from "utils/toBrDate";
import { usePut } from "hooks/usePut";
import { ModalUserDetails } from "components/corporativo/ModalUserDetails";
import { usePost } from "hooks/usePost";
import { usePatch } from "hooks/usePatch";
import error from "next/error";
import { ModalUserFullInfo } from "./ModalUserFullInfo";
import { MdBlock } from "react-icons/md";
import useSwr from "swr";
import { fetcher } from "utils/api";

export function Usuarios() {
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

  const [limit, setLimit] = useState(30);

  const [filters, setFilters] = useState("");

  const urlFetch = filters
    ? "v2/users" + filters + "&limit=" + limit + "&orderBy=id"
    : "v2/users?limit=" + limit + "&orderBy=id";

  const {
    data,
    error: errorUsers,
    isLoading: isFetchingUsers,
    isValidating: isValidatingUsers,
    mutate: getUsers,
  } = useSwr(urlFetch, fetcher);

  const [dataUsers, setDataUsers] = useState({} as any);
  useEffect(() => {
    data && setDataUsers(data);
  }, [data]);

  const { isOpen, onToggle } = useDisclosure();

  const {
    isOpen: isOpenUsersDetails,
    onOpen: onOpenUsersDetails,
    onClose: onCloseUsersDetails,
  } = useDisclosure();

  const [selectedUser, setSelectedUser] = useState({} as any);

  const {
    isOpen: isOpenUserDetails,
    onOpen: onOpenUserDetails,
    onClose: onCloseUserDetails,
  } = useDisclosure();

  //2 opcoes, estado com o id do usuário selecionado ou o objeto do usuário selecionado
  const [selectedUsers, setSelectedUsers] = useState({} as any);
  const findUsers = dataUsers?.data?.find(
    (item: any) => item.id === selectedUsers.id
  );

  const [handlePatchUsers, dataPatchUsers, errorPatchUsers, isPatchingUsers] =
    usePatch(`/v1/users/${selectedUsers?.id}`);

  const [handlePostCredits, dataCredits, errorCredits, isFetchingCredits] =
    usePost("/v1/credits");

  const formattedData = dataUsers?.data?.map((item: any) => ({
    ...item,
    id: item.id,
  }));

  function onSubmit(data: any) {
    const query = Object.entries(data)
      .filter((item) => !!item[1])
      .map((item) => `${[item[0]]}=${item[1]}`);
    setFilters(query?.length > 0 ? "?" + query.join("&") : "");
  }

  function handleReproveUsers() {
    if (confirm("Deseja BLOQUEAR o usuário?")) {
      handlePatchUsers({ status: "Disabled" });
    }
  }

  function handleApproveUsers() {
    if (confirm("Deseja confirmar o desbloqueio?")) {
      handlePatchUsers({ status: null });
    }
  }

  useEffect(() => {
    if (user?.id) {
      if (dataPatchUsers.status === 200 || dataCredits.status === 200) {
        getUsers();
        return;
      }

      // getUsers();
    }
  }, [user, filters, dataPatchUsers, dataCredits]);

  function Cards() {
    function handleModal(selected: any) {
      setSelectedUsers(selected);
      onOpenUsersDetails();
    }

    function handleModalCredits(selected: any) {
      setSelectedUser(selected);
      onOpenUserDetails();
    }

    return formattedData?.map((item: any) => (
      <Tr key={item.id}>
        <Td maxW={4}>
          <Text>{item.id}</Text>
        </Td>
        <Td>
          <HStack>
            <Avatar src={item.avatar} />
            <VStack align="start" lineHeight={1} spacing={0}>
              <Text>{item.social_name || item.name}</Text>
              {item.social_name && (
                <Text fontWeight={400} fontSize={11}>
                  ({item.name})
                </Text>
              )}
            </VStack>
          </HStack>
        </Td>
        <Td>
          <VStack>
            <Text>{toBrDate(item.created_at)}</Text>
          </VStack>
        </Td>
        <Td>
          <VStack>
            <Text pt={1} fontSize={11}>
              {item.email}
            </Text>
            <Text pt={1} fontSize={11}>
              {item.phone}
            </Text>
          </VStack>
        </Td>
        <Td>
          <Wrap justify="center" gap={2}>
            {Object.entries(item.permissions).map((item: any) => (
              <Tag
                w={24}
                justifyContent="center"
                key={item[0]}
                color="white"
                bg={colorStatus(item[0])}
                fontSize={12}
                fontWeight={400}
                textTransform="capitalize"
              >
                {translateStatus(item[0])}
              </Tag>
            ))}
            {item?.from_id && (
              <Tag
                w={24}
                justifyContent="center"
                color="white"
                bg="cinza"
                fontSize={12}
                fontWeight={400}
                textTransform="capitalize"
              >
                Colaborador
              </Tag>
            )}
          </Wrap>
        </Td>
        <Td>
          <Wrap
            p={1}
            justify={{ base: "space-around", sm: "flex-end" }}
            // w={110}
            spacing={0}
            direction={["column", "row"]}
            align="center"
          >
            {/*   <ButtonLink
            href={`/psicologo/sessoes/${item.id}`}
            fontSize={14}
            title="Ver sessão"
          /> */}
            {item.permissions.expert && (
              <Tooltip hasArrow label="Taxa / Comissão">
                <Text>{item.tax}%</Text>
              </Tooltip>
            )}
            {item.status === "Disabled" && (
              <Tooltip hasArrow label="Usuário bloqueado">
                <Box p={2}>
                  <MdBlock />
                </Box>
              </Tooltip>
            )}
            <IconButton
              icon={<FaDollarSign />}
              onClick={() => handleModalCredits(item)}
              size="sm"
              aria-label="Ver detalhes de créditos"
              variant="ghost"
              color="cinza"
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
        </Td>
      </Tr>
    ));
  }
  if (errorUsers)
    return (
      <AlertInpa
        status="warning"
        text={errorUsers.response.data?.error || "Erro ao carregar usuários"}
      />
    );

  // if (isFetchingUsers && true) return <LoadingInpa />;

  if (filters && dataUsers?.data?.length < 1)
    return (
      <Center p={4} w="full" flexDir="column">
        <AlertInpa text="Nenhum usuario encontrado com os termos selecionados." />
        <Button
          title="Limpar filtros"
          onClick={() => {
            setFilters("");
            reset();
          }}
        />
      </Center>
    );

  if (formattedData?.length === 0) return <AlertInpa text="Sem usuários" />;
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
      {isFetchingUsers && <LoadingInpa />}
      <Flex
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        p={{ base: "1rem", md: "2rem" }}
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
        <Heading fontSize={28}>Usuários</Heading>

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
            title="Registrado a partir de"
            id="dateFrom"
            bg="amarelo"
            color="white"
            _focus={{ bg: "amarelo" }}
            _hover={{ bg: "amarelogradient1" }}
            // placeholderText="Data de nascimento"
            as={DatePicker}
            selected={watch("dateFrom") ? new Date(watch("dateFrom")) : null}
            // selected={getValues("date")}
            onChange={(date: any) => {
              setValue("dateFrom", date ? date.toISOString() : null);
            }}
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
            icon={<BsCalendar color="white" />}
            register={{ ...register("createdAt") }}
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
            title="Tipo de Usuário"
            placeholder="Selecione"
            values={["Patient", "Expert", "Enterprise", "Admin"]}
            register={{
              ...register("permission", {
                setValueAs: (v) => v.toLowerCase(),
                // Users_STATUS_OBJ.find((item: any) => item.label === v)?.value,
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
        </Wrap>
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
        <TableContainer w="full" maxW={1100}>
          <Table
            variant="simple"
            // colorScheme="blackAlpha"
            borderColor="cinza"
            px={{ base: 2, md: "2rem" }}
            pb="10px"
            pt="14px"
            // _hover={{ bg: "bg" }}
            textAlign="center"
            fontSize={13}
            fontWeight={500}
            w="full"
            // spacing={{ base: 4, md: 14 }}
            borderBottomWidth={1}
            // direction={["column", "row"]}
          >
            <Thead>
              <Tr sx={{ th: { textAlign: "center" } }}>
                <Th>
                  <Heading justifyContent="start" fontSize={14}>
                    ID
                  </Heading>
                </Th>
                <Th>
                  <Heading textAlign="start" fontSize={18}>
                    Nome
                  </Heading>
                </Th>
                <Th>
                  <Heading fontSize={18} justifyContent="center">
                    Registrado
                  </Heading>
                </Th>
                <Th>
                  <Heading justifyContent="center" fontSize={18}>
                    Contato
                  </Heading>
                </Th>
                <Th>
                  <Heading justifyContent="center" fontSize={18}>
                    Tipo
                  </Heading>
                </Th>
                <Th>
                  <Center>
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
                        // w={110}
                      >
                        Filtros
                      </ChakraButton>
                    )}
                  </Center>
                </Th>
              </Tr>
            </Thead>
            <Tbody
              sx={{ td: { textAlign: "center" }, tr: { _odd: { bg: "bg" } } }}
            >
              <Cards />
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>

      {dataUsers?.meta?.next_page_url && (
        <Button
          title="Ver mais"
          color="azul"
          size="sm"
          onClick={() => setLimit(limit + 30)}
          mt={2}
          isLoading={isValidatingUsers || isFetchingUsers}
        />
      )}
      <ModalUserDetails
        onOpen={onOpenUserDetails}
        isOpen={isOpenUserDetails}
        onClose={onCloseUserDetails}
        enterpriseCredits={99999}
        creditsData={{
          handlePostCredits,
          dataCredits,
          errorCredits,
          isFetchingCredits,
        }}
        formattedData={formattedData}
        selectedUserId={selectedUser.id}
        getMyUsers={getUsers}
      />

      <ModalUserFullInfo
        selectedUsers={selectedUsers}
        isOpenUsersDetails={isOpenUsersDetails}
        onCloseUsersDetails={onCloseUsersDetails}
        handleApproveUsers={handleApproveUsers}
        handleReproveUsers={handleReproveUsers}
        handlePatchUsers={handlePatchUsers}
        isPatchingUsers={isPatchingUsers}
        errorPatchUsers={errorPatchUsers}
        dataPatchUsers={dataPatchUsers}
      />
    </Flex>
  );
}
