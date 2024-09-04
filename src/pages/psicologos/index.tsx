import Head from "next/head";
import { Header } from "components/Header";
import { Psicologos } from "components/paciente/psicologos/Psicologos";
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
