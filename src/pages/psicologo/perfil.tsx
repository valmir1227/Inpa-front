import Head from "next/head";
import { useState } from "react";
import { Header } from "../../components/Header";
import { Atendimento } from "../../components/psicologo/perfil/Atendimento";
import { ConfigDeAtendimento } from "../../components/psicologo/perfil/ConfigDeAtendimento";
import { CRP } from "../../components/psicologo/perfil/CRP";
import { Perfil } from "../../components/psicologo/perfil/Perfil";
import { useMyContext } from "contexts/Context";
import { fetcher } from "utils/api";
import useSWR from "swr";
import { useUsers } from "stores/useUser";
import { LoadingInpa } from "components/global/Loading";
import { Formacao } from "components/psicologo/minha-conta/Formacao";
import { Idiomas } from "components/psicologo/minha-conta/Idiomas";

export default function PerfilPage() {
  // const { user } = useMyContext();
  const [etapaPerfil, setEtapaPerfil] = useState("home");
  const { user } = useUsers();
  const {
    data: dataExpert,
    error: errorExpert,
    isLoading: isLoadingExpert,
    isValidating: isValidatingExpert,
    mutate: getExpert,
  } = useSWR(user?.id ? `/v1/experts/${user?.id}` : null, fetcher, {
    revalidateOnFocus: false,
  });

  function EtapaAtual() {
    switch (etapaPerfil) {
      case "crp":
        return <CRP setEtapaPerfil={setEtapaPerfil} />;
      default:
        return (
          <>
            <Perfil setEtapaPerfil={setEtapaPerfil} />
            <Atendimento setEtapaPerfil={setEtapaPerfil} />
            <ConfigDeAtendimento />
            <Formacao />
            <Idiomas />
          </>
        );
    }
  }
  return (
    <>
      <Head>
        <title>Perfil | Inpa</title>
        <meta property="og:title" content="Perfil | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="psicologo" />
      <EtapaAtual />
    </>
  );
}
