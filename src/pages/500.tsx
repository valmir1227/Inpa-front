import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  Badge,
} from "@chakra-ui/react";
import Head from "next/head";
import { Header } from "../components/Header";
import { useRouter } from "next/router";

export default function Custom500() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>ERRO 500</title>
      </Head>
      <Header />
      <Box w="100%">
        <Flex
          p="5rem 1rem"
          align="center"
          maxW={1200}
          justify="space-between"
          h={400}
          flexDir="column"
        >
          <Heading>Página não encontrada</Heading>
          <HStack>
            <Text>Erro 404 no link:</Text>
            <Badge>{router.asPath}</Badge>
          </HStack>
          <Button as="a" href="/">
            Voltar
          </Button>
        </Flex>
      </Box>
    </>
  );
}
