import { useMyContext } from "contexts/Context";
import Head from "next/head";
import { Header } from "../components/Header";

export default function CorporativoPage() {
  const { user } = useMyContext();

  return (
    <>
      <Head>
        <title>Corporativo | Inpa</title>
        <meta property="og:title" content="Corporativo | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="corporativo" />
    </>
  );
}
