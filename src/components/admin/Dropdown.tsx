/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useEffect, useRef, useState } from "react";
import {
  Flex,
  Heading,
  Text,
  Wrap,
  VStack,
  HStack,
  IconButton,
  CloseButton,
  Icon,
  useDisclosure,
  Editable,
  EditableInput,
  EditablePreview,
  Input as ChakraInput,
} from "@chakra-ui/react";

import { Input } from "../global/Select";
import { Button } from "../global/Button";
import { useFetch } from "hooks/useFetch";
import { useForm } from "react-hook-form";
import { useMyContext } from "contexts/Context";
import { usePut } from "hooks/usePut";
import { usePost } from "hooks/usePost";
import { FiX } from "react-icons/fi";
import { useDel } from "hooks/useDel";
import { Modal } from "components/global/Modal";
import { LoadingInpa } from "components/global/Loading";
import { EditIcon } from "@chakra-ui/icons";
import { AlertInpaCall } from "components/global/Alert";

export function Dropdown() {
  return (
    <Flex
      bg="#f5f5f5"
      flexDir="column"
      as="section"
      justify="center"
      align="center"
      w="100%"
      gap={0}
      pb={6}
    >
      <Flex
        p={{ base: "1rem 1rem 0px", md: "2rem 2rem 0px" }}
        bg="white"
        borderTopRadius={20}
        borderWidth={1}
        borderColor="cinza"
        align="start"
        maxW={1100}
        w="full"
        justify="space-between"
        flexDir="column"
        gap={6}
        mt={4}
      >
        <Heading fontSize={28}>Seleções</Heading>

        <Wrap align="start" p={1} w="full" justify="space-between">
          <Specialties />
          <Tags />
          <Approaches />
        </Wrap>
      </Flex>
    </Flex>
  );
}

function Specialties() {
  const { user } = useMyContext();
  const { register, handleSubmit, reset } = useForm();

  // const [selectedSpecialties, setSelectedSpecialties] = useState({} as any);
  const [selectedIdToRemove, setSelectedIdToRemove] = useState(0);
  const [selectedItemToRename, setSelectedItemToRename] = useState({} as any);

  const [
    dataSpecialties,
    errorSpecialties,
    isFetchingSpecialties,
    getSpecialties,
  ] = useFetch("/v1/specialties/");

  const [
    handlePostSpecialties,
    dataPostSpecialties,
    errorPostSpecialties,
    isPostingSpecialties,
  ] = usePost(`/v1/specialties`);

  const [
    handleDelSpecialties,
    dataDelSpecialties,
    errorDelSpecialties,
    isDeletingSpecialties,
  ] = useDel(`/v1/specialties/${selectedIdToRemove}`);

  const [
    handlePutSpecialties,
    dataPutSpecialties,
    errorPutSpecialties,
    isPutingSpecialties,
  ] = usePut(`/v1/specialties/${selectedItemToRename.id}`);

  const inputRef = useRef<any>();

  const onSubmit = (data: any) => {
    const formattedData = { name: data.specialty };
    handlePostSpecialties(formattedData);
    // handlePostSpecialties(formattedData);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRenameModal,
    onOpen: onOpenRenameModal,
    onClose: onCloseRenameModal,
  } = useDisclosure();

  useEffect(() => {
    if (dataDelSpecialties.status === 200) {
      getSpecialties();
      onClose();
      reset();
      return;
    }
    if (user?.id || dataPostSpecialties.status === 200) {
      getSpecialties();
      return;
    }
    if (user?.id || dataPutSpecialties.status === 200) {
      getSpecialties();
      return;
    }
  }, [user, dataPostSpecialties, dataDelSpecialties, dataPutSpecialties]);

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      maxW={300}
      w="full"
      align="start"
    >
      <HStack align="flex-end" w="full" spacing={0}>
        <Input
          register={{ ...register("specialty", { required: true }) }}
          bg="white"
          borderColor="cinza"
          labelColor="cinza"
          borderEndRadius={0}
          borderWidth={1}
          borderRightWidth={0}
          title="Especialidades"
          type="search"
        />
        <Button
          type="submit"
          fontSize={14}
          lineHeight={1}
          px={8}
          borderRadius={6}
          borderStartRadius={0}
          color="amarelo"
          textColor="white"
          colorScheme="none"
          title="Adicionar"
          isLoading={isPostingSpecialties}
        />
      </HStack>
      {isFetchingSpecialties && <LoadingInpa />}
      {dataSpecialties?.map((item: any) => (
        <HStack
          w="full"
          py={2}
          _hover={{ button: { visibility: "visible" } }}
          key={item.id}
        >
          <Text>{item.name}</Text>
          <IconButton
            visibility="hidden"
            isRound
            size="xs"
            aria-label="Editar"
            colorScheme="blackAlpha"
            color="white"
            icon={<Icon as={EditIcon} />}
            onClick={() => {
              setSelectedItemToRename(item);
              onOpenRenameModal();
            }}
          />
          <IconButton
            visibility="hidden"
            isRound
            size="xs"
            aria-label="Remover"
            colorScheme="red"
            color="white"
            icon={<Icon as={FiX} />}
            onClick={() => {
              setSelectedIdToRemove(item.id);
              onOpen();
            }}
          />
        </HStack>
      ))}
      <Modal isOpen={isOpen} onClose={onClose} title="Confirmação">
        <VStack w="full">
          <Text pb={6}>Tem certeza que deseja remover?</Text>
          <Button
            isLoading={isDeletingSpecialties}
            size="lg"
            title="Sim"
            onClick={handleDelSpecialties}
          />
          <Button
            color="white"
            textColor="cinza"
            title="Cancelar"
            onClick={onClose}
          />
        </VStack>
      </Modal>
      <Modal
        isOpen={isOpenRenameModal}
        onClose={onCloseRenameModal}
        title="Renomear"
      >
        <VStack w="full" spacing={4}>
          <ChakraInput
            ref={inputRef}
            defaultValue={selectedItemToRename.name}
          />
          <Button
            isLoading={isPutingSpecialties}
            size="lg"
            title="Renomear"
            onClick={() =>
              handlePutSpecialties({ name: inputRef.current?.value })
            }
          />
          <Button
            color="white"
            textColor="cinza"
            title="Cancelar"
            onClick={onCloseRenameModal}
          />
          <AlertInpaCall
            error={{ validate: errorPutSpecialties, text: "Erro ao renomear" }}
            success={{
              validate: dataPutSpecialties.status === 200,
              text: "Atualizado com sucesso",
            }}
          />
        </VStack>
      </Modal>
    </VStack>
  );
}

function Tags() {
  const { user } = useMyContext();
  const { register, handleSubmit, reset } = useForm();

  // const [selectedSpecialties, setSelectedSpecialties] = useState({} as any);
  const [selectedIdToRemove, setSelectedIdToRemove] = useState(0);
  const [selectedItemToRename, setSelectedItemToRename] = useState({} as any);

  const [dataTags, errorTags, isFetchingTags, getTags] = useFetch("/v1/tags/");

  const [handlePostTags, dataPostTags, errorPostTags, isPostingTags] =
    usePost(`/v1/tags`);

  const [handleDelTags, dataDelTags, errorDelTags, isDeletingTags] = useDel(
    `/v1/tags/${selectedIdToRemove}`
  );

  const [handlePutTags, dataPutTags, errorPutTags, isPutingTags] = usePut(
    `/v1/tags/${selectedItemToRename.id}`
  );

  const inputRef = useRef<any>();

  const onSubmit = (data: any) => {
    const formattedData = { name: data.specialty };
    handlePostTags(formattedData);
    // handlePostTags(formattedData);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenRenameModal,
    onOpen: onOpenRenameModal,
    onClose: onCloseRenameModal,
  } = useDisclosure();

  useEffect(() => {
    if (dataDelTags.status === 200) {
      getTags();
      onClose();
      reset();
      return;
    }
    if (user?.id || dataPostTags.status === 200) {
      getTags();
      return;
    }
    if (user?.id || dataPutTags.status === 200) {
      getTags();
      return;
    }
  }, [user, dataPostTags, dataDelTags, dataPutTags]);

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      maxW={300}
      w="full"
      align="start"
    >
      <HStack align="flex-end" w="full" spacing={0}>
        <Input
          register={{ ...register("specialty", { required: true }) }}
          bg="white"
          borderColor="cinza"
          labelColor="cinza"
          borderEndRadius={0}
          borderWidth={1}
          borderRightWidth={0}
          title="Ajuda"
          type="search"
        />
        <Button
          type="submit"
          fontSize={14}
          lineHeight={1}
          px={8}
          borderRadius={6}
          borderStartRadius={0}
          color="amarelo"
          textColor="white"
          colorScheme="none"
          title="Adicionar"
          isLoading={isPostingTags}
        />
      </HStack>
      {isFetchingTags && <LoadingInpa />}
      {dataTags?.map((item: any) => (
        <HStack
          w="full"
          py={2}
          _hover={{ button: { visibility: "visible" } }}
          key={item.id}
        >
          <Text>{item.name}</Text>
          <IconButton
            visibility="hidden"
            isRound
            size="xs"
            aria-label="Editar"
            colorScheme="blackAlpha"
            color="white"
            icon={<Icon as={EditIcon} />}
            onClick={() => {
              setSelectedItemToRename(item);
              onOpenRenameModal();
            }}
          />
          <IconButton
            visibility="hidden"
            isRound
            size="xs"
            aria-label="Remover"
            colorScheme="red"
            color="white"
            icon={<Icon as={FiX} />}
            onClick={() => {
              setSelectedIdToRemove(item.id);
              onOpen();
            }}
          />
        </HStack>
      ))}

      <Modal isOpen={isOpen} onClose={onClose} title="Confirmação">
        <VStack w="full">
          <Text pb={6}>Tem certeza que deseja remover?</Text>
          <Button
            isLoading={isDeletingTags}
            size="lg"
            title="Sim"
            onClick={handleDelTags}
          />
          <Button
            color="white"
            textColor="cinza"
            title="Cancelar"
            onClick={onClose}
          />
        </VStack>
      </Modal>
      <Modal
        isOpen={isOpenRenameModal}
        onClose={onCloseRenameModal}
        title="Renomear"
      >
        <VStack w="full" spacing={4}>
          <ChakraInput
            ref={inputRef}
            defaultValue={selectedItemToRename.name}
          />
          <Button
            isLoading={isPutingTags}
            size="lg"
            title="Renomear"
            onClick={() => handlePutTags({ name: inputRef.current?.value })}
          />
          <Button
            color="white"
            textColor="cinza"
            title="Cancelar"
            onClick={onCloseRenameModal}
          />
          <AlertInpaCall
            error={{ validate: errorPutTags, text: "Erro ao renomear" }}
            success={{
              validate: dataPutTags.status === 200,
              text: "Atualizado com sucesso",
            }}
          />
        </VStack>
      </Modal>
    </VStack>
  );
}

function Approaches() {
  const { user } = useMyContext();
  const { register, handleSubmit, reset } = useForm();

  // const [selectedSpecialties, setSelectedSpecialties] = useState({} as any);
  const [selectedIdToRemove, setSelectedIdToRemove] = useState(0);
  const [selectedItemToRename, setSelectedItemToRename] = useState({} as any);

  const [dataApproaches, errorApproaches, isFetchingApproaches, getApproaches] =
    useFetch("/v1/approaches/");

  const [
    handlePostApproaches,
    dataPostApproaches,
    errorPostApproaches,
    isPostingApproaches,
  ] = usePost(`/v1/approaches`);

  const [
    handleDelApproaches,
    dataDelApproaches,
    errorDelApproaches,
    isDeletingApproaches,
  ] = useDel(`/v1/approaches/${selectedIdToRemove}`);

  const [
    handlePutApproaches,
    dataPutApproaches,
    errorPutApproaches,
    isPutingApproaches,
  ] = usePut(`/v1/approaches/${selectedItemToRename.id}`);

  const inputRef = useRef<any>();

  const onSubmit = (data: any) => {
    const formattedData = { name: data.specialty };
    handlePostApproaches(formattedData);
    // handlePostApproaches(formattedData);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRenameModal,
    onOpen: onOpenRenameModal,
    onClose: onCloseRenameModal,
  } = useDisclosure();

  useEffect(() => {
    if (dataDelApproaches.status === 200) {
      getApproaches();
      onClose();
      reset();
      return;
    }
    if (user?.id || dataPostApproaches.status === 200) {
      getApproaches();
      return;
    }
    if (user?.id || dataPutApproaches.status === 200) {
      getApproaches();
      return;
    }
  }, [user, dataPostApproaches, dataDelApproaches, dataPutApproaches]);

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      maxW={300}
      w="full"
      align="start"
    >
      <HStack align="flex-end" w="full" spacing={0}>
        <Input
          register={{ ...register("specialty", { required: true }) }}
          bg="white"
          borderColor="cinza"
          labelColor="cinza"
          borderEndRadius={0}
          borderWidth={1}
          borderRightWidth={0}
          title="Abordagens"
          type="search"
        />
        <Button
          type="submit"
          fontSize={14}
          lineHeight={1}
          px={8}
          borderRadius={6}
          borderStartRadius={0}
          color="amarelo"
          textColor="white"
          colorScheme="none"
          title="Adicionar"
          isLoading={isPostingApproaches}
        />
      </HStack>
      {isFetchingApproaches && <LoadingInpa />}
      {dataApproaches?.map((item: any) => (
        <HStack
          w="full"
          py={2}
          _hover={{ button: { visibility: "visible" } }}
          key={item.id}
        >
          <Text>{item.name}</Text>
          <IconButton
            visibility="hidden"
            isRound
            size="xs"
            aria-label="Editar"
            colorScheme="blackAlpha"
            color="white"
            icon={<Icon as={EditIcon} />}
            onClick={() => {
              setSelectedItemToRename(item);
              onOpenRenameModal();
            }}
          />
          <IconButton
            visibility="hidden"
            isRound
            size="xs"
            aria-label="Remover"
            colorScheme="red"
            color="white"
            icon={<Icon as={FiX} />}
            onClick={() => {
              setSelectedIdToRemove(item.id);
              onOpen();
            }}
          />
        </HStack>
      ))}

      <Modal isOpen={isOpen} onClose={onClose} title="Confirmação">
        <VStack w="full">
          <Text pb={6}>Tem certeza que deseja remover?</Text>
          <Button
            isLoading={isDeletingApproaches}
            size="lg"
            title="Sim"
            onClick={handleDelApproaches}
          />
          <Button
            color="white"
            textColor="cinza"
            title="Cancelar"
            onClick={onClose}
          />
        </VStack>
      </Modal>

      <Modal
        isOpen={isOpenRenameModal}
        onClose={onCloseRenameModal}
        title="Renomear"
      >
        <VStack w="full" spacing={4}>
          <ChakraInput
            ref={inputRef}
            defaultValue={selectedItemToRename.name}
          />
          <Button
            isLoading={isPutingApproaches}
            size="lg"
            title="Renomear"
            onClick={() =>
              handlePutApproaches({ name: inputRef.current?.value })
            }
          />
          <Button
            color="white"
            textColor="cinza"
            title="Cancelar"
            onClick={onCloseRenameModal}
          />
          <AlertInpaCall
            error={{ validate: errorPutApproaches, text: "Erro ao renomear" }}
            success={{
              validate: dataPutApproaches.status === 200,
              text: "Atualizado com sucesso",
            }}
          />
        </VStack>
      </Modal>
    </VStack>
  );
}
