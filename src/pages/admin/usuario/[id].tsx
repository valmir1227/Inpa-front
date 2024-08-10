import {
  Box,
  Center,
  Flex,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { CRPs } from "components/admin/CRPs";
import { Saques } from "components/admin/Saques";
import { Usuarios } from "components/admin/Usuarios";
import { Relatorios } from "components/corporativo/Relatorios";
import { AlertInpa } from "components/global/Alert";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useEffect } from "react";
import { Header } from "../../../components/Header";
import { Hero } from "../../../components/Hero";
import { Login } from "../../../components/Login";
import { Sessoes } from "../../../components/psicologo/sessoes/Sessoes";
import { DadosPessoais } from "components/admin/usuario/DadosPessoais";
import { fetcher } from "utils/api";
import useSwr from "swr";

import { useRouter } from "next/router";
import { Configuracoes } from "components/admin/usuario/Configuracoes";
import { usePatch } from "hooks/usePatch";
import Link from "next/link";
import { LoadingInpa } from "../../../components/global/Loading";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isLoading, mutate } = useSwr(`/v1/users/${id}`, fetcher);
  const {
    data: dataUsers,
    error: errorUsers,
    isLoading: isFetchingUsers,
    isValidating: isValidatingUsers,
    mutate: getUsers,
  } = useSwr("v2/users?limit=50&permission=enterprise", fetcher);

  const [handlePatchUser, dataPatchUser, errorPatchUser, isPatchingUser] =
    usePatch(`/v1/users/${id}`);

  if (!id) return null; //evitar chamar swr sem id
  return (
    <>
      <Head>
        <title>Editar usuário | Inpa</title>
      </Head>
      <Header type="admin" />
      {isLoading && (
        <Center h={200}>
          <Spinner />
        </Center>
      )}
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
        <AlertInpa text="Logado como Admin alterando dados de outro usuário" />
        {!isLoading && data?.id && (
          <Tabs maxW={1200} w="full" colorScheme="teal" variant="enclosed">
            <TabList
            /* sx={{
                "&&[data-selected]": {
                  borderBottomColor: "#f3f3f3",
                  fontWeight: "bold",
                },
              }} */
            >
              <Tab
              // _selected={{ borderBottomWidth: 4, borderTopWidth: "inherit" }}
              >
                Dados Pessoais
              </Tab>
              <Tab>Configurações</Tab>
              <Link href="/admin/usuarios" passHref>
                <Tab>Voltar a lista de usuários</Tab>
              </Link>
            </TabList>
            <TabPanels>
              <TabPanel>
                <DadosPessoais
                  handlePatchUser={handlePatchUser}
                  dataPatchUser={dataPatchUser}
                  errorPatchUser={errorPatchUser}
                  isPatchingUser={isPatchingUser}
                  error={error}
                  isLoading={isLoading}
                  user={data}
                />
              </TabPanel>
              <TabPanel>
                <Configuracoes
                  user={data}
                  handlePatchUser={handlePatchUser}
                  dataPatchUser={dataPatchUser}
                  errorPatchUser={errorPatchUser}
                  isPatchingUser={isPatchingUser}
                  dataUsers={dataUsers}
                />
              </TabPanel>
              <TabPanel>
                <LoadingInpa />
                Carregando...
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Flex>
    </>
  );
}
