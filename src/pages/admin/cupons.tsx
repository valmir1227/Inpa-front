import { Center, Heading, Text } from "@chakra-ui/react";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useEffect } from "react";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Login } from "../../components/Login";
import { Carteira } from "../../components/psicologo/carteira/Carteira";
import { Sessoes } from "components/admin/Sessoes";
import { Cupons } from "components/admin/Cupons";

export default function CarteiraPage() {
  return (
    <>
      <Head>
        <title>Cupons | Inpa</title>
        <meta property="og:title" content="Cupons | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="admin" />
      <Cupons />
    </>
  );
}
