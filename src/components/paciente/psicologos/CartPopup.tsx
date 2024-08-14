/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useMemo } from "react";
import {
  Flex,
  Heading,
  Text,
  Button,
  useDisclosure,
  HStack,
  Avatar,
  VStack,
  Tag,
} from "@chakra-ui/react";

import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { useMyContext } from "contexts/Context";
import { SEMANA } from "utils/SEMANA";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toReal } from "utils/toReal";
import { expertCityState } from "components/global/expertCityState";
import { BASE_URL } from "utils/CONFIG";
import { motion } from "framer-motion";
import { useCart } from "stores/useCart";
import { useRouter } from "next/router";

export function CartPopup() {
  const { isOpen, onToggle } = useDisclosure();
  const { cart } = useCart();
  const { user } = useMyContext();
  const router = useRouter();

  const filteredCart = useMemo(() => {
    return cart?.filter((item: any) => item.cart?.length > 0);
  }, [cart]) as any;

  const totalCartPrice = useMemo(() => {
    return filteredCart?.reduce(
      (acc: number, cur: any) => (acc += cur.subTotalCartPrice),
      0
    );
  }, [filteredCart]);

  const totalCartAmount = useMemo(() => {
    return filteredCart?.reduce(
      (acc: number, cur: any) => (acc += cur.cart?.length),
      0
    );
  }, [filteredCart]);

  if (cart?.length === 0) return null;

  //check router to prevent hydration zustand persist error
  if (!router.isReady) return null;

  return (
    <Flex
      w={350}
      position="fixed"
      right={{ base: 0, lg: "0px" }}
      top={24}
      zIndex={5}
      flexDir="column"
      align="flex-end"
    >
      <Button
        bg="amarelo"
        color="white"
        borderStartRadius="full"
        w={16}
        onClick={onToggle}
        colorScheme="none"
      >
        <Text pr={1}>{totalCartAmount}</Text>
        {/* <Text pr={1}>{cart.cart??.length || 0}</Text> */}
        <FaShoppingCart />
      </Button>
      <Flex
        as={motion.div}
        animate={{ x: isOpen ? 0 : 350 }}
        display={isOpen ? "flex" : "none"}
        boxShadow={"0 0 25px 5px #00000022"}
        right={0}
        w="350px"
        maxH="70vh"
        bg="white"
        borderRadius={6}
        p={6}
        flexDir="column"
        overflow="auto"
      >
        {filteredCart?.map((item: any) => {
          const userPhoto = item.expert?.avatar || "/";

          return (
            <VStack
              key={item?.expert?.id}
              align="end"
              p={4}
              borderRadius={6}
              boxShadow={"0 10px 15px 0 #00000022"}
            >
              <HStack w="full">
                <Avatar src={userPhoto} w={46} />
                <VStack spacing={1} align="start">
                  <Text>{item?.expert?.name}</Text>
                  {item?.expert?.councils?.map((council: any) => (
                    <Text key={council.number} fontSize={12}>
                      {council?.council} - {council?.number}
                    </Text>
                  ))}
                  <Text fontSize={12}>{expertCityState(item.expert)}</Text>
                </VStack>
              </HStack>

              {item.cart.map((item: any) => {
                const hour = new Date(item.hour);
                const price = toReal(item.selectedService, user);
                return (
                  <VStack w="full" key={item.hour}>
                    <HStack pt={4} justify="space-between" w="full">
                      <VStack fontSize={12} spacing={0} align="center">
                        <Text>{SEMANA[hour.getDay()]}</Text>
                        <Text>{format(hour, "dd/MM")}</Text>
                      </VStack>
                      <Tag
                        h={7}
                        color="white"
                        fontSize={14}
                        px={2}
                        bg="amarelo"
                      >
                        {hour.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Tag>
                      <Text fontWeight={500}>Valor: {price}</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text fontSize={12}>{item.selectedService.name}</Text>
                      <Text fontSize={14} fontWeight={500} color="azul">
                        {item.location}
                      </Text>
                    </HStack>
                  </VStack>
                );
              })}

              <Heading pt={6} textAlign="end" fontSize={18} fontWeight={500}>
                Subtotal: {toReal(item.subTotalCartPrice, user)}
                {user?.from_id &&
                  (item.subTotalCartPrice > 1 ? " créditos" : " crédito")}
                {/* {item.subTotalCartPrice}
                ,00 */}
              </Heading>
            </VStack>
          );
        })}
        {/*   <VStack
          opacity={0.25}
          mt={6}
          align="end"
          p={4}
          borderRadius={6}
          boxShadow={"0 10px 15px 0 #00000022"}
        >
          <HStack w="full">
            <Avatar src="/fabio.jpg" w={46} />
            <VStack spacing={1} align="start">
              <Text>Dr. Fábio Augusto</Text>
              <Text fontSize={12}>CRP - 01/12345</Text>
              <Text fontSize={12}>Brasília, Distrito Federal</Text>
            </VStack>
          </HStack>
          <VStack w="full">
            <HStack pt={4} justify="space-between" w="full">
              <VStack fontSize={12} spacing={0} align="center">
                <Text>Seg</Text>
                <Text>14/07</Text>
              </VStack>
              <Tag h={7} color="white" fontSize={14} px={2} bg="amarelo">
                08:00
              </Tag>
              <Text fontWeight={500}>Valor: R$ 150,00</Text>
            </HStack>
            <HStack justify="space-between" w="full">
              <Text fontSize={12}>Psicotarapia individual</Text>
              <Text fontSize={14} fontWeight={500} color="azul">
                Online
              </Text>
            </HStack>
          </VStack>
          <Heading pt={6} fontSize={18} fontWeight={500}>
            Total: R$ 150,00
          </Heading>
        </VStack> */}
        <Heading
          w="full"
          textAlign="center"
          pt={8}
          fontSize={20}
          fontWeight={500}
        >
          Valor Total: {toReal(totalCartPrice, user)}{" "}
          {user?.from_id && (totalCartPrice > 1 ? " créditos" : " crédito")}
        </Heading>
        <Link href="/checkout" passHref>
          <Button
            as="a"
            colorScheme="none"
            bg="amarelo"
            color="white"
            borderRadius="full"
            p={4}
            w="fit-content"
            alignSelf="center"
            mt={4}
          >
            Continuar
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
}
