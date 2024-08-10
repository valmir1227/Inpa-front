import {
  Center,
  Heading,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Login } from "../../components/Login";
import { Agenda } from "../../components/psicologo/horarios/Agenda";
import { Horarios } from "../../components/psicologo/horarios/Horarios";
import { Atendimento } from "../../components/psicologo/perfil/Atendimento";
import { AtivarPresencial } from "../../components/psicologo/presencial/AtivarPresencial";
import { Consultorio } from "../../components/psicologo/presencial/Consultorio";

export default function HorariosPage() {
  const { user } = useMyContext();
  const { isOpen, onToggle } = useDisclosure();
  const [etapaPerfil, setEtapaPerfil] = useState("home");
  const [dataCRP, errorCRP, isFetchingCRP, getCRP] = useFetch("/v1/councils");

  const [dataExpert, errorExpert, isFetchingExpert, getExpert] = useFetch(
    `/v1/experts/${user?.id}`
  );
  useEffect(() => {
    if (user?.id) {
      getExpert();
      getCRP();
    }
  }, [user]);
  return (
    <>
      <Head>
        <title>Atendimento Presencial | Inpa</title>
        <meta property="og:title" content="Atendimento Presencial | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="psicologo" />
      <AtivarPresencial isOpen={isOpen} onToggle={onToggle} />
      {isOpen && (
        <>
          <Consultorio />

          {user && dataCRP && (
            <Atendimento
              loading={isFetchingExpert}
              dataExpert={dataExpert}
              dataCRP={dataCRP}
            />
          )}
          <Horarios />
        </>
      )}
    </>
  );
}
