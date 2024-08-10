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
  const [dataCourses, errorCourses, isFetchingCourses, getCourses] =
    useFetch("/v1/courses");

  useEffect(() => {
    getBankAccounts();
    getCourses();
  }, []);

  return (
    <>
      <Head>
        <title>Minha conta | Inpa</title>
        <meta property="og:title" content="Perfil | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="corporativo" />
      {user?.id ? (
        <>
          <DadosPessoais
            handlePatch={handlePatch}
            data={data}
            error={error}
            isFetching={isFetching}
          />
          {/* {dataBankAccounts && !isFetchingBankAccounts && (
            <DadosBancarios
              dataBankAccounts={dataBankAccounts}
              errorBankAccounts={errorBankAccounts}
              isFetchingBankAccounts={isFetchingBankAccounts}
              getBankAccounts={getBankAccounts}
            />
          )} */}
          <AlterarSenha />
          <Endereco />
          {/* <AtendimentoPresencial /> */}
          {/* {dataCourses && !isFetchingCourses && (
            <Formacao dataCourses={dataCourses} getCourses={getCourses} />
          )}
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
