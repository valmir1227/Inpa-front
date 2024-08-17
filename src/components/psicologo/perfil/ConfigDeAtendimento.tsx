import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Wrap,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Skeleton,
} from "@chakra-ui/react";
import { CheckboxInpa } from "../../global/Checkbox";
import { Button } from "../../global/Button";
import { usePatch } from "hooks/usePatch";
import { useMyContext } from "contexts/Context";
import { LoadingInpa } from "components/global/Loading";
import useSWR from "swr";
import { fetcher } from "utils/api";
import { isEmpty } from "lodash";

export function ConfigDeAtendimento() {
  const { user } = useMyContext();
  const { data: dataExpert, isValidating: isValidatingExpert } = useSWR(
    user?.id ? `/v1/experts/${user?.id}` : null,
    fetcher
  );

  const { data: dataSpecialty, isLoading: isFetchingSpecialty } = useSWR(
    "/v1/specialties/",
    fetcher
  );
  const { data: dataApproach, isLoading: isFetchingApproach } = useSWR(
    "/v1/approaches/",
    fetcher
  );
  const { data: dataTag, isLoading: isFetchingTag } = useSWR(
    "/v1/tags/",
    fetcher
  );

  const [handlePatch, data, error, isFetching] = usePatch(
    `/v1/users/${user?.id}`
  );

  const arrayTags = dataTag?.map((tag: any) => tag.name) || [];

  const defaultArrayTags = dataExpert?.tags?.map((tag: any) => tag.name) || [];

  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    setSelectedTags(defaultArrayTags);
  }, [dataExpert, dataTag]);

  const selectedTagsToIds = selectedTags?.map(
    (sellectedTag: any) =>
      dataTag?.find((item: any) => sellectedTag === item?.name)?.id
  );

  const arraySpecialties =
    dataSpecialty?.map((specialty: any) => specialty.name) || [];

  const defaultSpecialties =
    dataExpert?.specialties?.map((specialty: any) => specialty.name) || [];

  const [selectedSpecialties, setSelectedSpecialties] = useState(
    defaultSpecialties || []
  );

  const selectedSpecialtiesToIds = selectedSpecialties?.map(
    (sellectedSpecialty: any) =>
      dataSpecialty?.find((item: any) => sellectedSpecialty === item?.name)?.id
  );

  const arrayApproaches =
    dataApproach?.map((approach: any) => approach.name) || [];

  const defaultApproaches =
    dataExpert?.approaches?.map((approach: any) => approach.name) || [];

  const [selectedApproaches, setSelectedApproaches] = useState(
    defaultApproaches || []
  );
  
  const selectedApproachesToIds = selectedApproaches?.map(
    (sellectedApproach: any) =>
      dataApproach?.find((item: any) => sellectedApproach === item?.name)?.id
  );

  const limit = 10;
  const tagsOverLimit = selectedTags?.length >= limit;

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
        <Heading fontSize={28}>Configurações de Atendimento</Heading>
        <Wrap
          mt={4}
          flexDir="column"
          w="full"
          bg="bg"
          borderRadius={20}
          p={4}
          borderWidth={1}
          borderColor="cinza"
        >
          <VStack align="start" flex={1}>
            <Heading fontSize={18}>Especialidades:</Heading>
            {isFetchingSpecialty && <LoadingInpa />}
            <CheckboxInpa
              loading={isValidatingExpert}
              defaultValues={defaultSpecialties}
              setState={setSelectedSpecialties}
              values={arraySpecialties}
              direction="column"
            />
          </VStack>
          <VStack align="start" flex={1}>
            <Heading fontSize={18}>Ofereço ajuda para:</Heading>
            {isFetchingTag && <LoadingInpa />}
            <CheckboxInpa
              loading={isValidatingExpert}
              disabled={tagsOverLimit}
              defaultValues={defaultArrayTags}
              setState={setSelectedTags}
              values={arrayTags}
              direction="column"
            />
            <Text
              fontWeight={tagsOverLimit ? 700 : 400}
              fontSize={12}
              color={tagsOverLimit ? "vermelho" : "inherit"}
            >
              {selectedTags?.length || 0}/{limit}
              {tagsOverLimit && " Limite atingido"}
            </Text>
          </VStack>
          <VStack align="start" flex={1}>
            <Heading fontSize={18}>Abordagens:</Heading>
            {isFetchingApproach && <LoadingInpa />}
            <CheckboxInpa
              loading={isValidatingExpert}
              defaultValues={defaultApproaches}
              setState={setSelectedApproaches}
              values={arrayApproaches}
              direction="column"
            />
          </VStack>
        </Wrap>
        <VStack pt={2} w="full" align="end">
          <Button
            onClick={() =>
              handlePatch({
                approaches: selectedApproachesToIds,
                tags: selectedTagsToIds,
                specialties: selectedSpecialtiesToIds,
              })
            }
            isLoading={isFetching}
            variant="ghost"
            borderRadius="full"
            title="Salvar"
          />
          {error && (
            <Alert w="fit-content" ml="auto" mt={2} status="warning">
              <AlertIcon />
              {error?.response.statusText || "Erro"}
            </Alert>
          )}
          {data.status == 200 && (
            <Alert
              alignSelf="end"
              w="fit-content"
              ml="auto"
              mt={2}
              status="success"
            >
              <AlertIcon />
              Informações atualizadas
            </Alert>
          )}
        </VStack>
      </Flex>
    </Flex>
  );
}
