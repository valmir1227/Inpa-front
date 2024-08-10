import { Footer } from "components/Footer";
import Head from "next/head";
import { Cadastro } from "../components/Cadastro";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";

export default function CadastroPage() {
  return (
    <>
      <Head>
        <title>Cadastro | Inpa</title>
        <meta property="og:title" content="Cadastro | Inpa" />
        <meta name="description" content="Cadastre sua conta Inpa" />
        <meta property="og:description" content="Cadastre sua conta Inpa" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Cadastro />
      <Footer />
    </>
  );
}
