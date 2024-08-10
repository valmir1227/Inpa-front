import React from "react";
import { Box } from "@chakra-ui/react";

import { useMyContext } from "contexts/Context";

import { LoadingInpa } from "components/global/Loading";
import { useRouter } from "next/router";
import { JitsiMeeting } from "../Jitsi";

export const Jitsi = ({
  dataOvToken,
  isFetchingOvToken,
  data,
  health,
}: any) => {
  console.log({ data });
  const router = useRouter();
  const { user } = useMyContext();
  if (isFetchingOvToken) return <LoadingInpa />;
  if (!router.isReady || !dataOvToken || !health?.others) return null;
  if (health?.others?.tele?.toLowerCase() !== "jitsi") {
    return null;
  }
  return (
    <Box w="100vw" h="90vh" bg="cinzaclaro">
      <JitsiMeeting
        spinner={LoadingInpa}
        domain={health?.others?.jitsi}
        roomName={String(data?.id)}
        interfaceConfigOverwrite={{
          SHOW_CHROME_EXTENSION_BANNER: false,
        }}
        jwt={dataOvToken?.jitsiToken}
        // jwt={router.query.jwt ? dataOvToken?.jitsiToken : false}
        userInfo={{
          displayName: user?.name || data?.name || "Participante",
          email: user?.email,
        }}
        onApiReady={(externalApi) => {
          // here you can attach custom event listeners to the Jitsi Meet External API
          // you can also store it locally to execute commands
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "90vh";
        }}
      />
    </Box>
  );
};
