import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import { usePost } from "hooks/usePost";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { CarrinhoVazio } from "../components/paciente/checkout/CarrinhoVazio";
import { Checkout } from "../components/paciente/checkout/Checkout";
import { NovoCartao } from "../components/paciente/checkout/NovoCartao";

export default function CheckoutPage() {
  const { user, setUser, getMe } = useMyContext();
  const [etapaAgendamento, setEtapaAgendamento] = useState("pagamento");

  const [handlePost, data, error, isFetching] = usePost("/v1/pagarme/customer");
  const [handlePostOrder, dataOrder, errorOrder, isFetchingOrder] =
    usePost("v1/orders/");

  const [dataCards, errorCards, isFetchingCards, getCards] =
    useFetch("/v1/pagarme/cards");

  const [dataAddress, errorAddress, isFetchingAddress, getAddress] =
    useFetch("v1/addresses");

  const [firstAddress] = dataAddress || [];

  useEffect(() => {
    if (user?.id && !user?.pagarme_id) handlePost();
    if (user?.id) {
      getCards();
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (data.status === 200) setUser({ ...user, pagarme_id: data.data.id });
    getMe();
  }, [data]);

  function EtapaAtual() {
    switch (etapaAgendamento) {
      case "pagamento":
        return (
          <Checkout
            data={{
              dataCards: dataCards?.data,
              errorCards,
              isFetchingCards,
              getCards,
            }}
            orderData={{
              handlePostOrder,
              dataOrder,
              errorOrder,
              isFetchingOrder,
            }}
            setEtapaAgendamento={setEtapaAgendamento}
            hasAddress={firstAddress?.id ? true : null}
          />
        );
      case "novocartao":
        return (
          <NovoCartao
            getCards={getCards}
            setEtapaAgendamento={setEtapaAgendamento}
            addressData={{ dataAddress, isFetchingAddress, getAddress }}
          />
        );
      default:
        return (
          <CarrinhoVazio
            orderData={{
              handlePostOrder,
              dataOrder,
              errorOrder,
              isFetchingOrder,
            }}
          />
        );
    }
  }

  return (
    <>
      <Head>
        <title>Checkout | Inpa</title>
        <meta property="og:title" content="Perfil | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="paciente" />
      <EtapaAtual />
    </>
  );
}
