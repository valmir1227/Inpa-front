import React, { useState } from "react";
import {
  Flex,
  Heading,
  Wrap,
  VStack,
  Avatar,
  Icon,
  Center,
  FormLabel,
  HStack,
  Tag,
  Badge,
  Button as ChakraButton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

import { Input, Select } from "../../global/Select";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import { CheckboxInpa } from "../../global/Checkbox";
import { IDIOMAS } from "../../../utils/IDIOMAS";
import { darken } from "@chakra-ui/theme-tools";
import { FiX } from "react-icons/fi";
import Link from "next/link";
import { Button } from "../../global/Button";
import { useMyContext } from "contexts/Context";
import { usePost } from "hooks/usePost";
import { usePatch } from "hooks/usePatch";

export function Idiomas() {
  const [idioma, setIdioma] = useState("");
  const { user } = useMyContext();
  const [listaIdiomas, setListaIdiomas] = useState(user?.languages || []);

  const [handlePatch, data, error, isFetching] = usePatch(
    `/v1/users/${user?.id}`
  );

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
        flexDir="row"
        gap={6}
      >
        <VStack spacing={4} align="start">
          <Heading fontSize={28}>Idiomas</Heading>
          <HStack>
            <Select
              onChange={(e) => setIdioma(e.target.value)}
              maxW={150}
              variant="outline"
              // values={IDIOMAS.filter((item) => !listaIdiomas.includes(item))}
              values={IDIOMAS}
              placeholder="Selecione"
              borderRadius={16}
            />
            <Center
              onClick={() => {
                if (listaIdiomas?.includes(idioma) || !idioma) {
                  return;
                } else {
                  setListaIdiomas([...listaIdiomas, idioma]);
                }
              }}
              _hover={{
                cursor: "pointer",
                bg: darken("amarelo", 10),
              }}
              opacity={listaIdiomas?.includes(idioma) ? 0.3 : 1}
              borderRadius="full"
              bg={"amarelo"}
              w="22px"
              h="18px"
              color="white"
            >
              <AddIcon boxSize={2} />
            </Center>
          </HStack>
          <Wrap>
            {listaIdiomas?.map((item: any) => (
              <Tag
                color="cinzaescuro"
                fontWeight={400}
                fontSize={12}
                key={item}
              >
                {item}
                <Icon
                  ml={1}
                  onClick={() =>
                    setListaIdiomas(
                      listaIdiomas.filter((filter: any) => filter !== item)
                    )
                  }
                  color="cinza"
                  as={FiX}
                  _hover={{ cursor: "pointer", color: "vermelho" }}
                />
              </Tag>
            ))}
          </Wrap>
        </VStack>
        <Flex flexDir="column" alignSelf="flex-end">
          <Button
            as="a"
            variant="ghost"
            borderRadius="full"
            alignSelf="flex-end"
            title="Salvar"
            isLoading={isFetching}
            onClick={() => handlePatch({ languages: listaIdiomas })}
          />
          {error && (
            <Alert w="fit-content" ml="auto" mt={2} status="warning">
              <AlertIcon />
              {error?.response.statusText || "Erro"}
            </Alert>
          )}
          {data.status == 200 && (
            <Alert w="fit-content" ml="auto" mt={2} status="success">
              <AlertIcon />
              Idiomas atualizados
            </Alert>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
