/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useState, useEffect, useCallback } from "react";
import {
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  useDisclosure,
  Avatar,
  HStack,
  Tag,
  IconButton,
  Stack,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

import { FaCreditCard } from "react-icons/fa";
import { ModalAlterarParcelas } from "./ModalAlterarParcelas";
import { useMyContext } from "../../../contexts/Context";
import { FiX } from "react-icons/fi";
import { SEMANA } from "utils/SEMANA";
import { format } from "date-fns";
import { toReal } from "utils/toReal";
import { expertCityState } from "components/global/expertCityState";
import { useForm } from "react-hook-form";
import { Input } from "components/global/Select";
import { useFetch } from "hooks/useFetch";
import { AlertInpa } from "components/global/Alert";
import { BASE_URL } from "utils/CONFIG";
import { ButtonLink } from "components/global/Button";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useCart } from "stores/useCart";

export function Checkout({
  setEtapaAgendamento,
  data,
  orderData,
  hasAddress,
}: any) {
  const today = new Date();
  const [aPartirDe, setAPartirDe] = useState(today);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpenAgendamentoConcluido,
    onOpenPagamentoComPix,

    user,
  } = useMyContext();
  const { cart, setCart, reset, filterCartRaw } = useCart();

  function handleRemoveCart(selected: any) {
    //recria os carrinhos de cada expert
    const findExpertToFilter = cart.map((expertCart: any) => {
      //verifica em qual carrinho está o horario clicado (removendo)
      const sameExpert = expertCart.cart.includes(selected);

      //recria o carrinho removendo o horario selecionado, e subtrai o subtotal caso seja do mesmo expert
      return {
        ...expertCart,
        cart: expertCart.cart.filter((item: any) => item.id !== selected.id),
        subTotalCartPrice: sameExpert
          ? expertCart.subTotalCartPrice - +selected.selectedService.price
          : expertCart.subTotalCartPrice,
      };
    }); //TODO subtrair apenas do objeto selecionado

    //limpa os carrinhos undefined para nao interferir na contagem de horarios
    const clearEmptyExpertCart = findExpertToFilter.filter(
      (item: any) => item.cart.length > 0
    );

    setCart(clearEmptyExpertCart);
    filterCartRaw(selected);
  }

  //soma todos os subtotais de cada carrinho de expert
  const totalCartPrice = cart?.reduce(
    (acc: number, cur: any) => (acc += cur.subTotalCartPrice),
    0
  );

  const [firstCard] = data?.dataCards || [];

  const [selectedCardId, setSelectedCardId] = useState(firstCard?.id || "");

  const selectedCard = data?.dataCards?.find(
    (item: any) => item.id === selectedCardId
  );

  if (cart.length < 1) setEtapaAgendamento("vazio");

  //check router to prevent hydration zustand persist error

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  const typedCoupon = watch("coupon");
  const [dataCoupon, errorCoupon, isFetchingCoupon, getCoupon] = useFetch(
    `/v1/coupons/check/${typedCoupon}`
  );

  useEffect(() => {
    if (dataCoupon?.status === "active") setValidCoupon(dataCoupon);
  }, [dataCoupon]);

  const [validCoupon, setValidCoupon] = useState({} as any);

  const isPercent = dataCoupon?.type === "percent";

  const discount = () => {
    if (isPercent) return totalCartPrice * +validCoupon.discount;
    else return +validCoupon.discount;
  };

  const priceWithDiscount = () => {
    if (dataCoupon?.status !== "active" || !validCoupon.status)
      return totalCartPrice;
    if (isPercent) return totalCartPrice - discount();
    else return totalCartPrice - +validCoupon.discount;
  };

  const { handlePostOrder, dataOrder, errorOrder, isFetchingOrder } = orderData;

  useEffect(() => {
    if (dataOrder.status === 201) {
      if (
        dataOrder.data.order.transaction_data.charges &&
        dataOrder.data.order.transaction_data.charges[0].last_transaction
          .qr_code_url
      ) {
        onOpenPagamentoComPix();
      } else {
        onOpenAgendamentoConcluido();
      }
      setEtapaAgendamento("concluido");
      window.localStorage.clear();
      setCart([]);
      reset();
    }
  }, [dataOrder]);

  /* const [tabIndex, setTabIndex] = useState(user?.credit_balance ? 2 : 1); */
  const router = useRouter();

  const defaultTabIndex = useCallback(() => {
    if (user?.from_id || router.query.tab === "credit") return 2;
    else if (router.query.tab === "credit_card") return 0;
    else return 1;
  }, [router, user]);

  const [tabIndex, setTabIndex] = useState(defaultTabIndex);
  const cartSelfBuy = cart?.some((item: any) => item.expert.id === user?.id);
  const creditAboveTotal = user?.credit_balance >= priceWithDiscount();
  const creditCardPayment = tabIndex === 0;
  const pixPayment = tabIndex === 1;
  const creditPayment = tabIndex === 2;
  const disabled = creditCardPayment
    ? !selectedCardId
    : creditPayment
    ? !creditAboveTotal
    : !pixPayment;

  const addressMissing = () => {
    // if (isFetchingAddress) return false;
    if (hasAddress) {
      return false;
    }
    if (pixPayment || creditCardPayment) {
      return true;
    }

    if (creditPayment) return false;
    return true;
  };

  const onSubmit = (data: any) => {
    /*     const ex = {
      billingType: "gateway",
      gateway: "pagarme",
      billingMethod: "credit_card",
      cardId: "card_v69WaoqoTvcjlB0p",
      subtotal: 150,
      coupon: "cupom100",
      discount: 100,
      total: 50,
      items: [
        {
          id: 20,
          hour: "2022-10-30T06:00:00.000Z",
          expertId: 26,
          location: "online",
        },
      ],
    }; */

    const carts = cart.map((item: any) =>
      item.cart.map((cart: any) => ({
        expertId: item.expert.id,
        serviceId: cart.selectedService.id,
        hour: cart.hour,
        location: cart.location,
      }))
    );

    const items = carts.reduce((acc: any, cur: any) => {
      return [...acc, ...cur];
    }, []);

    const formattedData = {
      ...data,
      billingType: creditCardPayment || pixPayment ? "gateway" : "credit",
      gateway: creditCardPayment || pixPayment ? "pagarme" : "credit",
      billingMethod: creditCardPayment ? "credit_card" : "pix",
      cardId: selectedCardId,
      subtotal: totalCartPrice,
      discount: discount(),
      total: priceWithDiscount(),
      items,
    };
    if (creditPayment) {
      delete formattedData.billingMethod;
      delete formattedData.cardId;
    }
    if (pixPayment) {
      delete formattedData.cardId;
    }

    handlePostOrder(formattedData);
  };

  const [firstCharge] = errorOrder?.response?.data?.message?.charges || [];
  const errorMsg =
    firstCharge?.last_transaction?.acquirer_message ||
    (typeof errorOrder?.response?.data?.message === "string" &&
      errorOrder?.response?.data?.message) ||
    firstCharge?.last_transaction?.status ||
    "Erro";

  const fakeApproved =
    errorMsg === "Transação aprovada com sucesso" && errorOrder;

  if (!router.isReady) return null;

  const userProfileNeedsToUpdate = user?.id && user?.profile_updated === false;

  return (
    <Flex
      bg="#f5f5f5"
      flexDir="column"
      as="section"
      justify="center"
      align="center"
      w="100%"
      gap={4}
      py={4}
    >
      <Flex
        p={{ base: "1rem", md: "2rem" }}
        bg="white"
        color="cinzaescuro"
        borderRadius={20}
        borderWidth={1}
        align="start"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir="column"
        gap={6}
        mt={4}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Heading fontSize={28}>Confira e finalize seu agendamento</Heading>
        <Heading fontSize={20}>Resumo</Heading>
        {cart?.map((expertCart: any) => {
          const selfBuy = expertCart.expert.id === user?.id;
          return (
            <VStack
              bg="#F8F8F8"
              // spacing={8}
              w="full"
              borderRadius={6}
              borderWidth={1}
              borderColor="cinzaclaro"
              p={2}
              key={expertCart.expert.id}
              border={selfBuy ? "4px solid red" : "inherit"}
            >
              {selfBuy && (
                <AlertInpa
                  text="Você não pode adquirir seus próprios serviços"
                  status="warning"
                />
              )}
              {expertCart.cart?.map((item: any) => {
                const hour = new Date(item.hour);
                const userPhoto = expertCart.expert?.avatar || "/";

                return (
                  <Stack
                    p={2}
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                    w="full"
                    sx={{
                      ":nth-child(even)": { bg: "#F4F4F4" },
                      _hover: { bg: "white" },
                    }}
                    key={item?.id}
                  >
                    <HStack>
                      <Avatar src={userPhoto} w={46} />
                      <VStack spacing={1} align="start">
                        <Text>{expertCart.expert.name}</Text>
                        {expertCart?.expert.councils?.map((council: any) => (
                          <Text key={council.id} fontSize={12}>
                            {council?.council} - {council?.number}
                          </Text>
                        ))}
                        <Text fontSize={12}>
                          {expertCityState(expertCart.expert)}
                        </Text>
                      </VStack>
                    </HStack>
                    <VStack fontSize={12} spacing={0} align="center">
                      <Text>{SEMANA[hour.getDay()]}</Text>
                      <Text>{format(hour, "dd/MM")}</Text>
                    </VStack>
                    <Tag h={7} color="white" fontSize={14} px={2} bg="amarelo">
                      {hour.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Tag>
                    <Text fontSize={12}>{item.selectedService.name}</Text>
                    <Text fontSize={14} fontWeight={500} color="azul">
                      Online
                    </Text>
                    <Text fontWeight={500}>
                      Valor: {toReal(item.selectedService, user)}
                    </Text>
                    <IconButton
                      size="xs"
                      variant="ghost"
                      aria-label="Remover agendamento do carrinho"
                      onClick={() => handleRemoveCart(item)}
                    >
                      <FiX color="red" />
                    </IconButton>
                  </Stack>
                );
              })}
              <Text fontSize={14} alignSelf="flex-end">
                Subtotal: {toReal(expertCart.subTotalCartPrice, user)}{" "}
                {user?.from_id &&
                  (expertCart.subTotalCartPrice > 1 ? "créditos" : "crédito")}
              </Text>
            </VStack>
          );
        })}
        <Flex
          pt={4}
          justify="space-between"
          w="full"
          flexDir={{ base: "column", lg: "row" }}
          gap={6}
          align="center"
        >
          <VStack spacing={10}>
            <Text
              textAlign="center"
              fontSize={12}
              maxW={350}
              sx={{ b: { color: "azul" } }}
              pt={2}
            >
              Estou ciente e de acordo com os <b>Termos de Remarcação</b>, e com
              as regras de <b>Notificações e Privacidade</b>.
            </Text>
            <Button
              onClick={() => {
                window.localStorage.clear();
                setCart([]);
                reset();
              }}
              bg="amarelo"
              color="white"
              colorScheme="none"
            >
              Limpar carrinho
            </Button>
          </VStack>

          <VStack w="full" maxW={270}>
            <Heading textAlign="center" w="full" fontSize={20}>
              Forma de pagamento
            </Heading>
            {user?.from_id && (
              <AlertInpa
                text="Sua conta permite apenas pagamento com saldo"
                status="warning"
              />
            )}

            <Tabs
              onChange={(index) => {
                setTabIndex(index);
                router.replace({
                  query: {
                    tab:
                      index === 0
                        ? "credit_card"
                        : index === 2
                        ? "credit"
                        : "pix",
                  },
                });
              }}
              align="center"
              w="full"
              colorScheme="teal"
              size="lg"
              isFitted
              defaultIndex={tabIndex}
            >
              {!user?.from_id && (
                <TabList>
                  <>
                    <Tab isDisabled={user?.from_id}>Cartão</Tab>
                    <Tab isDisabled={user?.from_id}>Pix</Tab>
                  </>
                </TabList>
              )}

              <TabPanels>
                <TabPanel>
                  {data.dataCards?.length > 0 && (
                    <>
                      <VStack pb={2} w="full" pt={2}>
                        <Text color="cinza" fontSize={14} alignSelf="start">
                          Selecione seu cartão
                        </Text>
                        <Select
                          fontSize={14}
                          borderRadius={14}
                          borderColor="cinza"
                          color="cinza"
                          onChange={(e) => setSelectedCardId(e.target.value)}
                          // placeholder="Selecione"
                        >
                          {data.dataCards?.map((item: any) => (
                            <option key={item.id} value={item.id}>
                              {`${item.holder_name} ${item.last_four_digits}`}
                            </option>
                          ))}
                        </Select>
                      </VStack>

                      <Flex
                        flexDir="column"
                        p={4}
                        color="white"
                        bg="azul"
                        w="full"
                        h={150}
                        borderRadius={14}
                        justify="space-between"
                        textAlign="left"
                      >
                        <HStack justify="space-between" w="full">
                          <Text>{selectedCard?.holder_name}</Text>
                          <Text>
                            **** **** {selectedCard?.last_four_digits}
                          </Text>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text>{`${selectedCard?.exp_month} / ${selectedCard?.exp_year}`}</Text>
                          <FaCreditCard />
                        </HStack>
                      </Flex>
                    </>
                  )}

                  <Text pt={4} fontSize={12}>
                    Cadastre seu cartão de crédito.
                  </Text>
                  <Button
                    onClick={() => setEtapaAgendamento("novocartao")}
                    bg="amarelo"
                    color="white"
                    colorScheme="none"
                  >
                    Adicionar
                  </Button>
                </TabPanel>
                <TabPanel>
                  Será disponibilizado um <b>pix copia e cola</b> por 15 min
                </TabPanel>
              </TabPanels>
            </Tabs>
            {user?.credit_balance && (
              <VStack w="full">
                <Text fontWeight={400}>
                  Seu saldo:{" "}
                  <b>
                    {toReal(user?.credit_balance, user)}{" "}
                    {user?.from_id &&
                      (user?.credit_balance > 1 ? "créditos" : "crédito")}
                  </b>
                </Text>
                {!creditAboveTotal && <AlertInpa text="Saldo insuficiente" />}
              </VStack>
            )}
          </VStack>

          <VStack spacing={4}>
            {/* <ModalAlterarParcelas
              priceWithDiscount={priceWithDiscount()}
              isOpen={isOpen}
              onClose={onClose}
              onOpen={onOpen}
            /> */}
            <Text
              sx={{ b: { color: "azul", pl: 2 } }}
              color="cinza"
              fontSize={18}
              alignSelf="start"
            >
              Valor total:{" "}
              <b>
                {toReal(priceWithDiscount(), user)}{" "}
                {user?.from_id &&
                  (priceWithDiscount() > 1 ? "créditos" : "crédito")}
              </b>
            </Text>
            <Button
              alignSelf="center"
              bgGradient="linear(to-tr, amarelogradient1, amarelogradient2)"
              _hover={{
                bgGradient: "linear(to-tr, amarelogradient2, amarelogradient1)",
              }}
              fontWeight={500}
              borderRadius="full"
              w="full"
              color="white"
              py={4}
              px={10}
              mt={8}
              type="submit"
              isLoading={isFetchingOrder}
              disabled={
                disabled ||
                cartSelfBuy ||
                addressMissing() ||
                fakeApproved ||
                userProfileNeedsToUpdate
              }
            >
              Agendar
            </Button>
            <VStack w={250} spacing={0}>
              {!selectedCardId && creditCardPayment && (
                <AlertInpa text="Selecione um cartão de crédito" />
              )}
              {userProfileNeedsToUpdate && (
                <Alert status="warning" justifyContent="center">
                  <Flex
                    gap={2}
                    textAlign="center"
                    align="center"
                    direction="column"
                  >
                    <Text>Atualize seus dados para concluir o agendamento</Text>

                    <ButtonLink
                      href={`/paciente/minha-conta`}
                      title="Atualizar dados"
                    />
                  </Flex>
                </Alert>
              )}
              {addressMissing() && (
                <AlertInpa text="Endereço obrigatório">
                  <ButtonLink
                    ml={2}
                    title="Adicionar"
                    href={{
                      pathname: "/paciente/minha-conta",
                      query: {
                        redirect: "/checkout",
                        tab: creditCardPayment ? "credit_card" : "pix",
                      },
                      // query: { redirect: "/checkout", tab: "credit_card" },
                    }}
                  />
                </AlertInpa>
              )}
              {cartSelfBuy && (
                <AlertInpa text="Serviços inválidos" status="warning" />
              )}
              {errorOrder && (
                // <AlertInpa text={errorOrder?.response?.data?.message?.ptBr || "Erro"} />
                <AlertInpa
                  text={
                    fakeApproved
                      ? "Transação estornada, verifique o CPF e se este cartão não está sendo usado em outra conta"
                      : errorMsg
                  }
                />
              )}
            </VStack>

            <VStack>
              {!user?.from_id &&
                (validCoupon.status === "active" ? (
                  <>
                    <Text fontSize={12} color="azul">
                      <b>{validCoupon?.code}</b> aplicado
                    </Text>
                    <Button
                      onClick={() => setValidCoupon({})}
                      color="vermelho"
                      w="full"
                      size="xs"
                    >
                      Remover cupom
                    </Button>
                  </>
                ) : (
                  <Input
                    _focus={{ borderColor: "azul", borderWidth: 1 }}
                    size="xs"
                    placeholder="Código promocional"
                    fontSize={12}
                    borderRadius={6}
                    w="fit-content"
                    id="coupon"
                    errors={errors}
                    register={{
                      ...register("coupon"),
                    }}
                  />
                ))}
              {errorCoupon && (
                <Text fontSize={12} color="vermelho">
                  Cupom inválido
                </Text>
              )}
              {typedCoupon && validCoupon.status !== "active" && (
                <Button
                  isLoading={isFetchingCoupon}
                  onClick={getCoupon}
                  color="azul"
                  w="full"
                  size="xs"
                >
                  Aplicar cupom
                </Button>
              )}
            </VStack>
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  );
}
