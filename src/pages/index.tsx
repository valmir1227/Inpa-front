import Head from "next/head";
import { Header } from "../components/Header";

import { AlertInpa } from "components/global/Alert";
import { Button } from "components/global/Button";
import { MdRefresh } from "react-icons/md";

export default function Page() {
  return (
    <>
      <Head>
        <title>Erro | Inpa</title>
        <meta property="og:title" content="Erro | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="paciente" />

      <AlertInpa text="Erro ao carregar a pagina">
        <Button
          m={2}
          title="Atualizar"
          onClick={() => window.location.reload()}
          leftIcon={<MdRefresh />}
        />
      </AlertInpa>
    </>
  );
}
