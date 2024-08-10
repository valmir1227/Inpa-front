import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
// import { Zoom } from "components/zoom/Zoom";
import dynamic from "next/dynamic";
// import ZoomMtgEmbedded from "@zoomus/websdk/embedded";
import useSwr from "swr";
import { fetcher } from "utils/api";

export default function Page() {
  const router = useRouter();
  console.log(router);

  const { data: dataOvToken, isLoading: isFetchingOvToken } = useSwr(
    router.query?.id && router.query?.public === undefined
      ? `/v2/appointments/${router.query?.id}/createSession`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  console.log(router.query.public);

  const { data: health } = useSwr("/health", fetcher, {
    revalidateOnFocus: false,
  });

  const ZoomMeetings = dynamic(
    () => import("../../components/zoom/Zoom").then(({ Zoom }) => Zoom),
    {
      ssr: false, // Disable SSR for this component
    }
  );

  if (!router.query) return null;

  return (
    <>
      <Head>
        <title>Vídeo Chamada Inpa Zoom: {router.query.id}</title>
      </Head>
      {/* <Header type="paciente" /> */}
      <Box w="100vw" h="100vh" bg="azul">
        <ZoomMeetings
          dataOvToken={dataOvToken || { join: router.query }}
          health={health}
        />
        {/* <Zoom dataOvToken={dataOvToken} health={health} /> */}
      </Box>
    </>
  );
}
