import { Center, Heading, Text } from "@chakra-ui/react";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useEffect } from "react";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Login } from "../../components/Login";
import { Carteira } from "../../components/psicologo/carteira/Carteira";

export default function CarteiraPage() {
  const [
    dataAppointment,
    errorAppointment,
    isFetchingAppointment,
    getAppointment,
  ] = useFetch("v1/appointments?expert=true&limit=50", null, true);
  const { user } = useMyContext();

  useEffect(() => {
    if (user?.id) getAppointment();
  }, [user]);
  return (
    <>
      <Head>
        <title>Carteira | Inpa</title>
        <meta property="og:title" content="Carteira | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="psicologo" />
      <Carteira
        appointmentData={{
          dataAppointment,
          errorAppointment,
          isFetchingAppointment,
          getAppointment,
        }}
      />
    </>
  );
}
