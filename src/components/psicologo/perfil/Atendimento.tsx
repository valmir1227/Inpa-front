import React, { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  VStack,
  Text,
  HStack,
  Stack,
  Tag,
  Alert,
  AlertDescription,
  AlertIcon,
  Circle,
  Input,
  Tooltip,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { CheckboxTagInpa } from "../../global/Checkbox";
import { AddIcon, EditIcon, MinusIcon } from "@chakra-ui/icons";
import { darken } from "@chakra-ui/theme-tools";
import { toReal } from "../../../utils/toReal";
import { Button } from "components/global/Button";
import { useMyContext } from "contexts/Context";
import { usePatch } from "hooks/usePatch";
import { usePost } from "hooks/usePost";
import { LoadingInpa } from "components/global/Loading";
import { FaIdCard } from "react-icons/fa";
import useSWR from "swr";
import { fetcher } from "utils/api";
import { isEmpty } from "lodash";

export function Atendimento({ loading = false, setEtapaPerfil = false }: any) {
  const { user } = useMyContext();

  // const {
  //   data: user,
  //   mutate: getUser,
  //   isValidating: isValidatingUser,
  // } = useSWR("/v1/users/me", fetcher) as any;

  const {
    data: dataExpert,
    mutate: getExpert,
    isValidating: isValidatingExpert,
  } = useSWR(
    () => (user.id ? `/v1/experts/${user?.id}` : null),
    fetcher
  ) as any;

  const {
    data: dataCRP,
    error: errorCRP,
    isLoading: isFetchingCRP,
    mutate: getCRP,
  } = useSWR("/v1/councils", fetcher, {
    refreshInterval: 60 * 1000, //1 minuto
  }) as any;

  const [handlePatchUser, dataPatchUser, errorPatchUser, isFetchingPatchUser] =
    usePatch(`/v1/users/${user?.id}`);

  const [
    handlePostService,
    dataPostService,
    errorPostService,
    isFetchingPostService,
  ] = usePost("/v1/services/uoc");

  const experts = dataExpert?.targets?.map((expert: any) => expert.name) || [];
  const expertsServices = dataExpert?.services || [];
  const [infantil, setInfantil] = useState(100);
  const [individual, setIndividual] = useState(100);
  const [casal, setCasal] = useState(150);
  const [familiar, setFamiliar] = useState(200);
  const [grupo, setGrupo] = useState<any>([]);
  useEffect(() => {
    setGrupo(experts);
    setInfantil(
      +expertsServices.find(
        (expertService: any) => expertService.name === "Psicoterapia Infantil"
      )?.price || 100
    );
    setIndividual(
      +expertsServices.find(
        (expertService: any) => expertService.name === "Psicoterapia Individual"
      )?.price || 100
    );
    setCasal(
      +expertsServices.find(
        (expertService: any) => expertService.name === "Psicoterapia Casal"
      )?.price || 150
    );
    setFamiliar(
      +expertsServices.find(
        (expertService: any) => expertService.name === "Psicoterapia Familiar"
      )?.price || 200
    );
  }, [dataExpert]);

  const targets = [
    {
      id: 2,
      label: "Criança",
      service: "Psicoterapia Infantil",
      value: infantil,
    },
    {
      id: 3,
      label: "Adolescente",
      service: "Psicoterapia Individual",
      value: individual,
    },
    {
      id: 1,
      label: "Adulto",
      service: "Psicoterapia Individual",
      value: individual,
    },
    {
      id: 4,
      label: "Idoso",
      service: "Psicoterapia Individual",
      value: individual,
    },
    { id: 5, label: "Casal", service: "Psicoterapia Casal", value: casal },
    {
      id: 6,
      label: "Família",
      service: "Psicoterapia Familiar",
      value: familiar,
    },
  ];

  const services = {
    infantil: {
      status: grupo.includes("Criança"),
      name: "Psicoterapia Infantil",
      value: infantil,
      id: expertsServices.find(
        (expertService: any) => expertService.name === "Psicoterapia Infantil"
      )?.id,
    },
    individual: {
      status:
        grupo.includes("Adulto") ||
        grupo.includes("Idoso") ||
        grupo.includes("Adolescente"),
      name: "Psicoterapia Individual",
      value: individual,
      id: expertsServices.find(
        (expertService: any) => expertService.name === "Psicoterapia Individual"
      )?.id,
    },
    casal: {
      status: grupo.includes("Casal"),
      name: "Psicoterapia Casal",
      value: casal,
      id: expertsServices.find(
        (expertService: any) => expertService.name === "Psicoterapia Casal"
      )?.id,
    },
    familiar: {
      status: grupo.includes("Família"),
      name: "Psicoterapia Familiar",
      value: familiar,
      id: expertsServices.find(
        (expertService: any) => expertService.name === "Psicoterapia Familiar"
      )?.id,
    },
  };

  const [defaultDiscount] = expertsServices;

  const [discount, setDiscount] = useState(defaultDiscount?.credit_discount);
  function handleDiscount(value: any) {
    if (value > 0 && value < 91) {
      setDiscount(value);
    } else if (value === null) {
      setDiscount(0);
    } else {
      setDiscount(0);
      alert("Valor inválido, digite um número entre 1 e 90");
    }
  }

  function handleSubmitAtendimento() {
    const target = grupo.map(
      (item: any) =>
        targets.find((selecionado) => selecionado.label === item)?.id
    );

    const servicesArray = Object.values(services).filter(
      (service: any) => true //service.status
    );

    const formatedData = servicesArray.map((service) =>
      service?.id
        ? {
            user_id: user?.id,
            id: service?.id,
            // category: 3,
            // council: dataCRP[0]?.id,
            name: service.name,
            price: service.value,
            // creditValue: Math.floor(
            //   service.value - (discount / 100) * service.value
            // ),
            creditDiscount: discount || 0,
            active: service.status,
          }
        : {
            user_id: user?.id,
            name: service.name,
            price: service.value,
            // creditValue: Math.floor(
            //   service.value - (discount / 100) * service.value
            // ),
            creditDiscount: discount || 0,
            active: service.status,
          }
    );

    handlePatchUser({ targets: target });
    handlePostService(formatedData);
  }

  const Item = ({ title, value, setValue, active }: any) => (
    <Stack
      color={!active ? "cinza" : "inherit"}
      py={3}
      direction="row"
      justify="space-evenly"
    >
      <Text w={150} textAlign="center" fontSize={14}>
        {title}
      </Text>
      <HStack
        spacing={1}
        w="full"
        maxW={130}
        justifySelf="flex-end"
        justify="end"
      >
        {active ? (
          <>
            <Text px={2}>{toReal(value)}</Text>
            <Circle
              opacity={value === 1 ? 0.3 : 1}
              onClick={() => value > 1 && setValue(value - 1)}
              _hover={{
                cursor: "pointer",
                bg: darken("red.500", 10),
              }}
              rounded="full"
              bg={"red.500"}
              p={1}
              color="white"
            >
              <MinusIcon boxSize={1} />
            </Circle>
            <Circle
              opacity={value <= 25 ? 0.3 : 1}
              onClick={() => value > 25 && setValue(value - 25)}
              _hover={{
                cursor: "pointer",
                bg: darken("red.500", 10),
              }}
              rounded="full"
              bg={"red.500"}
              p={1}
              color="white"
            >
              <MinusIcon boxSize={2} />
            </Circle>
            <Circle
              onClick={() => setValue(value + 25)}
              _hover={{ cursor: "pointer", bg: darken("amarelo", 10) }}
              rounded="full"
              bg="amarelo"
              p={1}
              color="white"
            >
              <AddIcon boxSize={2} />
            </Circle>
            <Circle
              onClick={() => setValue(value + 1)}
              _hover={{ cursor: "pointer", bg: darken("amarelo", 10) }}
              rounded="full"
              bg="amarelo"
              p={1}
              color="white"
            >
              <AddIcon boxSize={1} />
            </Circle>
          </>
        ) : (
          <Tag fontWeight={400} size="sm" color="cinza">
            Indisponível
          </Tag>
        )}
      </HStack>
    </Stack>
  );

  useEffect(() => {
    if (dataPostService.status === 200) getExpert();
  }, [dataPostService]);

  if (isEmpty(user) || isEmpty(dataExpert)) return null;

  return (
    <Flex
      bg="#f5f5f5"
      flexDir="column"
      as="section"
      justify="center"
      align="center"
      w="100%"
      gap={4}
      py={4}
    >
      <Flex
        p={{ base: "1rem", md: "2rem" }}
        bg="white"
        color="cinzaescuro"
        borderRadius={20}
        borderWidth={1}
        align="start"
        defaultChecked
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir="column"
      >
        <Heading fontSize={28}>Atendimento</Heading>
        {loading && <LoadingInpa />}
        <Flex w="full" pt={4} flexDir={{ base: "column", lg: "row" }} gap={10}>
          <VStack align="start" flex={1.2} spacing={6}>
            <Heading fontSize={22}>Grupo</Heading>
            {!dataCRP?.find((item: any) => item.status === "Approved") ? (
              <Alert
                gap={4}
                flexDir={["column"]}
                fontSize={14}
                status="warning"
              >
                <AlertIcon />
                <AlertDescription>
                  Você poderá definir os valores após aprovação da sua
                  identidade profissional
                </AlertDescription>
                {setEtapaPerfil && (
                  <Button
                    leftIcon={<FaIdCard />}
                    onClick={() => setEtapaPerfil("crp")}
                    title="Enviar identidade profissional"
                  />
                )}
              </Alert>
            ) : (
              <>
                <CheckboxTagInpa
                  values={targets.map((item) => item.label)}
                  experts={experts}
                  setGrupo={setGrupo}
                />
                <Text maxW={500} textAlign="center" alignSelf="center">
                  Selecione o grupo de pessoas que deseja atender e defina o
                  valor para cada escolha.
                </Text>
              </>
            )}
          </VStack>
          <VStack align="end" justify="flex-end" flex={1}>
            <Heading alignSelf="start" fontSize={22}>
              Valores
            </Heading>
            <Flex
              flexDir="column"
              w="full"
              bg="bg"
              borderRadius={20}
              p={4}
              borderWidth={1}
              borderColor="cinza"
            >
              <Item
                title={services.infantil.name}
                value={infantil}
                setValue={setInfantil}
                active={services.infantil.status}
              />
              <Item
                title={services.individual.name}
                value={individual}
                setValue={setIndividual}
                active={services.individual.status}
              />
              <Item
                title={services.casal.name}
                value={casal}
                setValue={setCasal}
                active={services.casal.status}
              />
              <Item
                title={services.familiar.name}
                value={familiar}
                setValue={setFamiliar}
                active={services.familiar.status}
              />
              {/* <Tooltip label="Desconto oferecido para atender o plano corporativo">
                <>
                  <Input
                    size="sm"
                    variant="ghost"
                    type="number"
                    mt={4}
                    alignSelf="center"
                    w={24}
                    placeholder="Desconto %"
                    onChange={(e) => handleDiscount(+e.target.value)}
                    defaultValue={defaultDiscount?.credit_discount || null}
                  />
                  {discount > 0 && (
                    <Text textAlign="center" fontSize={14}>
                      Gostaria de oferecer <b>{discount + "%"}</b> de desconto
                      no plano corporativo, em todos os valores citados acima.
                      Estou ciente que um valor de R$ 100, será contabilizado o
                      valor de R$ <b>{100 - (100 / 100) * discount}</b>
                    </Text>
                  )}
                </>
              </Tooltip> */}
              {!grupo.length && (
                <Alert fontSize={14} status="warning">
                  <AlertIcon />
                  <AlertDescription>
                    Selecione um grupo para definir seu valor
                  </AlertDescription>
                </Alert>
              )}
            </Flex>
            {dataCRP?.find((item: any) => item.status === "Approved") && (
              <Button
                isLoading={isFetchingPatchUser || isFetchingPostService}
                onClick={handleSubmitAtendimento}
                title="Salvar"
              />
            )}

            {errorPatchUser && (
              <Alert w="fit-content" ml="auto" mt={2} status="warning">
                <AlertIcon />
                {errorPatchUser?.response.statusText ||
                  "Erro ao salvar grupo de atendimento"}
              </Alert>
            )}
            {dataPatchUser.status == 200 && (
              <Alert w="fit-content" ml="auto" mt={2} status="success">
                <AlertIcon />
                Grupo de atendimento atualizado
              </Alert>
            )}
            {errorPostService && (
              <Alert w="fit-content" ml="auto" mt={2} status="warning">
                <AlertIcon />
                {errorPostService?.response.statusText ||
                  "Erro ao salvar valores"}
              </Alert>
            )}
            {dataPostService.status == 200 && (
              <Alert w="fit-content" ml="auto" mt={2} status="success">
                <AlertIcon />
                Valores atualizados
              </Alert>
            )}
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  );
}
