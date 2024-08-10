/* eslint-disable jsx-a11y/aria-proptypes */
import React from "react";
import {
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  IconButton,
  Stack,
  Tag,
} from "@chakra-ui/react";

import { FaEye } from "react-icons/fa";
import { toReal } from "utils/toReal";
import { LoadingInpa } from "components/global/Loading";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { translateStatus } from "utils/translateStatus";
import { useMyContext } from "contexts/Context";
import { toBrDate0GMT, toBrFullDate0GMT } from "utils/toBrDate";

export function CarteiraHistorico({ ordersData }: any) {
  const { user } = useMyContext();
  const { dataOrders, errorOrders, isFetchingOrders, getOrders } = ordersData;

  const Orders = () => {
    if (isFetchingOrders) return <LoadingInpa />;
    return dataOrders?.map((item: any) => (
      <Stack
        key={item.id}
        p={2}
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        w="full"
        // _hover={{ bg: "white" }}
        sx={{
          ":nth-child(even)": { bg: "#F7F7F7" },
          ":nth-child(odd)": { bg: "#FCFCFC" },
          _hover: { bg: "white" },
        }}
      >
        {/* <HStack>
          <Avatar src="/fabio.jpg" w={46} />
          <Text>Dr. Fábio Augusto</Text>
        </HStack> */}
        <Text fontSize="xs">{item.id}</Text>
        <VStack w="full" maxW={400} align="start">
          {/* verifica se existe descrição dos produtos */}
          {item.transaction_data?.items?.length > 0
            ? item.transaction_data?.items?.map((product: any) => (
                <Text key={product.id} fontSize={12}>
                  {product.description}
                </Text>
              ))
            : item.items?.map((product: any) => (
                <Text key={product.id} fontSize={12}>
                  Sessão {toBrFullDate0GMT(product.hour)} (UTC+0)
                </Text>
              ))}
        </VStack>
        <VStack>
          <Tag
            fontSize={12}
            color="white"
            bg={item.status === "Canceled" ? "vermelho" : "whatsapp.300"}
            borderRadius="full"
          >
            {translateStatus(item.status)}
          </Tag>
          <Text fontSize={12}>
            {translateStatus(
              item?.transaction_data?.charges[0]?.payment_method
            ) || translateStatus(item.billing_type)}
          </Text>
        </VStack>
        <VStack w="full" maxW={100} fontSize={12} spacing={0} align="center">
          <Text>{format(new Date(item.date), "eeee", { locale: ptBR })}</Text>
          <Text>{format(new Date(item.date), "dd/MM")}</Text>
          <Text>{format(new Date(item.date), "HH:mm")}</Text>
        </VStack>

        <Text fontSize={14}>Ref: {item.identifier}</Text>

        <VStack>
          {item.subtotal !== item.total && (
            <Text textDecoration="line-through" fontWeight={500}>
              {toReal(item.subtotal, user)}
            </Text>
          )}
          <Text fontWeight={500}>{toReal(item.total, user)}</Text>
        </VStack>
        {/* <IconButton
          alignSelf="center"
          size="xs"
          aria-label="Ver detalhes"
          variant="ghost"
          color="cinza"
          onClick={() => handleModal(item)}
        >
          <FaEye />
        </IconButton> */}
      </Stack>
    ));
  };

  if (dataOrders?.length === 0) return null;

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
      >
        <Heading fontSize={28}>Histórico de pagamento</Heading>
        <VStack
          bg="#white"
          spacing={0}
          w="full"
          borderRadius={6}
          borderWidth={1}
          borderColor="cinzaclaro"
          p={2}
          fontSize={14}
        >
          <Orders />
          {/*   <Stack
            p={2}
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            w="full"
            _hover={{ bg: "white" }}
          >
            <HStack>
              <Avatar src="/fabio.jpg" w={46} />
              <Text>Dr. Fábio Augusto</Text>
            </HStack>
            <Tag
              fontWeight={14}
              fontSize={12}
              color="white"
              bg="whatsapp.300"
              borderRadius="full"
            >
              Aprovado
            </Tag>
            <VStack fontSize={12} spacing={0} align="center">
              <Text>Ter</Text>
              <Text>15/07</Text>
            </VStack>
            <Tag h={7} color="white" fontSize={14} px={2} bg="amarelo">
              12:00
            </Tag>
            <Text fontSize={14}>Visa 1234</Text>
            <Text fontWeight={500}>R$ 100,00</Text>
          </Stack> */}
        </VStack>
      </Flex>
    </Flex>
  );
}
