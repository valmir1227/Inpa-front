/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useEffect, useRef, useState } from "react";
import {
  Flex,
  Heading,
  Text,
  Wrap,
  Input as ChakraInput,
  InputGroup,
  InputRightElement,
  Icon,
  Center,
  Button as ChakraButton,
  Tag,
  CloseButton,
  IconButton,
  TagCloseButton,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Input, Select } from "../../global/Select";
import { MODALIDADES } from "../../../utils/MODALIDADES";
import { GENEROS } from "../../../utils/GENEROS";
import { ESTADOS, ESTADOS_OBJ } from "../../../utils/ESTADOS";
import { IDIOMAS, IDIOMAS_OBJ } from "../../../utils/IDIOMAS";

import DatePicker from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import { BsCalendar } from "react-icons/bs";
import { RangeValores } from "./RangeValores";
import { CardPsicologo } from "./CardPsicologo";
import Link from "next/link";
import { CartPopup } from "./CartPopup";
import { CardPsicologoDefault } from "./CardPsicologoDefault";
import { LoadingInpa } from "components/global/Loading";
import { useMyContext } from "contexts/Context";
import { useRouter } from "next/router";
import { useFetch } from "hooks/useFetch";
import { AlertInpa } from "components/global/Alert";
import { Button, ButtonLink } from "components/global/Button";
import { useForm } from "react-hook-form";
import { dateToDbDate } from "utils/toBrDate";
import { addDays, startOfDay, subDays } from "date-fns";
import axios from "axios";
import useSWR from "swr";
import { api, fetcher } from "utils/api";
import queryString from "query-string";

export function Psicologos() {
  const router = useRouter();
  const { user } = useMyContext();

  const today = startOfDay(new Date()).toISOString();
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
      initialPrice: 20,
      finalPrice: 1000,
    },
  } as any);

  const [filters, setFilters] = useState({});

  function onSubmit(data: any) {
    const query = Object.entries(data)
      .filter((item) => !!item[1])
      .map((item) => `${[item[0]]}=${item[1]}`);
    setFilters(data);
    // setFilters(query?.length > 0 ? "?" + query.join("&") : "");
    // mutate();
  }

  const [limit, setLimit] = useState(20);

  const urlFetch = filters
    ? "v1/search" + filters + "&limit=" + limit
    : "v1/search?limit=" + limit;

  const urlToFetch = queryString.stringify(
    {
      limit,
      ...filters,
      enterprise: !!user?.from_id, //ativar somente quando existir painel para informar quais prof sao enterprise
      finalPrice: user?.credit_limit || watch("finalPrice"),
      initialPrice: user?.from_id ? 1 : watch("initialPrice"),
    },
    { skipNull: true, skipEmptyString: true }
  );

  const {
    data: dataTags,
    error: errorTags,
    mutate: mutateTags,
    isLoading: isFetchingTags,
    isValidating: isValidatingTags,
  } = useSWR("v1/tags", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  }) as any;

  /* const [dataExperts, errorExperts, isFetchingExperts, getExperts] =
    useFetch(urlFetch); */

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    "v1/search?" + urlToFetch,
    fetcher
  ) as any;

  /* const [dataTags, errorTags, isFetchingTags, getTags] = useFetch("v1/tags"); */

  const Card = () => {
    if (isLoading) return <LoadingInpa />;
    if (data?.data?.length < 1)
      return (
        <Center flexDir="column">
          <AlertInpa text="Nenhum profissional encontrado com os termos selecionados." />
          <Button
            title="Limpar filtros"
            onClick={() => {
              setFilters({});
              reset();
              // mutate();
            }}
          />
        </Center>
      );
    if (error) return <AlertInpa text="Erro ao carregar" />;
    return data?.data?.map((expert: any) => {
      return (
        <Flex
          key={expert.id}
          p={{ base: "1rem", md: "2rem" }}
          bg="white"
          borderRadius={20}
          borderWidth={1}
          align="start"
          maxW={1200}
          w="full"
          justify="space-between"
          flexDir="column"
          color="cinzaescuro"
          gap={4}
        >
          <CardPsicologo expert={expert} />
          <ButtonLink
            title="Ver profissional"
            href={`/psicologos/${expert.slug}`}
            alignSelf="center"
            bgGradient="linear(to-tr, amarelogradient1, amarelogradient2)"
            _hover={{
              bgGradient: "linear(to-tr, amarelogradient2, amarelogradient1)",
            }}
            fontWeight={500}
            borderRadius="full"
            fontSize={14}
            // bg="amarelo"
            w="fit-content"
            color="white"
            py={4}
            px={10}
          />
        </Flex>
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
      gap={4}
      pb={4}
      pos="relative"
      overflow="hidden"
    >
      <Flex
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        px={{ base: "1rem", sm: "3rem" }}
        py={{ base: "2rem", sm: "3rem" }}
        bg="azul"
        borderBottomRadius={20}
        align="center"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir="column"
        gap={6}
      >
        <Heading fontSize={24} color="white">
          Encontre seu especialista
        </Heading>
        <SetAndClearFilters
          register={register}
          filters={filters}
          setFilters={setFilters}
          reset={reset}
          date={startOfDay(new Date(watch("date")))}
        />
        {/* <Text color="white">{filters}</Text> */}

        <Wrap
          textAlign="center"
          overflow="visible"
          justify="space-between"
          w="full"
        >
          <Select
            placeholder={isValidatingTags ? "Carregando..." : "Selecione"}
            maxW={200}
            values={dataTags?.map((tag: any) => tag.name) || []}
            title="Ajuda para"
            register={{ ...register("tags") }}
          />
          <RangeValores
            valorInicial={watch("initialPrice")}
            valorFinal={watch("finalPrice")}
            setValue={setValue}
            register={register}
          />
          <Input
            maxW={150}
            title="A partir do dia"
            id="data"
            bg="amarelo"
            color="white"
            _focus={{ bg: "amarelo" }}
            _hover={{ bg: "amarelogradient1" }}
            // placeholderText="Data de nascimento"
            as={DatePicker}
            // excludeDates={[new Date(), subDays(new Date(), 30)]}
            /* includeDateIntervals={[
              { start: new Date(), end: addDays(new Date(), 6) },
            ]} */
            // maxDate={addDays(new Date(), 6)}
            minDate={new Date()}
            selected={watch("date") ? new Date(watch("date")) : null}
            // placeholderText="I have been cleared!"
            // selected={getValues("date")}
            onChange={(date: any) => {
              setValue("date", date ? startOfDay(date).toISOString() : null);
            }}
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
            icon={<BsCalendar color="white" />}
            register={{ ...register("date") }}
            autoComplete="off"
            // isClearable
          />
          <Select
            placeholder="Selecione"
            maxW={200}
            values={GENEROS}
            title="Gênero"
            register={{ ...register("gender") }}
          />
          <Select
            register={{
              ...register("state", {
                setValueAs(value) {
                  return ESTADOS_OBJ.find((item) => item.label === value)
                    ?.value;
                },
              }),
            }}
            placeholder="Selecione"
            maxW={200}
            values={ESTADOS}
            title="Estado"
          />
          <Input
            register={{ ...register("city") }}
            maxW={200}
            title="Cidade"
            placeholder="Digite a cidade"
            id="city"
          />
          <Select
            placeholder="Selecione"
            maxW={200}
            values={IDIOMAS}
            title="Idioma"
            register={{
              ...register("language"),
            }}
          />
        </Wrap>
      </Flex>
      {isValidating && <Spinner />}

      <Card />
      {data?.meta?.next_page_url && (
        <Button
          title="Ver mais"
          color="azul"
          size="sm"
          onClick={() => setLimit(limit + 20)}
        />
      )}

      <CartPopup />
    </Flex>
  );
}

const SetAndClearFilters = ({
  register,
  filters,
  setFilters,
  reset,
  date,
}: any) => {
  const { setFirstDay } = useMyContext();
  return (
    <>
      <InputGroup borderRadius={10} w="full" maxW="540" overflow="hidden">
        <ChakraInput
          {...register("name")}
          variant="filled"
          placeholder="Nome do profissional"
          fontSize={14}
          fontWeight={500}
          _placeholder={{ color: "cinza" }}
          _focus={{ bg: "white" }}
        />
        <InputRightElement w="fit-content">
          <ChakraButton
            colorScheme="none"
            bg="amarelo"
            color="white"
            borderRadius={0}
            w={{ base: 45, sm: 150 }}
            type="submit"
            onClick={() => setFirstDay(date)}
          >
            <Text
              fontSize={14}
              fontWeight={400}
              display={{ base: "none", sm: "flex" }}
            >
              Pesquisar
            </Text>

            <Icon display={{ sm: "none" }}>
              <SearchIcon />
            </Icon>
          </ChakraButton>
        </InputRightElement>
      </InputGroup>
      {Object.keys(filters)?.length > 0 && (
        <Button
          color="cinzaclaro"
          size="sm"
          title="Limpar filtros"
          onClick={() => {
            setFilters({});
            reset();
            setFirstDay(startOfDay(new Date()));
            // mutate();
          }}
        />
      )}
    </>
  );
};
