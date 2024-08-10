import { Center, Heading, Text } from "@chakra-ui/react";
import { Carteira } from "components/corporativo/Carteira";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useEffect } from "react";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Login } from "../../components/Login";
import { Sessoes } from "../../components/psicologo/sessoes/Sessoes";

export default function CarteiraPage() {
  const { user } = useMyContext();

  return (
    <>
      <Head>
        <title>Carteira | Inpa</title>
        <meta property="og:title" content="Carteira | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="corporativo" />
      <Carteira />
    </>
  );
}
