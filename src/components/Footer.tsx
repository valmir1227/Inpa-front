import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  VStack,
  HStack,
  Center,
  Wrap,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { Button, ButtonLink } from "./global/Button";
import { Modal } from "./global/Modal";
import { TermosDeUsoIframe } from "./TermosDeUsoIframe";
import { FaArrowLeft } from "react-icons/fa";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export function Footer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex as="section" justify="center" align="center" w="100%">
      <Flex
        p="1rem"
        align="center"
        textAlign="center"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir={{ base: "column-reverse", sm: "row" }}

        //flexDir="column"
      >
        <VStack
          minH={100}
          align={["center", "start"]}
          justify="center"
          spacing={0}
          fontSize={[12, 16]}
        >
          <Image
            src="/logo-1-3.png"
            alt="Logo Inpa"
            width={[100, 150]}
            pb={5}
          />
          <Text textAlign="center" fontWeight={700}>
            Inpa Online Soluções Tecnológicas em Saúde LTDA
          </Text>
          <Text fontSize={[12, 14]}>
            Copyright © 2023 Todos os direitos reservados
          </Text>
        </VStack>
        <VStack align={["center", "start"]} h="full" p={4} spacing={0}>
          <Text
            fontSize={18}
            pb={2}
            textTransform={["inherit", "uppercase"]}
            fontWeight={700}
          >
            Suporte
          </Text>
          <Button
            fontWeight={400}
            color="#f5f5f5"
            fontSize={14}
            textColor="cinzaescuro"
            variant="link"
            title="Termos de Uso"
            onClick={onOpen}
            pb={1}
          />
          <ButtonLink
            fontWeight={400}
            alignSelf={["center", "start"]}
            target="_blank"
            color="#f5f5f5"
            fontSize={14}
            textColor="cinzaescuro"
            variant="link"
            title="Tópicos de Ajuda da Plataforma"
            href="https://inpaonline.zendesk.com/"
          />
          <ButtonLink
            fontWeight={400}
            alignSelf={["center", "start"]}
            target="_blank"
            color="#f5f5f5"
            fontSize={14}
            textColor="cinzaescuro"
            variant="link"
            title="Fale Conosco"
            href="https://inpaonline.zendesk.com/hc/pt-br/requests/new/"
          />
        </VStack>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
        <Center flexDir="column" gap={6}>
          <ButtonLink
            target="_blank"
            rightIcon={<ExternalLinkIcon />}
            href="https://docs.google.com/document/d/e/2PACX-1vTh9peRhbR7u7XVgqmUyJKbzmPJFZgJhH58KqL0B8zCiP8zJjUie9UwPMQDfAvj2M9EFd6SFP7BfHqR/pub"
            title="Termos do profissional"
            color="azul"
          />
          <ButtonLink
            target="_blank"
            rightIcon={<ExternalLinkIcon />}
            href="https://docs.google.com/document/d/e/2PACX-1vR6pXuMVOsFFb41GykmDFW11J65PW8zX1sCaiNT-ntA97XjvUc0BHOaevq1y2e6BxdW7-hPN3gQPeyn/pub"
            title="Termos do paciente"
          />
        </Center>
      </Modal>
    </Flex>
  );
}
