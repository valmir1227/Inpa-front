import Head from "next/head";
import { Header } from "components/Header";
import { Hero } from "components/Hero";
import { Login } from "components/Login";
import { Heading, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMyContext } from "contexts/Context";
import { ModalRecuperarSenha } from "components/ModalRecuperarSenha";
import { ModalNovaSenha } from "components/ModalNovaSenha";
import { useEffect } from "react";
import { Footer } from "components/Footer";

export default function LoginPage() {
  const { user } = useMyContext();
  const router = useRouter() as any;
  /* if (user?.id && router.pathname === "/login")
    router.push(router.query?.redirect || "/"); */

  useEffect(() => {
    if (router.query?.reset) onOpenNovaSenha();
  }, [router]);

  const {
    isOpen: isOpenModalExcluir,
    onOpen: onOpenModalExcluir,
    onClose: onCloseModalExcluir,
  } = useDisclosure();

  const {
    isOpen: isOpenNovaSenha,
    onOpen: onOpenNovaSenha,
    onClose: onCloseNovaSenha,
  } = useDisclosure();
  return (
    <>
      <Head>
        <title>Login | Inpa</title>
        <meta property="og:title" content="Login | Inpa" />
        <meta name="description" content="Faça login em sua conta Inpa" />
        <meta
          property="og:description"
          content="Faça login em sua conta Inpa"
        />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Login onOpenModalExcluir={onOpenModalExcluir} />
      <Footer />
      <ModalRecuperarSenha
        isOpen={isOpenModalExcluir}
        onClose={onCloseModalExcluir}
      />
      <ModalNovaSenha isOpen={isOpenNovaSenha} onClose={onCloseNovaSenha} />
    </>
  );
}
