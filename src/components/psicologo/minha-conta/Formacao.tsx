import React, { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Wrap,
  VStack,
  Text,
  HStack,
  Alert,
  AlertIcon,
  CloseButton,
  Tag,
  useDisclosure,
} from "@chakra-ui/react";

import { Input } from "../../global/Select";
import { Button } from "../../global/Button";
import { useMyContext } from "contexts/Context";
import { useFieldArray, useForm } from "react-hook-form";
import { usePost } from "hooks/usePost";
import { useDel } from "hooks/useDel";
import { ModalExcluir } from "./ModalExcluir";
import { AlertInpaCall } from "components/global/Alert";
import useSwr from "swr";
import { fetcher } from "utils/api";
import { LoadingInpa } from "components/global/Loading";

export function Formacao() {
  const {
    data: dataCourses,
    error: errorCourses,
    isLoading: isFetchingCourses,
    mutate: getCourses,
  } = useSwr("/v1/courses", fetcher);

  const [amount, setAmount] = useState(1);
  const { user } = useMyContext();

  const formatedCourses = dataCourses
    //remove dados de outro usuario, quando admin consulta
    ?.filter((course: any) => course?.user_id === user?.id)
    //formata os dados para o padrão do form (snake_case -> camelCase)
    .map((course: any) => ({
      courseName: course.course_name,
      typeOfDegree: course.type_of_degree,
      ...course,
    }));

  const [
    handlePostCourses,
    dataPostCourses,
    errorPostCourses,
    isFetchingPostCourses,
  ] = usePost("/v1/courses/uoc");

  const [selectedCourse, setSelectedCourse] = useState<any>({});
  const [
    handleDeleteCourses,
    dataDeleteCourses,
    errorDeleteCourses,
    isFetchingDeleteCourses,
  ] = useDel(`/v1/courses/${selectedCourse.id}`);

  useEffect(() => {
    if (dataCourses) {
      setValue(
        "cursos",
        dataCourses.map((course: any) => ({
          courseName: course.course_name,
          typeOfDegree: course.type_of_degree,
          ...course,
        })),
        { shouldValidate: true }
      );
      console.log(dataCourses);
    }
  }, [dataCourses]);

  useEffect(() => {
    if (dataPostCourses.status === 200) getCourses();
    if (!formatedCourses?.length)
      append({
        institution: "",
        initials: "",
        courseName: "",
        typeOfDegree: "",
        modality: "",
      });
  }, [dataPostCourses]);

  type FormValues = {
    cursos: {
      initials?: string;
      institution?: string;
      courseName?: string;
      course_name?: string;
      year?: number;
      modality?: string;
      typeOfDegree?: string;
      type_of_degree?: string;
      user_id?: number;
      id?: number;
    }[];
  };

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setError,
    clearErrors,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      cursos: formatedCourses?.sort(
        //sort by id
        (a: any, b: any) => a.id - b.id
      ),
    },
  });
  const onSubmit = (data: any) => {
    //
    handlePostCourses(data.cursos);
    //
    //
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cursos", // unique name for your Field Array
  });

  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleDeleteModal(item: any) {
    setSelectedCourse(item);
    onOpen();
  }

  if (isFetchingCourses) return <LoadingInpa />;

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
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        color="cinzaescuro"
        borderRadius={20}
        borderWidth={1}
        align="start"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir="column"
        gap={6}
      >
        <Heading fontSize={28}>Formação</Heading>
        {watch("cursos")
          ?.sort(
            //sort by id
            (a: any, b: any) => a.id - b.id
          )
          ?.map((item, index) => (
            <>
              <Flex
                key={item.id}
                w="full"
                justify="space-between"
                flexDir={["column", "row"]}
                pb={10}
                gap={6}
                borderBottomWidth={1}
              >
                <Wrap
                  overflow="visible"
                  justify="space-between"
                  w="full"
                  // maxW={520}
                  spacing={6}
                  direction="row"
                >
                  <Input
                    register={{
                      ...register(`cursos.${index}.initials`, {
                        required: "Sigla",
                      }),
                    }}
                    isInvalid={errors?.cursos?.[index]?.initials}
                    placeholder="UFMG / UFES / USP"
                    maxW="15%"
                    labelColor="cinzaescuro"
                    title="Sigla da instituição"
                    variant="outline"
                    borderRadius={14}
                    defaultValue={item?.initials}
                  />

                  <Input
                    register={{
                      ...register(`cursos.${index}.institution`, {
                        required: "Instituição",
                      }),
                    }}
                    isInvalid={errors?.cursos?.[index]?.institution}
                    maxW="38%"
                    labelColor="cinzaescuro"
                    title="Nome da instituição"
                    variant="outline"
                    borderRadius={14}
                    defaultValue={item?.institution}
                  />
                  <Input
                    register={{
                      ...register(`cursos.${index}.courseName`, {
                        required: "Nome do curso",
                      }),
                    }}
                    isInvalid={errors?.cursos?.[index]?.courseName}
                    maxW="38%"
                    labelColor="cinzaescuro"
                    title="Nome do curso"
                    variant="outline"
                    borderRadius={14}
                    defaultValue={item?.course_name}
                  />
                  <Input
                    register={{
                      ...register(`cursos.${index}.year`, {
                        required: "Ano de formação",
                        valueAsNumber: true,
                      }),
                    }}
                    type="number"
                    isInvalid={errors?.cursos?.[index]?.year}
                    maxW="30%"
                    labelColor="cinzaescuro"
                    title="Ano de formação"
                    variant="outline"
                    borderRadius={14}
                    defaultValue={item?.year}
                  />
                  <Input
                    register={{
                      ...register(`cursos.${index}.modality`, {
                        required: "Modalidade",
                      }),
                    }}
                    isInvalid={errors?.cursos?.[index]?.modality}
                    maxW="30%"
                    placeholder="Presencial, EAD, Intercâmbio"
                    labelColor="cinzaescuro"
                    title="Modalidade"
                    variant="outline"
                    borderRadius={14}
                    defaultValue={item?.modality}
                  />
                  <Input
                    register={{
                      ...register(`cursos.${index}.typeOfDegree`, {
                        required: "Tipo",
                      }),
                    }}
                    isInvalid={errors?.cursos?.[index]?.typeOfDegree}
                    maxW="30%"
                    placeholder="Bacharelado, Mestrado, Técnico"
                    labelColor="cinzaescuro"
                    title="Tipo"
                    variant="outline"
                    borderRadius={14}
                    defaultValue={item?.type_of_degree}
                  />

                  {/* <DatePickerInput title="Data de início" /> */}
                  {/* <DatePickerInput title="Data de término" /> */}
                </Wrap>
                <VStack
                  justify="center"
                  maxW={520}
                  w="full"
                  flex={1}
                  align="start"
                >
                  {/* <Text fontSize={14}>Descrição</Text>
              <Textarea
                _focus={{
                  borderWidth: 1,
                  borderColor: "amarelo",
                }}
                fontSize={14}
                h="full"
                placeholder="Uma breve descrição sobre o curso"
              /> */}
                  <HStack alignSelf="flex-end">
                    <CloseButton
                      size="sm"
                      color="red"
                      // onClick={() => remove(index)}
                      onClick={
                        //se é um field do banco, executa o useDel com modal, se é um field do front, executa um remove direto
                        item?.user_id
                          ? () => handleDeleteModal(item)
                          : () => remove(index)
                      }
                    />
                  </HStack>
                </VStack>
              </Flex>
              {errors.cursos?.[index] && (
                <Wrap>
                  <Alert w="fit-content" mt={2} status="warning">
                    <AlertIcon />
                    <Text fontWeight="bold">Campos obrigatórios</Text>
                    {Object.values(errors.cursos[index] || [])?.map(
                      (err: any) => {
                        return (
                          <Tag
                            color="red.300"
                            bg="white"
                            mx={2}
                            key={err}
                            fontWeight={400}
                            lineHeight={1}
                          >
                            {err?.message}
                          </Tag>
                        );
                      }
                    )}
                  </Alert>
                </Wrap>
              )}
            </>
          ))}
        <HStack w="full" justifyContent="space-between">
          <Button
            title="Adicionar Formação"
            borderRadius={10}
            onClick={() =>
              append({
                institution: "",
                initials: "",
                courseName: "",
                typeOfDegree: "",
                modality: "",
              })
            }
          />
          <VStack>
            <Button
              title="Salvar"
              type="submit"
              isLoading={isFetchingPostCourses}
            />
            <AlertInpaCall
              success={{
                validate: dataPostCourses.status === 200,
                text: "Formação atualizada",
              }}
            />
          </VStack>
        </HStack>
      </Flex>
      <ModalExcluir
        isOpen={isOpen}
        onClose={onClose}
        get={getCourses}
        confirmText={`Deseja remover a formação <b>${selectedCourse.course_name} de ${selectedCourse.year}</b> ?`}
        handleDelete={handleDeleteCourses}
        dataDelete={dataDeleteCourses}
        errorDelete={errorDeleteCourses}
        isFetchingDelete={isFetchingDeleteCourses}
      />
    </Flex>
  );
}
