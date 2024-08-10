import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  VStack,
  Avatar,
  Center,
  FormLabel,
  Text,
  Checkbox,
  HStack,
  Textarea,
  Spinner,
  Alert,
  AlertIcon,
  Tag,
} from "@chakra-ui/react";

import { Input } from "../../global/Select";
import { MdEdit, MdManageAccounts, MdVerifiedUser } from "react-icons/md";
import { useMyContext } from "contexts/Context";
import { usePatch } from "hooks/usePatch";
import { usePost } from "hooks/usePost";
import { FiImage } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { Button } from "components/global/Button";
import { AlertInpaCall } from "components/global/Alert";
import useSWR from "swr";
import { fetcher } from "utils/api";
import { lighten } from "@chakra-ui/theme-tools";
import { useUsers } from "stores/useUser";

export function Perfil({ setEtapaPerfil }: any) {
  const { user, setUser } = useMyContext();
  const { setUserStore } = useUsers();
  const { data: dataAddress, isLoading: getAddress } = useSWR(
    "/v1/addresses",
    fetcher
  );
  const {
    data: dataExpert,
    error: errorExpert,
    isLoading: isFetchingExpert,
    mutate: getExpert,
  } = useSWR(user?.id ? `/v1/experts/${user?.id}` : null, fetcher);

  const { councils: crpsData } = dataExpert || {};

  const [firstAddress] = dataAddress || [];

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

  const cityAndState = `${firstAddress?.city}, ${firstAddress?.state}`;

  const gender = user?.show_gender ? user?.gender : "";
  const age = user?.show_age ? user?.age + " anos." : "";
  const comma = user?.show_age && user?.show_gender ? "," : "";
  const genderAndAge = `${gender}${comma} ${age}`;

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
      about: user?.about,
    } as any,
  });

  const [charAmount, setCharAmount] = useState(user?.about?.length || 0);

  function checkCharAmount() {
    if (charAmount > 1000) {
      return false;
    } else {
      return true;
    }
  }
  const onSubmit = (data: any) => {
    handlePatch(
      // console.log(
      { ...data, avatar: dataPostImage?.data?.url || user?.avatar }
    );
  };

  useEffect(() => {
    if (data.status === 200) {
      setUser({ ...user, avatar: dataPostImage?.data?.url || user?.avatar });
      setUserStore({
        ...user,
        avatar: dataPostImage?.data?.url || user?.avatar,
      });
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
        flexDir={{ base: "column", md: "row" }}
        gap={6}
        mt={4}
      >
        <VStack flex={1} align="start">
          <Heading fontSize={28}>Perfil</Heading>
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
                ignoreFallback
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
            <VStack flex={1} align="start">
              <Heading pb={2} fontSize={24} color="cinza">
                {user?.name}
              </Heading>
              <Flex
                flexWrap="wrap"
                onClick={() => setEtapaPerfil("crp")}
                fontWeight={500}
                fontSize={14}
                gap={4}
                _hover={{
                  cursor: "pointer",
                  b: { textDecor: "underline" },
                }}
              >
                {crpsData?.map((item: any) => (
                  <HStack pr={2} key={item.id}>
                    {item.status === "Approved" && (
                      <MdVerifiedUser color="green" />
                    )}
                    <Text>{`${item.council} ${item.number}`}</Text>
                  </HStack>
                ))}
                <Button
                  fontSize={18}
                  px={2}
                  py={1}
                  borderRadius={10}
                  title="Gerenciar Identidade Profissional"
                  leftIcon={<MdManageAccounts size={24} />}
                />
              </Flex>
              {firstAddress && (
                <Text fontSize={12} color="cinza">
                  {cityAndState}
                </Text>
              )}
              <Text fontSize={12} color="cinzaescuro">
                {genderAndAge}
              </Text>
              <HStack spacing={2} pt={2} align="start">
                <Checkbox
                  {...register("showGender")}
                  defaultChecked={user?.show_gender}
                  id="genero"
                  colorScheme="yellow"
                  _checked={{
                    span: { borderColor: "azul", backgroundColor: "azul" },
                  }}
                />
                <FormLabel
                  htmlFor="genero"
                  bg="white"
                  fontSize={12}
                  fontWeight={400}
                  color="cinzaescuro"
                  pr={4}
                >
                  Mostrar meu gênero
                </FormLabel>
                <Checkbox
                  {...register("showAge")}
                  defaultChecked={user?.show_age}
                  id="idade"
                  colorScheme="yellow"
                  _checked={{
                    span: { borderColor: "azul", backgroundColor: "azul" },
                  }}
                />
                <FormLabel
                  htmlFor="idade"
                  bg="white"
                  fontSize={12}
                  fontWeight={400}
                  color="cinzaescuro"
                >
                  Mostrar minha idade
                </FormLabel>
              </HStack>
            </VStack>
          </Flex>
        </VStack>
        <VStack w="full" flex={1} align="start">
          <Heading fontSize={24}>Descrição</Heading>
          <Textarea
            {...register("about", {
              validate: (value: any) =>
                checkCharAmount() || "Quantidade de caracteres inválida",
            })}
            _focus={{
              borderWidth: 1,
              borderColor: "amarelo",
            }}
            fontSize={14}
            h={180}
            placeholder="Sobre mim..."
            onChange={(e) => setCharAmount(e.target.value.length)}
          />
          <Text
            color={charAmount > 1000 ? "red" : "inherit"}
            alignSelf="flex-end"
            fontSize={12}
          >
            {charAmount} / 1000 caracteres
          </Text>
          <Button type="submit" alignSelf="end" title="Salvar" />
          {error && (
            <Alert w="fit-content" ml="auto" mt={2} status="warning">
              <AlertIcon />
              {error?.response.statusText || "Erro"}
            </Alert>
          )}

          <AlertInpaCall
            success={{
              validate: data.status == 200,
              text: "Perfil atualizado",
            }}
          />
          {Object.keys(errors).map((err) => {
            return (
              <Alert mt={2} key={err} status="warning">
                <AlertIcon />
                {errors[err]?.message}
              </Alert>
            );
          })}
        </VStack>
      </Flex>
    </Flex>
  );
}
