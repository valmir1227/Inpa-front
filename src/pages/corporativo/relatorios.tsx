import { Box, Center, Heading, Text } from "@chakra-ui/react";
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

export default function RelatoriosPage() {
  const { user } = useMyContext();

  return (
    <>
      <Head>
        <title>Relatórios | Inpa</title>
        <meta property="og:title" content="Relatórios | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="corporativo" />
      <AlertInpa text="O período deve ser maior que 30 dias, número de registros maior que 100, e data mais próxima anterior a 30 dias" />
      <Relatorios />
    </>
  );
}
