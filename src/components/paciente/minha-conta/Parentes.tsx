import { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Wrap,
  VStack,
  Avatar,
  Checkbox,
  FormLabel,
  HStack,
  Select as ChakraSelect,
  IconButton,
  Select,
  Text,
  Tag,
  useDisclosure,
  Spacer,
  Center,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { Button } from "../../global/Button";
import { ModalExcluirParticipante } from "../sessoes/ModalExcluirParticipante";
import { ModalAdicionarParticipante } from "../sessoes/ModalAdicionarParticipante";
import { usePost } from "hooks/usePost";
import { useFetch } from "hooks/useFetch";
import { useForm } from "react-hook-form";
import { toBrDate0GMT } from "utils/toBrDate";
import { useDel } from "hooks/useDel";

export function Parentes() {
  const [dataGet, errorGet, isFetchingGet, get] = useFetch("/v1/participants");

  useEffect(() => {
    get();
  }, []);

  const [selectedParticipant, setSelectedParticipant] = useState();

  const handleModal = (participant: any) => {
    setSelectedParticipant(participant);
    onOpenModalExcluir();
  };

  const {
    onOpen: onOpenModalExcluir,
    isOpen: isOpenModalExcluir,
    onClose: onCloseModalExcluir,
  } = useDisclosure();
  const {
    onOpen: onOpenModalAdicionar,
    isOpen: isOpenModalAdicionar,
    onClose: onCloseModalAdicionar,
  } = useDisclosure();

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
        gap={2}
      >
        <Flex pb={4} align="center" gap={5} w="full" justify="space-between">
          <Heading fontSize={{ base: 20, sm: 30 }}>Parentes</Heading>
          <Button
            fontSize={14}
            borderRadius={10}
            title="Vincular"
            onClick={onOpenModalAdicionar}
          />
        </Flex>
        {dataGet?.length > 0 &&
          dataGet?.map((item: any) => (
            <Wrap
              key={item.id}
              justify="space-between"
              align="center"
              borderRadius={20}
              bg="bg"
              p="1rem"
              w="full"
              fontSize={12}
            >
              <Text flex={4}>{item.name}</Text>
              <Text flex={5}>{item.email}</Text>
              <Text flex={3}>{toBrDate0GMT(item.birthday)}</Text>
              <Text flex={3}>{item.phone}</Text>
              <Text flex={3}>{item.relationship}</Text>
              <Center flex={3}>
                <Tag fontSize={12} p={2} bg="whatsapp.300" fontWeight={400}>
                  Vinculado
                </Tag>
              </Center>
              <IconButton
                flex={1}
                size="xs"
                aria-label="Remover participante"
                variant="ghost"
                onClick={() => handleModal(item)}
              >
                <FiX color="#f00f0077" />
              </IconButton>
            </Wrap>
          ))}
        <ModalExcluirParticipante
          isOpen={isOpenModalExcluir}
          onClose={onCloseModalExcluir}
          selectedParticipant={selectedParticipant}
          get={get}
        />
        <ModalAdicionarParticipante
          isOpen={isOpenModalAdicionar}
          onClose={onCloseModalAdicionar}
          get={get}
        />
      </Flex>
    </Flex>
  );
}
