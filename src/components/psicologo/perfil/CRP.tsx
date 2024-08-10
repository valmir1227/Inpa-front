import React, { useState, useEffect } from "react";
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
  Checkbox,
  HStack,
  Textarea,
  CheckboxGroup,
  Stack,
  IconButton,
  Button as ChakraButton,
  Box,
  Tag,
  Alert,
  Badge,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Input as ChakraInput,
  Radio,
  RadioGroup,
  CloseButton,
  Select as ChakraSelect,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckboxInpa, CheckboxTagInpa } from "../../global/Checkbox";
import { BsDashCircle, BsPlusCircle } from "react-icons/bs";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { darken } from "@chakra-ui/theme-tools";
import { toReal } from "../../../utils/toReal";
import Link from "next/link";
import { Button, ButtonLink } from "../../global/Button";
import { MdEdit } from "react-icons/md";
import { Input, Select } from "../../global/Select";
import { ESTADOS, ESTADOS_SIGLA } from "../../../utils/ESTADOS";
import { FiX } from "react-icons/fi";
import { usePost } from "hooks/usePost";
import { useMyContext } from "contexts/Context";
import { useForm } from "react-hook-form";
import { GENEROS } from "utils/GENEROS";
import { toBrDate } from "utils/toBrDate";
import { useDel } from "hooks/useDel";
import { ModalExcluir } from "../minha-conta/ModalExcluir";
import { AlertInpaCall } from "components/global/Alert";
import { FaIdCard } from "react-icons/fa";
import { translateStatus } from "utils/translateStatus";
import { fetcher } from "utils/api";
import useSWR from "swr";
import { useUsers } from "stores/useUser";

export function CRP({ setEtapaPerfil }: any) {
  const {
    data: dataCRP,
    error: errorCRP,
    isLoading: isFetchingCRP,
    mutate: getCRP,
  } = useSWR("/v1/councils", fetcher) as any;
  const { user } = useMyContext();
  const { mutate: getExpert } = useSWR(
    user?.id ? `/v1/experts/${user?.id}` : null,
    fetcher
  );

  const [selectedCrp, setSelectedCrp] = useState<any>();

  const [handleDeleteCRP, dataDeleteCRP, errorDeleteCRP, isFetchingDeleteCRP] =
    useDel(`/v1/councils/${selectedCrp?.id}`);

  useEffect(() => {
    if (dataDeleteCRP?.status === 200) {
      /* getExpert(); */
      getCRP();
    }
  }, [dataDeleteCRP]);

  const { isOpen, onClose, onOpen } = useDisclosure();
  function handleDeleteModal(item: any) {
    setSelectedCrp(item);
    onOpen();
  }

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
      <AdicionarCrp />
      {dataCRP?.length > 0 && (
        <Flex
          p={{ base: "1rem", md: "2rem" }}
          bg="white"
          borderRadius={20}
          borderWidth={1}
          borderColor="cinza"
          maxW={1200}
          w="full"
          justify="space-between"
          align="center"
          flexDir="column"
          gap={2}
          as={RadioGroup}
        >
          <Wrap
            textAlign="center"
            fontSize={14}
            fontWeight={500}
            w="full"
            justify="space-between"
          >
            <Text flex={1}>Adicionado em</Text>
            <Text flex={1}>Conselho</Text>
            <Text flex={1}>Doc</Text>
            <Text flex={1}>Número</Text>
            <Text flex={1}>UF</Text>
            <Text flex={2}>Status</Text>
            <Box w={25} />
          </Wrap>

          {dataCRP?.map((item: any) => {
            return (
              <Wrap
                p={1}
                align="center"
                textAlign="center"
                w="full"
                justify="space-between"
                color="cinza"
                fontSize={13}
                key={item.id}
              >
                <Text flex={1}>{toBrDate(item.created_at)}</Text>
                <Text flex={1}>{item.council}</Text>
                <IconButton
                  flex={1}
                  as={item?.image && "a"}
                  disabled={!item?.image}
                  target="_blank"
                  href={item?.image ? item?.image : ""}
                  icon={<FaIdCard />}
                  size="sm"
                  aria-label="Ver documento"
                  variant="ghost"
                  color="cinza"
                />
                <Text flex={1}>{item.number}</Text>
                <Text flex={1}>{item.state}</Text>
                <Box flex={2}>
                  {item.reason && item.status === "Suspended" && (
                    <Button
                      onClick={
                        item?.reason
                          ? () => alert("Motivo: " + item.reason)
                          : undefined
                      }
                      fontWeight={14}
                      fontSize={12}
                      mr={2}
                      title="Motivo"
                      size="xs"
                    />
                  )}
                  <Tag
                    onClick={
                      item?.reason ? () => alert(item.reason) : undefined
                    }
                    fontWeight={14}
                    fontSize={12}
                    color="white"
                    bg={
                      item.status === "1" || item.status === "Approved"
                        ? "whatsapp.300"
                        : "amarelo"
                    }
                    borderRadius={6}
                  >
                    {translateStatus(item.status)}
                  </Tag>
                </Box>
                <CloseButton
                  color="#f00f0077"
                  size="sm"
                  aria-label="Apagar conselho"
                  variant="ghost"
                  onClick={() => handleDeleteModal(item)}
                />
              </Wrap>
            );
          })}
        </Flex>
      )}
      <Flex gap={4} p={8} w="full" maxW={1200} justify="end">
        <ChakraButton
          onClick={() => setEtapaPerfil("home")}
          variant="ghost"
          borderRadius="full"
          bg="white"
          alignSelf="start"
          color="cinzaescuro"
          px={5}
        >
          Voltar
        </ChakraButton>
        {/*  <Button
          onClick={() => setEtapaPerfil("home")}
          variant="ghost"
          borderRadius="full"
          alignSelf="start"
          px={8}
          title="Solicitar avaliação"
        /> */}
      </Flex>
      <ModalExcluir
        isOpen={isOpen}
        onClose={onClose}
        get={getExpert}
        confirmText={`Deseja remover o <b>${selectedCrp?.council} ${selectedCrp?.number} de ${selectedCrp?.state}</b> ?`}
        handleDelete={handleDeleteCRP}
        dataDelete={dataDeleteCRP}
        errorDelete={errorDeleteCRP}
        isFetchingDelete={isFetchingDeleteCRP}
      />
    </Flex>
  );
}

const AdicionarCrp = () => {
  const {
    data: dataCRP,
    error: errorCRP,
    isLoading: isFetchingCRP,
    mutate: getCRP,
  } = useSWR("/v1/councils", fetcher) as any;

  const { user } = useMyContext();
  const [handlePostCRP, dataPostCRP, errorPostCRP, isFetchingPostCRP] =
    usePost("/v1/councils");

  const { setCouncils } = useUsers();

  // ----------- IMAGE --------------
  const [selectedImage, setSelectedImage] = useState<any>();
  const types = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/avif",
    "application/pdf",
  ];

  const [handlePostImage, dataPostImage, errorPostImage, isUploadingImage] =
    usePost("v1/uploads/docs");

  const handleChange = (e: any) => {
    let [selected] = e.target.files;

    if (selected && types.includes(selected.type)) {
      setSelectedImage(e.target.files[0]);
      const formData = new FormData();
      formData.append("docs", selected);
      handlePostImage(formData);
    } else {
      alert(
        "Apenas arquivos de imagem (png, jpg, avif e webp) ou documentos PDF"
      );
    }
  };

  // ---------- IMAGE ----------
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (dataPostCRP?.status === 200) {
      /* getExpert(); */
      reset();
      setSelectedImage(null);
      getCRP();
      setCouncils([dataCRP?.data]);
    }
  }, [dataPostCRP]);

  function onSubmit(data: any) {
    const formatedPostCrpData = {
      userId: user?.id,
      type: data.type,
      council: data.council,
      number: data.number,
      state: data.uf,
      image: dataPostImage?.data?.url,
      status: "1",
    };
    // console.log(
    handlePostCRP(formatedPostCrpData);
  }

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      p={{ base: "1rem", md: "2rem" }}
      bg="white"
      color="cinzaescuro"
      borderRadius={20}
      borderWidth={1}
      align="center"
      maxW={1200}
      w="full"
      justify="space-between"
      flexDir="column"
    >
      <Heading alignSelf="start" fontSize={28}>
        Identidade profissional
      </Heading>

      <FormLabel
        alignItems="center"
        justifyContent="center"
        htmlFor="imagem"
        pos="relative"
      >
        <Center
          sx={{
            _hover: {
              cursor: "pointer",
              borderColor: "azul",
              borderWidth: 2,
            },
          }}
          h={200}
          w={300}
          bgImage={selectedImage && URL.createObjectURL(selectedImage)}
          bgSize="contain"
          bgPos="center center"
          bgRepeat="no-repeat"
          borderStyle="dashed"
          borderWidth={1}
          borderColor="cinza"
          _after={
            selectedImage?.type === "application/pdf"
              ? {
                  content: `"${selectedImage?.name}"`,
                }
              : {}
          }
        >
          <Text
            textAlign="center"
            hidden={selectedImage}
            px={10}
            fontSize={12}
            sx={{ b: { color: "azul" } }}
          >
            Adicione a imagem da sua <b>identidade profissional</b>.
          </Text>
        </Center>
        <ChakraInput
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
      <Wrap w="full" justify="center" pb={4} spacing={6}>
        <Input
          id="number"
          errors={errors}
          register={{
            ...register("number", { required: "Número" }),
          }}
          placeholder="1234-5"
          maxW={110}
          title="Número"
          variant="outline"
          labelColor="cinzaescuro"
        />
        <Input
          id="council"
          errors={errors}
          register={{
            ...register("council", { required: "Conselho" }),
          }}
          placeholder="CRP"
          maxW={110}
          title="Conselho"
          variant="outline"
          labelColor="cinzaescuro"
        />
        <Input
          id="type"
          errors={errors}
          register={{
            ...register("type", { required: "Tipo" }),
          }}
          placeholder="Psicólogo"
          maxW={110}
          title="Tipo"
          variant="outline"
          labelColor="cinzaescuro"
        />
        <Select
          register={{ ...register("uf", { required: "Estado" }) }}
          id="uf"
          maxW={110}
          variant="outline"
          titleColor="cinzaescuro"
          placeholder="UF"
          values={ESTADOS_SIGLA}
          title="Estado"
          isInvalid={!!errors.uf}
        />
      </Wrap>
      <Stack alignSelf="end">
        <Button
          type="submit"
          title="Adicionar"
          borderRadius={10}
          alignSelf="flex-end"
          px={6}
          isLoading={isFetchingPostCRP}
        />
        <AlertInpaCall
          success={{
            validate: dataPostCRP?.status === 200,
            text: "Identidade profissional recebida. Você será informado(a) quando ela for analisada.",
          }}
          error={{ validate: errorPostCRP, text: "Erro interno no cadastro" }}
        />
      </Stack>

      {errors.type && (
        <Wrap>
          <Alert w="fit-content" mt={2} status="warning">
            <AlertIcon />
            <Text fontWeight="bold">Campos obrigatórios</Text>
            {Object.values(errors)?.map((err: any) => {
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
            })}
          </Alert>
        </Wrap>
      )}
    </Flex>
  );
};
