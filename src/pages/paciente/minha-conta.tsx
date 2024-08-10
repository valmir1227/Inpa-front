import { Center, Heading, Spinner, Text } from "@chakra-ui/react";
import { Button } from "components/global/Button";
import { useMyContext } from "contexts/Context";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Login } from "../../components/Login";
import { AlterarSenha } from "../../components/paciente/minha-conta/AlterarSenha";
import { DadosPessoais } from "../../components/paciente/minha-conta/DadosPessoais";
import { Endereco } from "../../components/paciente/minha-conta/Endereco";
import { Parentes } from "../../components/paciente/minha-conta/Parentes";
import { useUsers } from "stores/useUser";
import { AlertInpa } from "components/global/Alert";

export default function PerfilPage() {
  const { user } = useMyContext();
  const { user: userStore } = useUsers();
  const userProfileNeedsToUpdate =
    userStore?.id && userStore?.profile_updated === false;
  const userProfileNeedsAddress =
    userStore?.id && userStore?.addresses?.length < 1;
  return (
    <>
      <Head>
        <title>Minha conta | Inpa</title>
        <meta property="og:title" content="Minha conta | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="paciente" />

      {user?.id ? (
        <>
          {userProfileNeedsToUpdate && (
            <AlertInpa
              alignSelf="flex-end"
              text="Confirme se o CPF e o celular são válidos"
            />
          )}
          {userProfileNeedsAddress && (
            <AlertInpa alignSelf="flex-end" text="Adicione um endereço" />
          )}
          <DadosPessoais />
          <Endereco />
          <Parentes />
          <AlterarSenha />
        </>
      ) : (
        <Center h={200}>
          <Spinner />
        </Center>
      )}
    </>
  );
}
