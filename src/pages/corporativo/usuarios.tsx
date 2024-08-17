import { Center, Heading, Text } from "@chakra-ui/react";
import { Cadastro } from "components/corporativo/Cadastro";
import { Colaboradores } from "components/corporativo/Colaboradores";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import { usePost } from "hooks/usePost";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Login } from "../../components/Login";
import { Sessoes } from "../../components/psicologo/sessoes/Sessoes";

export default function ColaboradoresPage() {
  const { user } = useMyContext();
  
  const [
    handlePostPreRegister,
    dataPreRegister,
    errorPreRegister,
    creatingAccount,
  ] = usePost("/v1/users/preregister");
  const [handlePostCredits, dataCredits, errorCredits, isFetchingCredits] =
    usePost("/v1/credits");

  const [step, setStep] = useState("Usuarios");

  return (
    <>
      <Head>
        <title>Meus Usuários | Inpa</title>
        <meta property="og:title" content="Meus Usuários | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="corporativo" />
      {step === "Usuarios" ? (
        <Colaboradores
          creditsData={{
            handlePostCredits,
            dataCredits,
            errorCredits,
            isFetchingCredits,
          }}
          setStep={setStep}
          dataPreRegister={dataPreRegister}
        />
      ) : (
        <Cadastro
          setStep={setStep}
          preRegisterData={{
            handlePostPreRegister,
            dataPreRegister,
            errorPreRegister,
            creatingAccount,
          }}
        />
      )}
    </>
  );
}
