import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Wrap,
  VStack,
  Avatar,
  Icon,
  Center,
  FormLabel,
  Text,
  Select,
  Alert,
  AlertIcon,
  Spinner,
} from "@chakra-ui/react";

import { Input } from "../../global/Select";
import { EditIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import { DatePickerInput } from "../../global/DatePickerInput";
import { GENEROS } from "utils/GENEROS";
import InputMask from "react-input-mask";
import { BsCalendar } from "react-icons/bs";
import { FiImage } from "react-icons/fi";
import { useMyContext } from "contexts/Context";
import { useForm } from "react-hook-form";
import { Button } from "components/global/Button";
import { usePatch } from "hooks/usePatch";
import { toBrDate0GMT } from "utils/toBrDate";
import { usePost } from "hooks/usePost";
import { BASE_URL } from "utils/CONFIG";
import { AlertInpaCall } from "components/global/Alert";
import { useUsers } from "stores/useUser";
import { useRouter } from "next/router";
import { useFetchUser } from "hooks/useFetchUser";

export function DadosPessoais() {
  const { user, getMe, setUser } = useMyContext();
  const { setUserStore } = useUsers();
  const router = useRouter();

  const [handlePatch, data, error, isFetching] = usePatch(
    `/v1/users/${user?.id}`
  );

  const [handlePostImage, dataPostImage, errorPostImage, isUploadingImage] =
    usePost("v1/uploads/avatar");

  const [selectedImage, setSelectedImage] = useState();

  const types = ["image/png", "image/jpeg", "image/webp", "image/avif"];

  const handleChange = (e: any) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setSelectedImage(e.target.files[0]);
      const formData = new FormData();
      formData.append("avatar_image", selected);
      handlePostImage(formData);
    } else {
      alert("Apenas arquivos de imagem (png, jpg, avif e webp)");
    }
  };

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      socialName: user?.social_name,
      doc: user?.doc,
      email: user?.email,
      phone: `(${user?.area_code}) ${user?.phone}`,
      phone2: user?.phone2,
      gender: user?.gender,
      birthday: toBrDate0GMT(user?.birthday),
      ethnicity: user?.ethnicity,
      civil_status: user?.civil_status,
    } as any,
  });

  const onSubmit = (data: any) => {
    const [area_code, phone] = data.phone.split(")");
    handlePatch({
      ...data,
      avatar: dataPostImage?.data?.url
        ? dataPostImage?.data?.url + "?date=" + new Date().getTime()
        : user?.avatar,
      areaCode: area_code.replace("(", ""),
      phone: phone?.replace("-", ""),
    });
  };

  const { mutate: mutateUser } = useFetchUser();

  useEffect(() => {
    if (data.status === 200) {
      setUser(data.data);
      mutateUser();
    }
  }, [data]);

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
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        bg="white"
        color="cinzaescuro"
        borderRadius={20}
        borderWidth={1}
        align="start"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir="column"
        gap={6}
        mt={4}
      >
        <Heading fontSize={28}>Dados pessoais</Heading>
        <Flex gap={6} w="full" flexDir={{ base: "column", sm: "row" }}>
          <FormLabel
            alignItems="center"
            justifyContent="center"
            htmlFor="imagem"
            pos="relative"
          >
            <Avatar
              sx={{
                _hover: {
                  svg: { fill: "amarelo" },
                  img: { filter: "grayscale(50%)" },
                  cursor: "pointer",
                },
              }}
              h={150}
              w={150}
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : user?.avatar
              }
              icon={<FiImage color="white" size={100} />}
              bg="cinzaclaro"
            >
              <Center
                rounded="full"
                color="white"
                bg="cinzaescuro"
                pos="absolute"
                w={35}
                h={35}
                bottom={2}
                right={2}
              >
                {isUploadingImage ? <Spinner /> : <MdEdit />}
              </Center>
            </Avatar>
            <Input
              display="none"
              type="file"
              id="imagem"
              onChange={handleChange}
            />
            <AlertInpaCall
              error={{
                validate: errorPostImage,
                text: "Erro interno no upload",
              }}
            />
          </FormLabel>

          <VStack w="full">
            <Input
              id="name"
              borderRadius={14}
              labelColor="cinzaescuro"
              title="Nome Completo"
              variant="outline"
              errors={errors}
              register={{
                ...register("name", { required: "Informe seu nome" }),
              }}
              // defaultValue={user?.name}
            />
            <Input
              id="social_name"
              borderRadius={14}
              labelColor="cinzaescuro"
              title="Nome a ser exibido na plataforma"
              variant="outline"
              errors={errors}
              register={{
                ...register("socialName"),
              }}
              // defaultValue={user?.social_name}
            />
          </VStack>
        </Flex>
        <Wrap overflow="visible" w="full" justify="space-between">
          <Input
            id="doc"
            borderRadius={14}
            labelColor="cinzaescuro"
            title="CPF"
            variant="outline"
            maxW={250}
            errors={errors}
            register={{
              ...register("doc", {
                required: "Informe seu CPF",
                minLength: { value: 11, message: "CPF inválido" },
                setValueAs: (v) => {
                  return v.match(/\d/g)?.join("");
                },
              }),
            }}
            // defaultValue={user?.doc}
          />
          <Input
            id="email"
            borderRadius={14}
            labelColor="cinzaescuro"
            title="Email"
            variant="outline"
            maxW={250}
            errors={errors}
            register={{
              ...register("email", { required: "Informe seu e-mail" }),
            }}
            // defaultValue={user?.email}
          />
          <Input
            as={InputMask}
            mask={"(99) 99999-9999"}
            maskChar={null}
            id="phone"
            borderRadius={14}
            labelColor="cinzaescuro"
            title="Celular"
            variant="outline"
            maxW={250}
            errors={errors}
            register={{
              ...register("phone", {
                required: "Informe seu número de celular",
                minLength: { value: 9, message: "Celular inválido" },
                setValueAs: (v) => {
                  return v.replace(/\s+/g, "");
                },
              }),
            }}
            defaultValue={`(${user?.area_code}) ${user?.phone}`}
          />
          <Input
            id="phone2"
            borderRadius={14}
            labelColor="cinzaescuro"
            title="Telefone"
            variant="outline"
            maxW={250}
            errors={errors}
            register={{
              ...register("phone2"),
            }}
            // defaultValue={user?.phone2}
          />
          <VStack maxW={250} w="full" pt={2}>
            <Text fontSize={14} alignSelf="start">
              Gênero
            </Text>
            <Select
              {...register("gender", { required: "Selecione seu gênero" })}
              id="gender"
              borderRadius={14}
              maxW={250}
              borderColor="cinzaclaro"
              placeholder={"Selecione uma opção"}
              // defaultValue={user?.gender}
              isInvalid={!!errors.gender}
            >
              {GENEROS.map((item: any) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </VStack>

          <Input
            id="birthday"
            as={InputMask}
            mask={user?.birthday && "99/99/9999"}
            register={{
              ...register("birthday", {
                setValueAs: (v) => {
                  const ymd = v?.split("/");
                  return `${ymd[2]}-${ymd[1]}-${ymd[0]}`;
                },
                required: "Informe sua data de nascimento",
                minLength: {
                  value: 10,
                  message: "Data inválida, digite no formato dd/mm/aaaa",
                },
              }),
            }}
            errors={errors}
            // as={DatePicker}
            // selected={dataDeNascimento}
            // onChange={(date: any) => setDataDeNascimento(date)}
            // locale={ptBR}
            // dateFormat="dd/MM/yyyy"
            maskChar={null}
            borderRadius={14}
            labelColor="cinzaescuro"
            title="Data de nascimento"
            variant="outline"
            maxW={250}
            defaultValue={toBrDate0GMT(user?.birthday)}
          />
          <Input
            id="ethnicity"
            errors={errors}
            register={{
              ...register("ethnicity"),
            }}
            borderRadius={14}
            labelColor="cinzaescuro"
            title="Raça/cor"
            variant="outline"
            maxW={250}
            // defaultValue={user?.ethnicity}
          />
          <Input
            id="civil_status"
            borderRadius={14}
            labelColor="cinzaescuro"
            title="Estado civil"
            variant="outline"
            maxW={250}
            errors={errors}
            register={{
              ...register("civil_status"),
            }}
            // defaultValue={user?.civil_status}
          />
          {/*  <Input
            id="school_level"
            borderRadius={14}
            labelColor="cinzaescuro"
            title="Especialização"
            variant="outline"
            maxW={250}
            errors={errors}
            register={{
              ...register("school_level"),
            }}
            // defaultValue={user?.school_level}
          /> */}
        </Wrap>
        <Button
          isLoading={isFetching || isUploadingImage}
          ml="auto"
          //TODO update user lelon
          title={
            !user.profile_updated ? "Confirmar dados" : "Salvar dados pessoais"
          }
          type="submit"
        />

        {error && (
          <Alert w="fit-content" ml="auto" mt={2} status="warning">
            <AlertIcon />
            {error?.response.data.message || "Erro"}
          </Alert>
        )}
        {data.status == 200 && (
          <Alert w="fit-content" ml="auto" mt={2} status="success">
            <AlertIcon />
            Dados pessoais atualizados
          </Alert>
        )}
        {Object.keys(errors).map((err) => {
          return (
            <Alert mt={2} key={err} status="warning">
              <AlertIcon />
              {errors[err]?.message}
            </Alert>
          );
        })}
      </Flex>
    </Flex>
  );
}
