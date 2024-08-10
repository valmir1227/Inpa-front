import { useEffect } from "react";
import Head from "next/head";
import { Header } from "components/Header";
import { Psicologos } from "components/paciente/psicologos/Psicologos";
import { useFetch } from "hooks/useFetch";
import { useMyContext } from "contexts/Context";
import { useRouter } from "next/router";
import { Footer } from "components/Footer";

export default function PsicologosPage() {
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
      <Psicologos />
      <Footer />
    </>
  );
}
