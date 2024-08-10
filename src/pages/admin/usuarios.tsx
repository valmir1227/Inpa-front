import { Box, Center, Heading, Text } from "@chakra-ui/react";
import { CRPs } from "components/admin/CRPs";
import { Saques } from "components/admin/Saques";
import { Usuarios } from "components/admin/Usuarios";
import { Relatorios } from "components/corporativo/Relatorios";
import { AlertInpa } from "components/global/Alert";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useEffect } from "react";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Login } from "../../components/Login";
import { Sessoes } from "../../components/psicologo/sessoes/Sessoes";

export default function Page() {
  return (
    <>
      <Head>
        <title>Usuários | Inpa</title>
        <meta property="og:title" content="Usuários | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="admin" />
      <Usuarios />
    </>
  );
}
