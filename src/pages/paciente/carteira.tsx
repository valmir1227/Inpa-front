import { Center, Heading, Text } from "@chakra-ui/react";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import { usePost } from "hooks/usePost";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Login } from "../../components/Login";
import { Carteira } from "../../components/paciente/carteira/Carteira";
import { CarteiraHistorico } from "../../components/paciente/carteira/CarteiraHistorico";
import { NovoCartao } from "../../components/paciente/carteira/NovoCartao";

export default function CarteiraPage() {
  const { user, setUser } = useMyContext();
  const [etapaCarteira, setEtapaCarteira] = useState("home");
  const [dataOrders, errorOrders, isFetchingOrders, getOrders] = useFetch(
    "/v1/orders?limit=50",
    null,
    true
  );

  const [dataCards, errorCards, isFetchingCards, getCards] = useFetch(
    "/v1/pagarme/cards",
    null,
    true
  );

  const [handlePost, data, error, isFetching] = usePost("/v1/pagarme/customer");

  useEffect(() => {
    if (user?.id && !user?.pagarme_id) handlePost();
    if (user?.id) getCards();
  }, [user]);

  useEffect(() => {
    if (data.status === 200) setUser({ ...user, pagarme_id: data.data.id });
  }, [data]);

  useEffect(() => {
    if (user?.id) {
      getOrders();
    }
  }, [user]);

  function EtapaAtual() {
    switch (etapaCarteira) {
      case "novocartao":
        return (
          <NovoCartao getCards={getCards} setEtapaCarteira={setEtapaCarteira} />
        );
      default:
        return (
          <>
            <Carteira
              cardsData={{ dataCards, errorCards, isFetchingCards, getCards }}
              setEtapaCarteira={setEtapaCarteira}
            />
            {!user?.from_id && (
              <CarteiraHistorico
                ordersData={{
                  dataOrders,
                  errorOrders,
                  isFetchingOrders,
                  getOrders,
                }}
              />
            )}
          </>
        );
    }
  }
  return (
    <>
      <Head>
        <title>Carteira | Inpa</title>
        <meta property="og:title" content="Carteira | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="paciente" />
      <EtapaAtual />
    </>
  );
}
