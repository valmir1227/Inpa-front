import { useEffect } from "react";
import { Center, Heading, Spinner, Text } from "@chakra-ui/react";
import { AlterarSenha } from "components/paciente/minha-conta/AlterarSenha";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import { usePatch } from "hooks/usePatch";
import Head from "next/head";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Login } from "../../components/Login";

import { AtendimentoPresencial } from "../../components/psicologo/minha-conta/AtendimentoPresencial";
import { DadosBancarios } from "../../components/psicologo/minha-conta/DadosBancarios";
import { DadosPessoais } from "../../components/psicologo/minha-conta/DadosPessoais";
import { Formacao } from "../../components/psicologo/minha-conta/Formacao";
import { Idiomas } from "../../components/psicologo/minha-conta/Idiomas";
import { Endereco } from "components/paciente/minha-conta/Endereco";
import { AlertInpa } from "components/global/Alert";
import { useUsers } from "stores/useUser";

export default function PerfilPage() {
  const { user } = useMyContext();
  const [handlePatch, data, error, isFetching] = usePatch(
    `/v1/users/${user?.id}`
  );
  const [
    dataBankAccounts,
    errorBankAccounts,
    isFetchingBankAccounts,
    getBankAccounts,
  ] = useFetch("/v1/bankaccounts");

  useEffect(() => {
    getBankAccounts();
  }, []);

  const { user: userStore } = useUsers();
  const userProfileNeedsToUpdate =
    userStore?.id && userStore?.profile_updated === false;

  return (
    <>
      <Head>
        <title>Minha conta | Inpa</title>
        <meta property="og:title" content="Perfil | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="psicologo" />
      {user?.id ? (
        <>
          {userProfileNeedsToUpdate && (
            <AlertInpa
              alignSelf="flex-end"
              text="Confirme se o CPF e o celular são válidos"
            />
          )}
          <DadosPessoais
            handlePatch={handlePatch}
            data={data}
            error={error}
            isFetching={isFetching}
          />
          {dataBankAccounts && !isFetchingBankAccounts && (
            <DadosBancarios
              dataBankAccounts={dataBankAccounts}
              errorBankAccounts={errorBankAccounts}
              isFetchingBankAccounts={isFetchingBankAccounts}
              getBankAccounts={getBankAccounts}
            />
          )}
          <AlterarSenha />
          <Endereco />
          {/* <AtendimentoPresencial /> */}
          {/* <Formacao dataCourses={dataCourses} getCourses={getCourses} />
          <Idiomas /> */}
        </>
      ) : (
        <Center h={200}>
          <Spinner />
        </Center>
      )}
    </>
  );
}
