import React, { useEffect } from "react";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "../../../components/Header";
import { Online } from "../../../components/paciente/sessoes/Online";
import { toReal } from "utils/toReal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { expertCityState } from "components/global/expertCityState";
import { usePatch } from "hooks/usePatch";
import { SingleSessao } from "components/psicologo/sessoes/singleSessao";
import { AlertInpa } from "components/global/Alert";
import { BASE_URL } from "utils/CONFIG";
import { MyComponent } from "components/MemoComponent";
import { Center } from "@chakra-ui/react";
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

  const [handlePatch, dataPatch, errorPatch, isPatching] = usePatch(
    `/v1/appointments/${router.query.id}`
  );

  const councils = data?.expert?.councils?.map(
    (item: any) => `${item?.council} - ${item?.number}`
  );

  const formattedData = data?.id && {
    service: {
      name: data.service_name,
      id: data.service_id,
      value: toReal(data.service_value),
      location: data.location,
      familiar: data.service_name === "Psicoterapia Familiar",
    },
    patient: {
      name: data.patient.name,
      social_name: data.patient.social_name,
      id: data.patient_id,
      avatar: data.patient.avatar && data.patient.avatar,
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
    if (user?.id) {
      getParticipant();
    }
  }, [user]);

  const Content = () => {
    if (error)
      return (
        <AlertInpa
          status="warning"
          text={error.response.data.error || "Erro ao carregar sessões"}
        />
      );
    if (!isFetching && data.expert_id !== user?.id)
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
          patch={{ handlePatch, dataPatch, errorPatch, isPatching }}
          router={router}
        />
      );
    } else
      return (
        <Online
          type="expert"
          dataAppointment={{ data, error, isFetching, get }}
        />
      );
  };

  if (!router.query.id) return null;

  return (
    <>
      <Head>
        <title>Sessão | Inpa</title>
        <meta property="og:title" content="Perfil | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="psicologo" />
      <Content />
    </>
  );
}
