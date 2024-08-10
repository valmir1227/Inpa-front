import {
  Box,
  Circle,
  Flex,
  Heading,
  HStack,
  Input,
  useRadio,
  useRadioGroup,
  VStack,
  Wrap,
  Text,
  Tooltip,
  Tag,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";

import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteGroup,
} from "@choc-ui/chakra-autocomplete";
import { AddIcon } from "@chakra-ui/icons";
import { differenceInYears } from "date-fns";
import { useEffect, useState } from "react";
import { useFetch } from "hooks/useFetch";
import { LoadingInpa } from "components/global/Loading";
import { useDebounce } from "usehooks-ts";
import Select from "react-select";
import { isEmpty } from "lodash";

export function Titulos({
  titles,
  setTitles,
  data,
  form,
  firstMedicalRecord,
}: any) {
  const { onSubmit, handleSubmit, register } = form;
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "titles",
    // defaultValue: "Relacionamentos",
    // onChange: console.log,
  });
  const group = getRootProps();

  const [searchCid, setSearchCid] = useState("");
  const [dataCid, errorCid, isFetchingCid, getCid] = useFetch(
    `/v1/cids?code=${searchCid}`
  );
  const debouncedValue = useDebounce<string>(searchCid, 500);
  const [selectedValue, setSelectedValue] = useState([]);
  const defaultValue = firstMedicalRecord?.ci_ds?.map((value: any) => ({
    value: value,
    label: value,
  }));

  useEffect(() => {
    isEmpty(selectedValue) && setSelectedValue(defaultValue);
  }, [firstMedicalRecord]);

  useEffect(() => {
    if (searchCid) getCid();
  }, [debouncedValue]);

  return (
    <VStack spacing={4} p={4} borderRadius={16} bg="bg" w="full" align="start">
      <Heading fontSize={20}>{data.patient.name}</Heading>
      <Text fontSize={14} fontWeight={500}>
        {data.patient.gender},{" "}
        {differenceInYears(new Date(), new Date(data.patient.birthday))} anos
      </Text>
      {/* <Flex
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        gap={2}
        alignItems="flex-end"
        w="full"
      >
        <Input
          fontSize={14}
          variant="outline"
          placeholder="Escreva um título"
          {...register("titulo", { required: true })}
        />
        <Circle
          _hover={{ cursor: "pointer" }}
          mb="9px"
          bg="amarelo"
          p={1.5}
          as={"button"}
          type="submit"
        >
          <AddIcon boxSize={2.5} />
        </Circle>
      </Flex> */}

      <NewInput
        setTitles={setTitles}
        setSearchCid={setSearchCid}
        searchCid={searchCid}
        isFetchingCid={isFetchingCid}
        dataCid={dataCid}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        defaultValue={defaultValue}
      />
      {/* <Wrap
        spacing={4}
        overflow="visible"
        flexDir="row"
        w="full"
        align="start"
        {...group}
      >
        {titles?.map((value: any) => {
          const radio = getRadioProps({ value });
          return (
            <HStack
              w="fit-content"
              _hover={{ div: { visibility: "visible" } }}
              key={value}
              pos="relative"
            >
              <RadioCard {...radio}>{value}</RadioCard>
              <Circle
                pos="absolute"
                top={-2}
                right={-2}
                visibility="hidden"
                _hover={{ cursor: "pointer", opacity: 1 }}
                mb={3}
                bg="vermelho"
                color="white"
                p={1}
                opacity={0.75}
                onClick={() => {
                  setTitles(titles.filter((item: any) => item !== value));
                }}
              >
                <FiX size={12} />
              </Circle>
            </HStack>
          );
        })}
      </Wrap> */}
    </VStack>
  );
}

function RadioCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        bg="cinzaclaro"
        _checked={{
          bg: "amarelo",
          color: "white",
          // borderColor: "teal.600",
        }}
        px={2}
        py={1}
        borderRadius={6}
        fontWeight={500}
        fontSize={14}
        p={3}
        lineHeight={1}
        w="max-content"
      >
        {props.children}
      </Box>
    </Box>
  );
}

function NewInput({
  setTitles,
  setSearchCid,
  searchCid,
  isFetchingCid,
  dataCid,
  selectedValue,
  setSelectedValue,
  defaultValue,
}: any) {
  const options = dataCid?.data?.map((cid: any) => ({
    label: `${cid.code} ${cid.description}`,
    value: cid.code,
  }));
  // const options = [{ label: "teste", value: "teste" }];
  // const options = dataCid?.data?.map((cid: any) => cid) || [];
  return (
    <Flex justifyContent="center" fontSize={12} w="full" flexDir="column">
      <Text>Cids</Text>
      <Select
        onInputChange={(value) => setSearchCid(value.toUpperCase())}
        onChange={(value) => {
          setSelectedValue(value);
          setTitles(value.map((v) => v.value));
        }}
        options={options}
        isMulti
        value={selectedValue?.map((value: any) => ({
          ...value,
          label: value.value,
        }))}
        placeholder="Digite para buscar um CID"
        // controlShouldRenderValue
        isLoading={isFetchingCid}
        noOptionsMessage={() => "Digite para buscar um CID"}
        // noOptionsMessage={() => "Nenhum CID encontrado com " + searchCid}
        loadingMessage={() => "Carregando..."}
        // defaultValue={}
      />
    </Flex>
  );
}
