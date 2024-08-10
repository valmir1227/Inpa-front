import React, { useEffect, useState } from "react";
import {
  Box,
  chakra,
  Container,
  Text,
  HStack,
  VStack,
  Flex,
  Icon,
  useColorModeValue,
  Badge,
  Tag,
  Textarea,
  useBoolean,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { FaRegNewspaper } from "react-icons/fa";
import { BsClipboardPlus, BsGithub, BsPlus, BsTrash } from "react-icons/bs";
import { IconType } from "react-icons";
import { toBrFullDate } from "utils/toBrDate";
import { Button } from "components/global/Button";
import { DownloadIcon, LockIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { MdDetails, MdNoteAdd } from "react-icons/md";
import { usePost } from "hooks/usePost";
import useSwr from "swr";
import { isEmpty } from "lodash";
import { useDel } from "hooks/useDel";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

export const Timeline = ({ data, getMedicalRecords }: any) => {
  const router = useRouter();
  // if (!data) return null;
  return (
    <Container p={0} maxWidth={1200}>
      <chakra.h3 fontSize="3xl" fontWeight="bold" textAlign="center">
        Evoluções
      </chakra.h3>
      {data?.map((record: any, index: any) => {
        const sameRecordAsSession: any =
          record?.appointment_id === +router.query.id!;
        return (
          <Flex key={index} mb="10px">
            <LineWithDot sameRecordAsSession={sameRecordAsSession} />
            <Card
              sameRecordAsSession={sameRecordAsSession}
              record={record}
              getMedicalRecords={getMedicalRecords}
            />
          </Flex>
        );
      })}
    </Container>
  );
};

const Card = ({ record, getMedicalRecords, sameRecordAsSession }: any) => {
  const router = useRouter();
  const [
    handlePostComment,
    dataPostComment,
    errorPostComment,
    isPostingComment,
  ] = usePost("v1/medicalrecordscomments");

  const [handleDelComment, dataDelComment, errorDelComment, isDeletingComment] =
    useDel(`/v1/medicalrecordscomments/`);

  useEffect(() => {
    if (dataPostComment.status === 201 || dataDelComment.status === 200)
      getMedicalRecords();
  }, [dataPostComment, dataDelComment]);

  const [showTextArea, setShowTextArea] = useBoolean();
  const [textAreaContent, setTextAreaContent] = useState("");
  const MotionVStack = motion(VStack);

  return (
    <HStack
      w="full"
      p={3}
      bg="white"
      borderWidth={1}
      borderColor={sameRecordAsSession ? "amarelo" : "azul"}
      spacing={5}
      rounded="lg"
      alignItems="center"
      pos="relative"
      my={3}
      mr={[0, 8]}
      _before={{
        content: `""`,
        w: "0",
        h: "0",
        borderColor: `transparent ${
          sameRecordAsSession ? "#FFA61A" : "#00B5B8"
        } transparent`,
        borderStyle: "solid",
        borderWidth: "15px 15px 15px 0",
        position: "absolute",
        left: "-15px",
        display: "block",
      }}
    >
      {/* <Icon as={icon} w={4} h={4} color="azul" /> */}
      <Box w="full" display="block">
        <Stack
          direction={["column", "row"]}
          align="center"
          justifyContent="space-between"
          spacing={2}
          mb={1}
          borderBottomWidth={1}
          pb={2}
        >
          <Text fontSize="xs" whiteSpace="break-spaces">
            Criado: {"\n"}
            {toBrFullDate(record.created_at)}
          </Text>
          <Text fontSize="xs" whiteSpace="break-spaces">
            Atualizado:{"\n"}
            {toBrFullDate(record.updated_at)}
          </Text>
          <HStack align="center">
            <LockIcon color="gray.500" w={3} h={3} />
            <Text fontSize="xs" whiteSpace="break-spaces">
              Privacidade:{"\n"}
              {record.shared ? "Compartilhado" : "Somente profissional"}
            </Text>
          </HStack>
        </Stack>
        <VStack align="left" spacing={2} mb={3} textAlign="left">
          <Text
            fontSize={16}
            dangerouslySetInnerHTML={{ __html: record?.notes || "<p>-</p>" }}
          />
        </VStack>
        <Badge color="cinzaescuro">Cids: {record.ci_ds?.join(", ")}</Badge>
        {record.attachments?.map((file: string) => (
          <Link key={file} href={file} passHref>
            <a target="_blank">
              <Button
                m={2}
                fontWeight={400}
                key={file}
                color="gray.100"
                textColor="cinzaescuro"
                size="xs"
                href={file}
                leftIcon={<DownloadIcon />}
                fontSize={12}
                title="Anexo"
              />
            </a>
          </Link>
        ))}
        {/* <VStack p={2} rounded="md" mt={4} w="full" bg="bg">
          <Flex w="full" justify="space-between">
            <Text fontWeight="bold">Anotações</Text>
            <Button
              fontWeight={500}
              onClick={setShowTextArea.toggle}
              title={showTextArea ? "Cancelar" : "Nova anotação"}
              size="xs"
              isLoading={isPostingComment || isDeletingComment}
            />
          </Flex>
          {showTextArea && (
            <>
              <Textarea
                _focus={{
                  borderWidth: 1,
                  borderColor: "amarelo",
                }}
                onBlur={(e) => setTextAreaContent(e.target.value)}
              />
              <Button
                alignSelf="flex-end"
                title="Salvar"
                size="sm"
                rounded="md"
                onClick={() => {
                  handlePostComment({
                    medicalRecordId: record.id,
                    comment: textAreaContent || "Nenhum texto informado",
                  });
                  setShowTextArea.off();
                }}
              />
            </>
          )}
          {isEmpty(!record.comments) && (
            <VStack p={1} rounded="md" mt={4} w="full">
              <AnimatePresence>
                {record.comments.map((comment: any, index: any) => (
                  <MotionVStack
                    as={motion.div}
                    key={comment.id}
                    align="start"
                    w="full"
                    borderTopWidth={1}
                    borderColor="cinzaclaro"
                    spacing={0}
                    py={2}
                    // initial={false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <HStack w="full" justify="space-between">
                      <Text color="azul" fontSize="xs">
                        {toBrFullDate(comment.created_at)}
                      </Text>
                      <IconButton
                        onClick={() => {
                          if (
                            confirm("Excluir permanentemente essa anotação ?")
                          ) {
                            handleDelComment(comment.id);
                          }
                        }}
                        as={BsTrash}
                        minW={3}
                        w={3}
                        color="cinza"
                        _hover={{ color: "azul" }}
                        cursor="pointer"
                        aria-label="Excluir anotação"
                        variant="link"
                      />
                    </HStack>
                    <Text>{comment.comment}</Text>
                  </MotionVStack>
                ))}
              </AnimatePresence>
            </VStack>
          )}
        </VStack> */}
      </Box>
    </HStack>
  );
};

/* {data.data.map((record: any) => (
  <Wrap
    py={2}
    key={record.id}
    w="full"
    fontSize={14}
    color="cinza"
    borderBottomWidth={1}
    spacingX={4}
  >
    <Text>Criado: {toBrFullDate(record.created_at)}</Text>
    <Text>Atualizado: {toBrFullDate(record.updated_at)}</Text>
    <Text>
      Privacidade: {record.shared ? "Compartilhado" : "Privado"}
    </Text>
    <Text>Cids: {record.ci_ds?.join(", ")}</Text>
    <Box color="black" w="full">
      <Text
        fontSize={16}
        dangerouslySetInnerHTML={{ __html: record?.notes || "<p>-</p>" }}
      />
      {record.attachments?.map((file: string) => (
        <Link key={file} href={file} passHref>
          <a target="_blank">
            <Button
              m={2}
              fontWeight={400}
              key={file}
              // color="cinzaclaro"
              size="xs"
              href={file}
              leftIcon={<DownloadIcon />}
              fontSize={12}
              title="Anexo"
            />
          </a>
        </Link>
      ))}
    </Box>
  </Wrap>
))} */

const LineWithDot = ({ sameRecordAsSession }: any) => {
  return (
    <Flex pos="relative" alignItems="center" mr="30px">
      <chakra.span
        position="absolute"
        left="50%"
        height="calc(100% + 10px)"
        border="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        top="0px"
      ></chakra.span>
      <Box pos="relative" p="10px">
        <Box
          pos="absolute"
          width="100%"
          height="100%"
          bottom="0"
          right="0"
          top="0"
          left="0"
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          backgroundPosition="center center"
          backgroundColor="rgb(255, 255, 255)"
          borderRadius="100px"
          border={`3px solid ${sameRecordAsSession ? "#FFA61A" : "#00B5B8"}`}
          backgroundImage="none"
          opacity={1}
        ></Box>
      </Box>
    </Flex>
  );
};
