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
  Input as ChakraInput,
  useDisclosure,
  Text,
  Select as ChakraSelect,
  Image,
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
import { ESTADOS, ESTADOS_SIGLA } from "../../../utils/ESTADOS";
import ReactInputMask from "react-input-mask";

export function Consultorio() {
  const [selectedImage, setSelectedImage] = useState<any>([]);

  const handleChange = (e: any) => {
    let selected = e.target.files;

    if (selected) {
      setSelectedImage([...selectedImage, ...e.target.files]);
    }
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
        align="center"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir="column"
        gap={6}
      >
        <Heading alignSelf="start" fontSize={28}>
          Consultório
        </Heading>
        <FormLabel
          alignItems="center"
          justifyContent="center"
          htmlFor="imagem"
          pos="relative"
        >
          <Center
            sx={{
              _hover: {
                cursor: "pointer",
                borderColor: "azul",
                borderWidth: 2,
              },
            }}
            h={200}
            w={300}
            borderStyle="dashed"
            borderWidth={1}
            borderColor="cinza"
          >
            <Text textAlign="center" px={10} fontSize={12}>
              Adicione as fotos do consultório
            </Text>
          </Center>
          <ChakraInput
            display="none"
            type="file"
            multiple
            id="imagem"
            onChange={handleChange}
          />
        </FormLabel>
        <Wrap spacing={4} justify="center">
          {selectedImage.length > 0 &&
            selectedImage.map((item: any) => (
              <Flex
                key={item.size}
                sx={{
                  svg: { visibility: "hidden" },
                  _hover: { svg: { visibility: "visible" } },
                }}
                borderWidth={1}
                borderRadius={10}
              >
                <Image
                  alt="Imagem do consultorio"
                  w={200}
                  h={150}
                  objectFit="contain"
                  src={selectedImage ? URL.createObjectURL(item) : "/fabio.jpg"}
                />
                <Icon
                  as={FiX}
                  _hover={{ cursor: "pointer", color: "vermelho" }}
                  onClick={() =>
                    setSelectedImage(
                      selectedImage.filter(
                        (filter: any) => item.size !== filter.size
                      )
                    )
                  }
                />
              </Flex>
            ))}
        </Wrap>
        <Heading alignSelf="start" fontSize={28}>
          Endereço
        </Heading>

        <Wrap justify="space-around" spacing={5} w="full">
          <Input
            as={ReactInputMask}
            mask={"99.999-999"}
            maskChar="_"
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={200}
            variant="outline"
            title="CEP"
            id="cep"
          />
          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            variant="outline"
            maxW={900}
            title="Endereço"
            id="endereco"
          />
          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            variant="outline"
            maxW="210"
            title="Número"
            id="numero"
          />

          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={210}
            variant="outline"
            title="Complemento"
            id="complemento"
          />

          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={210}
            variant="outline"
            title="Bairro"
            id="bairro"
          />
          <Input
            borderRadius={14}
            labelColor="cinzaescuro"
            maxW={210}
            variant="outline"
            title="Cidade"
            id="cidade"
          />
          <VStack maxW={{ base: "full", sm: 210 }} w="full">
            <FormLabel
              fontWeight={400}
              color="cinzaescuro"
              alignSelf="start"
              fontSize={14}
            >
              Estado
            </FormLabel>
            <ChakraSelect
              borderRadius={14}
              placeholder="UF"
              color="cinza"
              variant="outline"
              _focus={{ bg: "white" }}
              fontSize={14}
              id="estado"
            >
              {ESTADOS_SIGLA.map((item: any) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </ChakraSelect>
          </VStack>
        </Wrap>
      </Flex>
    </Flex>
  );
}
