import { useMyContext } from "contexts/Context";
import Head from "next/head";
import { Header } from "../../components/Header";
import { Sessoes } from "../../components/psicologo/sessoes/Sessoes";

export default function SessoesPage() {
  const { user } = useMyContext();

  return (
    <>
      <Head>
        <title>Minhas Sessões | Inpa</title>
        <meta property="og:title" content="Minhas Sessões | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="psicologo" />
      <Sessoes />
    </>
  );
}
