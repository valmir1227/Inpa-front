import React, { useEffect } from "react";
import { Center, Heading, Text } from "@chakra-ui/react";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "../../../components/Header";
import { Hero } from "../../../components/Hero";
import { Login } from "../../../components/Login";
import { Psicologos } from "../../../components/paciente/psicologos/Psicologos";
import { SinglePsicologos } from "../../../components/paciente/psicologos/singlePsicologo";
import { Online } from "../../../components/paciente/sessoes/Online";
import { SingleSessao } from "../../../components/paciente/sessoes/singleSessao";
import { toReal } from "utils/toReal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { expertCityState } from "components/global/expertCityState";
import { usePut } from "hooks/usePut";
import { usePatch } from "hooks/usePatch";
import { AlertInpa } from "components/global/Alert";
import { BASE_URL } from "utils/CONFIG";
import { fetcher } from "utils/api";
import useSwr from "swr";

export default function PerfilPage() {
  const router = useRouter();
  const { user } = useMyContext();

  const {
    data,
    error,
    isLoading: isFetching,
    isValidating,
    mutate: get,
  } = useSwr(
    router.query.id ? `v1/appointments/${router.query.id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const [
    dataParticipant,
    errorParticipant,
    isFetchingParticipant,
    getParticipant,
  ] = useFetch("/v1/participants", null, true);

  const councils = data?.expert?.councils?.map(
    (item: any) => `${item?.council} - ${item?.number}`
  );

  const formattedData = data?.id && {
    service: {
      name: data.service_name,
      id: data.service_id,
      value: toReal(data.service_value, user),
      location: data.location,
      familiar: data.service_name === "Psicoterapia Familiar",
    },
    expert: {
      name: data.expert.name,
      id: data.expert_id,
      avatar: data.expert.avatar && data.expert.avatar,
      address: expertCityState(data.expert),
      councils,
    },
    date: {
      iso: data.hour,
      date: new Date(data.hour),
      weekShort: format(new Date(data.hour), "eeeeee", {
        locale: ptBR,
      }),
      short: format(new Date(data.hour), "dd/MM"),
      hourShort: format(new Date(data.hour), "HH:mm"),
    },
  };

  useEffect(() => {
    if (user?.id && router.query.id) {
      getParticipant();
    }
  }, [user, router]);

  const Content = () => {
    if (error)
      return (
        <AlertInpa
          status="warning"
          text={error.response.data.error || "Erro ao carregar sessões"}
        />
      );
    if (!isFetching && data?.patient_id !== user?.id)
      return <AlertInpa text="Acesso negado" status="warning" />;
    if (router.query.online === undefined) {
      return (
        <SingleSessao
          dataAppointment={{
            formattedData,
            data,
            error,
            isFetching,
            isValidating,
            get,
          }}
          dataParticipants={{
            dataParticipant,
            errorParticipant,
            isFetchingParticipant,
            getParticipant,
          }}
          /* patch={{ handlePatch, dataPatch, errorPatch, isPatching }} */
          router={router}
        />
      );
    } else
      return (
        <Online
          type="patient"
          dataAppointment={{ data, error, isFetching, get }}
        />
      );
  };

  return (
    <>
      <Head>
        <title>Sessão | Inpa</title>
        <meta property="og:title" content="Perfil | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="paciente" />
      <Content />
    </>
  );
}
