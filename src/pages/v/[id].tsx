import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  Badge,
  Stack,
} from "@chakra-ui/react";
import Head from "next/head";
import { Header } from "../../components/Header";
import { useRouter } from "next/router";
import VideoRoomComponent from "../../components/openvidu/components/VideoRoomComponent";
import { useMyContext } from "contexts/Context";
import { AlertInpa } from "components/global/Alert";
import { useFetch } from "hooks/useFetch";
import { useEffect } from "react";
import axios from "axios";
import { LoadingInpa } from "components/global/Loading";
import { useJwt } from "react-jwt";
import { Jitsi } from "components/paciente/sessoes/online/Jitsi";

export default function Page() {
  const router = useRouter();
  const { user } = useMyContext();

  const [data, error, isFetching, get] = useFetch("/health");
  useEffect(() => {
    get();
  }, []);

  const isPublic = router.query?.public !== undefined;

  const JitsiServerUrl =
    router.query.amb === "dev" ? "wss://ov.kanel.com.br" : data?.others?.jitsi;

  const token = router.query?.t as string;

  const openViduFullToken =
    JitsiServerUrl + "?sessionId=" + router.query.id + "&token=" + token;

  const { decodedToken, isExpired } = useJwt(token) as any;

  const { name } = decodedToken?.context?.user || {};
  console.log(decodedToken);

  //"wss://openvidu.inpa.online?sessionId=expert-fulano-nelio-alcantara-azevedo-appointmentId182&token=tok_AuZrH7CwJiwepMbs"

  if (!router.query.id) return null;
  if (isFetching) return <LoadingInpa />;
  if (!data?.others?.jitsi)
    return <AlertInpa text="Erro no endereço do Jitsi" />;

  const Video = () => {
    if (data?.others?.tele === "JITSI") {
      return (
        <Jitsi
          dataOvToken={{ jitsiToken: router.query?.t }}
          isFetchingOvToken={false}
          data={{ id: router.query.id, name }}
          health={data}
        />
      );
    } else
      return (
        <VideoRoomComponent
          router={router}
          sessionId={router.query.id}
          user={name}
          token={openViduFullToken}
        />
      );
  };

  return (
    <>
      <Head>
        <title>Sessão {router.query.id}</title>
      </Head>
      <Header type="paciente" />
      {user?.id || isPublic ? (
        <Video />
      ) : (
        <AlertInpa text="Faça login e acesse o link novamente" />
      )}
    </>
  );
}
