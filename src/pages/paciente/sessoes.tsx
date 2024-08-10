import { useEffect, useState } from "react";
import { Center, Heading, Text } from "@chakra-ui/react";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Login } from "../../components/Login";
import { Sessoes } from "../../components/paciente/sessoes/Sessoes";
import { useForm } from "react-hook-form";
import { dateToDbDate } from "utils/toBrDate";

export default function SessoesPage() {
  return (
    <>
      <Head>
        <title>Minhas Sessões | Inpa</title>
        <meta property="og:title" content="Minhas Sessões | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="paciente" />
      <Sessoes />
    </>
  );
}
