import Head from "next/head";
import { Header } from "../../components/Header";
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
