import { Center, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Login } from "../../components/Login";
import { Psicologos } from "../../components/paciente/psicologos/Psicologos";
import { SinglePsicologos } from "../../components/paciente/psicologos/singlePsicologo";

export default function PerfilPage() {
  return (
    <>
      <Head>
        <title>Perfil | Inpa</title>
        <meta property="og:title" content="Perfil | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="paciente" />
      <SinglePsicologos />
    </>
  );
}
