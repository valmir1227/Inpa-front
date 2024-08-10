/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useEffect, useState } from "react";
import {
  Center,
  Circle,
  Flex,
  FormLabel,
  Heading,
  Text,
  Input as ChakraInput,
  Wrap,
} from "@chakra-ui/react";

import { DownloadIcon } from "@chakra-ui/icons";
import { FiX } from "react-icons/fi";
import { AlertInpaCall } from "components/global/Alert";

import { usePost } from "hooks/usePost";
import { usePut } from "hooks/usePut";

import { OFFICEMIME } from "utils/OFFICEMIME";
import { LoadingInpa } from "components/global/Loading";
import { BASE_URL } from "utils/CONFIG";

export function Anexos({
  isExpert,
  firstMedicalRecord,
  getMedicalRecords,
  getMedicalRecordsFromThisAppointment,
}: any) {
  // --- UPLOAD
  const [selectedImage, setSelectedImage] = useState();
  const types = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/avif",
    "application/pdf",
    ...OFFICEMIME,
  ];

  const [handleUpload, dataUpload, errorUpload, isUploading] =
    usePost("v1/uploads/docs");

  const handleChange = (e: any) => {
    let [selected] = e.target.files;

    if (selected && types.includes(selected.type)) {
      setSelectedImage(selected);
      const formData = new FormData();
      formData.append("docs", selected);
      handleUpload(formData);
    } else {
      alert(
        "Apenas arquivos de imagem, documentos PDF e arquivos do Office são permitidos"
      );
    }
  };

  // --- Post/put file to Medical Record
  const [
    handlePutMedicalRecord,
    dataPutMedicalRecord,
    errorPutMedicalRecord,
    isPutMedicalRecord,
  ] = usePut(`/v1/medicalrecords/${firstMedicalRecord?.id}`);

  useEffect(() => {
    if (dataUpload.status === 200) {
      const currentFiles = firstMedicalRecord?.attachments || [];
      const newFileUrl = dataUpload.data.url;
      const merged = [...currentFiles, newFileUrl];

      //remove inválidos do array
      const attachments = merged.filter((item) => item);
      handlePutMedicalRecord({ attachments });
    }
  }, [dataUpload]);

  useEffect(() => {
    if (dataPutMedicalRecord.status === 202) {
      getMedicalRecords();
      getMedicalRecordsFromThisAppointment();
    }
  }, [dataPutMedicalRecord]);

  function handleDeleteFile(selectedFile: any) {
    handlePutMedicalRecord({
      attachments: firstMedicalRecord?.attachments?.filter(
        (file: any) => file !== selectedFile
      ),
    });
  }

  if (!firstMedicalRecord) return null;

  return (
    <Flex
      p={{ base: "1rem", md: "2rem" }}
      bg="white"
      color="cinzaescuro"
      borderRadius={20}
      borderWidth={1}
      align="start"
      maxW={1200}
      w="full"
      // justify="space-between"
      flexDir="column"
    >
      <Heading fontSize={30}>Anexos</Heading>
      <Wrap w="full" justify="space-around">
        <Flex gap={4} flexDir="column" p={4} bg="bg" borderRadius={10} w={320}>
          {firstMedicalRecord?.attachments?.map((item: any) => (
            <Flex key={item} gap={2} w="full" align="center">
              <Text fontSize={12} color="cinza">
                {item.replace("/public/uploads/docs/", "")}
              </Text>
              <Circle
                ml="auto"
                _hover={{ cursor: "pointer", opacity: 1 }}
                bg="cinzaescuro"
                color="white"
                p={1}
                opacity={0.7}
                as="a"
                href={BASE_URL + item}
                target="_blank"
              >
                <DownloadIcon boxSize={2} />
              </Circle>
              {isExpert && (
                <Circle
                  onClick={() => handleDeleteFile(item)}
                  _hover={{ cursor: "pointer", opacity: 1 }}
                  bg="vermelho"
                  color="white"
                  p={1}
                  opacity={0.5}
                >
                  <FiX size={8} />
                </Circle>
              )}
            </Flex>
          ))}
        </Flex>

        {isExpert && (
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
              h={170}
              w={300}
              borderStyle="dashed"
              borderWidth={1}
              borderColor="cinza"
              flexDir="column"
              gap={2}
            >
              {isUploading || isPutMedicalRecord ? (
                <LoadingInpa />
              ) : (
                <Text textAlign="center" px={10} fontSize={12}>
                  Adicione seus arquivos
                </Text>
              )}
              <AlertInpaCall
                error={{
                  validate: errorUpload,
                  text: "Erro ao adicionar arquivo",
                }}
                success={{
                  validate: dataUpload?.status === 200,
                  text: "Arquivo anexado",
                }}
              />
            </Center>

            <ChakraInput
              display="none"
              type="file"
              multiple
              id="imagem"
              onChange={handleChange}
            />
          </FormLabel>
        )}
      </Wrap>
    </Flex>
  );
}
