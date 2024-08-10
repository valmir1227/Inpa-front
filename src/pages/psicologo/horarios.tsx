import { Center, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Login } from "../../components/Login";
import { Horarios } from "../../components/psicologo/horarios/Horarios";

export default function HorariosPage() {
  return (
    <>
      <Head>
        <title>Horários | Inpa</title>
        <meta property="og:title" content="Horários | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="psicologo" />
      <Horarios />
    </>
  );
}
