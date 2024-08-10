/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Select,
  useDisclosure,
  Button as ChakraButton,
  Wrap,
} from "@chakra-ui/react";

import { FaCcMastercard, FaCcVisa, FaCreditCard } from "react-icons/fa";
import { Button } from "../../global/Button";
import { ModalExcluirCartao } from "./ModalExcluirCartao";
import Link from "next/link";
import { BsTrash } from "react-icons/bs";
import { MdOutlineCreditCardOff } from "react-icons/md";
import { LoadingInpa } from "components/global/Loading";
import {
  RiMastercardFill,
  RiMastercardLine,
  RiVisaFill,
  RiVisaLine,
} from "react-icons/ri";
import { useDel } from "hooks/useDel";
import { toReal } from "utils/toReal";
import { useMyContext } from "contexts/Context";
import { useUsers } from "stores/useUser";
import { useFetchUser } from "hooks/useFetchUser";
import { useRouter } from "next/router";

export function Carteira({ setEtapaCarteira, cardsData }: any) {
  const {
    isOpen: isOpenExcluirCartao,
    onOpen: onOpenExcluirCartao,
    onClose: onCloseExcluirCartao,
  } = useDisclosure();
  // const { user } = useMyContext();

  const [selectedCard, setSelectedCard] = useState({} as any);

  const [handleDelete, dataDelete, errorDelete, isDeleting] = useDel(
    "v1/pagarme/card?cardID=" + selectedCard.id
  );

  const { dataCards, errorCards, isFetchingCards, getCards } = cardsData;

  function handleModal(card: any) {
    setSelectedCard(card);
    onOpenExcluirCartao();
  }

  const { user } = useUsers();
  const { data: dataMe } = useFetchUser();
  const router = useRouter();

  const Cards = () => {
    if (isFetchingCards) return <LoadingInpa />;
    if (dataCards?.data?.length === 0) return null;
    return (
      <VStack flex={1.3} w="full" align="end">
        <Heading w="full" fontSize={20}>
          Gerenciar cartões
        </Heading>
        <Wrap justify="space-between" spacing={8} w="full">
          {dataCards?.data?.map((item: any) => (
            <VStack spacing={0} key={item.id}>
              <Flex
                w={270}
                p={4}
                color="white"
                bg="azul"
                h={150}
                borderRadius={14}
                justify="space-between"
                flexDir="column"
              >
                <HStack justify="space-between" w="full">
                  <Text maxW={130}>{item?.holder_name}</Text>
                  <Text>**** **** {item?.last_four_digits}</Text>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text>{`${item?.exp_month} / ${item?.exp_year}`}</Text>

                  {item.brand === "Visa" ? <RiVisaLine /> : <FaCreditCard />}
                </HStack>
              </Flex>
              <Text
                onClick={() => handleModal(item)}
                _hover={{ color: "red", cursor: "pointer" }}
                fontSize={12}
              >
                Excluir este cartão
              </Text>
            </VStack>
          ))}
        </Wrap>
      </VStack>
    );
  };

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
      >
        <Flex w="full" justify="space-between">
          <Heading fontSize={28}>Carteira</Heading>
          {!!user?.credit_balance && (
            <Heading fontSize={28}>
              Saldo: {toReal(dataMe?.credit_balance, user)}
              {user?.from_id && " Créditos"}
            </Heading>
          )}
        </Flex>

        {!user?.from_id && (
          <Flex
            pt={4}
            justify="space-between"
            w="full"
            flexDir={{ base: "column", lg: "row" }}
            gap={10}
            align="center"
          >
            <Cards />
            <VStack flex={1} spacing={6}>
              <Text
                textAlign="center"
                fontSize={18}
                sx={{ b: { color: "azul" } }}
              >
                Cadastre seu <b>cartão de crédito</b>
              </Text>
              <Text textAlign="center" color="cinza" fontSize={14}>
                Cadastre seu cartão de crédito para agendar de forma mais rápida
                e fácil.
              </Text>

              <Button
                onClick={() => setEtapaCarteira("novocartao")}
                bg="amarelo"
                borderRadius={6}
                title="Adicionar cartão de crédito"
              />
            </VStack>
          </Flex>
        )}
      </Flex>
      <ModalExcluirCartao
        isOpen={isOpenExcluirCartao}
        onClose={onCloseExcluirCartao}
        selectedCard={selectedCard}
        get={getCards}
        dataDeleteCard={{ handleDelete, dataDelete, errorDelete, isDeleting }}
      />
      {/* <Flex gap={4} p={8} w="full" maxW={1200} justify="end">
        <Link href="/paciente/carteira" passHref>
          <ChakraButton
            as="a"
            variant="ghost"
            borderRadius="full"
            bg="white"
            alignSelf="start"
            color="cinzaescuro"
            px={5}
          >
            Cancelar
          </ChakraButton>
        </Link>
        <Link href="/paciente/carteira" passHref>
          <Button
            as="a"
            variant="ghost"
            borderRadius="full"
            alignSelf="start"
            px={8}
            title="Salvar"
          />
        </Link>
      </Flex> */}
    </Flex>
  );
}
