/* eslint-disable react-hooks/exhaustive-deps */
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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  TableContainer,
  Table,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
  Icon,
  useToast,
} from "@chakra-ui/react";

import Link from "next/link";
import { FaEye, FaIdCard } from "react-icons/fa";
import { Input, Select } from "../global/Select";
import { BsCalendar, BsCardImage, BsFilter, BsTrash } from "react-icons/bs";
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
import { COUNCIL_STATUS_OBJ, STATUS, STATUS_OBJ } from "utils/STATUS";
import { useMyContext } from "contexts/Context";
import {
  AddIcon,
  CheckIcon,
  DownloadIcon,
  EditIcon,
  ExternalLinkIcon,
  HamburgerIcon,
  NotAllowedIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import { usePatch } from "hooks/usePatch";
import { useDel } from "hooks/useDel";

export function CRPs() {
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

  const [limit, setLimit] = useState(10);

  const [filters, setFilters] = useState("");

  const urlFetch = filters
    ? "v1/councils" + filters + "&limit=" + limit
    : "v1/councils?limit=" + limit;

  const [
    dataAppointment,
    errorAppointment,
    isFetchingAppointment,
    getAppointment,
  ] = useFetch(urlFetch, null, true);

  const { isOpen, onToggle } = useDisclosure();

  const formattedData = dataAppointment?.data?.map((item: any) => ({
    ...item,
    id: item.id,
    expert: {
      ...item.expert,
      avatar: item.expert.avatar && item.expert.avatar,
    },
    date: {
      iso: item.created_at,
      date: new Date(item.created_at),
      week: format(new Date(item.created_at), "EEEE", {
        locale: ptBR,
      }),
      short: format(new Date(item.created_at), "dd/MM"),
      hourShort: format(new Date(item.created_at), "HH:mm"),
    },
  }));

  function onSubmit(data: any) {
    const query = Object.entries(data)
      .filter((item) => !!item[1])
      .map((item) => `${[item[0]]}=${item[1]}`);
    setFilters(query?.length > 0 ? "?" + query.join("&") : "");
  }

  const [councilToPatch, setCouncilToPatch] = useState({} as any);
  const [councilToDelete, setCouncilToDelete] = useState({} as any);

  const [
    handlePatchCouncil,
    dataPatchCouncil,
    errorPatchCouncil,
    isPatchingCouncil,
  ] = usePatch(`/v1/councils/${councilToPatch?.id}`);

  const [
    handleDeleteCouncil,
    dataDeleteCouncil,
    errorDeleteCouncil,
    isDeleteingCouncil,
  ] = useDel(`/v1/councils/`);
  const toast = useToast();

  useEffect(() => {
    if (user?.id || dataPatchCouncil.status === 200) getAppointment();
  }, [user, limit, filters, dataPatchCouncil]);

  useEffect(() => {
    if (user?.id && dataDeleteCouncil.status === 200) {
      getAppointment();
      toast({
        title: "Identidade profissional excluída com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [dataDeleteCouncil]);

  useEffect(() => {
    if (councilToPatch?.id)
      if (councilToPatch?.reason) {
        handlePatchCouncil({
          status: councilToPatch?.status,
          reason: councilToPatch.reason,
        });
        return;
      }
    handlePatchCouncil({ status: councilToPatch?.status });
  }, [councilToPatch]);

  function Cards() {
    return formattedData?.map((item: any) => (
      <Tr key={item.id}>
        <Td>
          <HStack>
            <Avatar src={item.expert.avatar} />
            <VStack align="start" lineHeight={1} spacing={0}>
              <Text>{item.expert.social_name || item.expert.name}</Text>
              {item.expert.social_name && (
                <Text fontWeight={400} fontSize={11}>
                  ({item.expert.name})
                </Text>
              )}
            </VStack>
          </HStack>
        </Td>
        <Td>
          <VStack>
            <Text>{item.type}</Text>
            <Text>
              {item.council} {item.number}
            </Text>
          </VStack>
        </Td>
        <Td>
          <VStack>
            <Text>{item.date.week}</Text>
            <Text>{item.date.short}</Text>
          </VStack>
        </Td>
        <Td>
          <Text>{item.state}</Text>
        </Td>
        <Td>
          <Center>
            <Tag
              p={2}
              color="white"
              bg={colorStatus(item.status)}
              fontSize={12}
              fontWeight={400}
            >
              {translateStatus(item.status)}
            </Tag>
          </Center>
        </Td>
        <Td>
          <Wrap justify="center" spacing={0} align="center">
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
              />
              <MenuList bg="bg">
                <MenuItem
                  p={2}
                  isDisabled={item.status === "Approved"}
                  onClick={() => {
                    if (
                      confirm(
                        "Tem certeza que deseja aprovar a identidade profissional?"
                      )
                    ) {
                      setCouncilToPatch({
                        id: item.id,
                        status: "Approved",
                      });
                    }
                  }}
                  icon={
                    <Icon
                      boxSize={4}
                      as={CheckIcon}
                      aria-label="Aprovar"
                      color="whatsapp.300"
                    />
                  }
                >
                  Aprovar
                </MenuItem>
                <MenuItem
                  p={2}
                  as="a"
                  disabled={!item?.image}
                  target="_blank"
                  href={item?.image ? item?.image : ""}
                  icon={
                    <Icon
                      boxSize={4}
                      as={FaIdCard}
                      aria-label="Ver documento"
                      color="cinza"
                    />
                  }
                >
                  Visualizar
                </MenuItem>
                <MenuItem
                  p={2}
                  isDisabled={item.status === "Suspended"}
                  onClick={() => {
                    const reason = prompt(
                      "Informe o motivo de negar a identidade profissional e confirme"
                    );
                    if (reason) {
                      setCouncilToPatch({
                        id: item.id,
                        status: "Suspended",
                        reason,
                      });
                    }
                  }}
                  icon={
                    <Icon
                      boxSize={4}
                      as={NotAllowedIcon}
                      aria-label="Reprovar"
                      color="vermelho"
                    />
                  }
                >
                  Reprovar
                </MenuItem>
                <MenuItem
                  p={2}
                  onClick={async () => {
                    if (
                      confirm(
                        "Tem certeza que deseja excluir a identidade profissional?"
                      )
                    ) {
                      await handleDeleteCouncil(item.id);
                    }
                  }}
                  icon={
                    <Icon
                      boxSize={4}
                      as={BsTrash}
                      aria-label="Excluir"
                      color="vermelho"
                    />
                  }
                >
                  Excluir
                </MenuItem>
              </MenuList>
            </Menu>
          </Wrap>
        </Td>
      </Tr>
    ));
  }
  if (errorAppointment)
    return (
      <AlertInpa
        status="warning"
        text={
          errorAppointment.response.data?.error ||
          "Erro ao carregar Identidades profissionais"
        }
      />
    );

  if (isFetchingAppointment) return <LoadingInpa />;

  if (formattedData?.length === 0)
    return <AlertInpa text="Sem identidades profissionais" />;
  if (filters && dataAppointment?.data?.length < 1)
    return (
      <Center p={4} w="full" flexDir="column">
        <AlertInpa text="Nenhuma identidade profissional encontrado com os termos selecionados." />
        <Button
          title="Limpar filtros"
          onClick={() => {
            setFilters("");
            reset();
          }}
        />
      </Center>
    );

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
        <Heading fontSize={28}>Identidade profissional</Heading>

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
            title="Status da identidade profissional"
            placeholder="Selecione"
            values={COUNCIL_STATUS_OBJ.map((item: any) => item.label)}
            register={{
              ...register("status", {
                setValueAs: (v) =>
                  COUNCIL_STATUS_OBJ.find((item: any) => item.label === v)
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
                  <Heading textAlign="start" fontSize={18}>
                    Profissional
                  </Heading>
                </Th>
                <Th>
                  <Heading fontSize={18}>ID Prof</Heading>
                </Th>
                <Th>
                  <Heading fontSize={18}>Data</Heading>
                </Th>
                <Th>
                  <Heading fontSize={18}>UF</Heading>
                </Th>
                <Th>
                  <Heading fontSize={18}>Status</Heading>
                </Th>

                <Th w={16}>
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
