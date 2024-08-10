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
import { JitsiMeeting } from "components/paciente/sessoes/Jitsi";

export default function Page() {
  const router = useRouter();
  const { user } = useMyContext();

  if (!router.query) return null;

  return (
    <>
      <Head>
        <title>Vídeo {router.query.id}</title>
      </Head>
      <Header type="paciente" />
      <Box w="100vw" h="100vh" bg="azul">
        <JitsiMeeting
          // spinner={LoadingInpa}
          domain={"jitsi.inpaonline.com.br"}
          roomName={`Sessão ${router?.query?.id}`}
          interfaceConfigOverwrite={{
            SHOW_CHROME_EXTENSION_BANNER: false,
          }}
          onApiReady={(externalApi) => {
            // here you can attach custom event listeners to the Jitsi Meet External API
            // you can also store it locally to execute commands
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100vh";
          }}
        />
      </Box>
    </>
  );
}
