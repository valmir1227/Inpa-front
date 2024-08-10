/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Text,
  Wrap,
  VStack,
  useDisclosure,
  HStack,
  Tag,
  IconButton,
  Button as ChakraButton,
  Center,
  Avatar,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Spinner,
  Alert,
  AlertIcon,
  Icon,
} from "@chakra-ui/react";

import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { Input, Select } from "../global/Select";
import { BsCalendar, BsFilter, BsTrash } from "react-icons/bs";
import { Button, ButtonLink } from "../global/Button";
import { differenceInDays, format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { colorStatus, translateStatus } from "utils/translateStatus";
import { AlertInpa, AlertInpaCall } from "components/global/Alert";
import { ModalComprovanteDetalhesPagamento } from "components/paciente/sessoes/ModalComprovanteDetalhesPagamento";
import { LoadingInpa } from "components/global/Loading";
import { BASE_URL, DAYS_UNTIL_WITHDRAW } from "utils/CONFIG";
import { toReal } from "utils/toReal";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { STATUS, STATUS_OBJ } from "utils/STATUS";
import { toBrDate, toBrFullDate } from "utils/toBrDate";
import { fetcher } from "utils/api";
import useSwr from "swr";
import { Modal } from "components/global/Modal";
import { useRouter } from "next/router";
import { usePost } from "hooks/usePost";
import { Edit } from "@material-ui/icons";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { orderBy } from "lodash";
import { usePut } from "hooks/usePut";
import { useDel } from "hooks/useDel";

export function Cupons() {
  const { data, error, isLoading, isValidating, mutate } = useSwr(
    `/v1/coupons`,
    fetcher
  );

  /*   useEffect(() => {
    if (user?.id) mutate();
  }, ); */

  function Coupons() {
    if (error)
      return (
        <AlertInpa
          status="warning"
          text={error?.response?.data?.error || "Erro ao carregar cupons"}
        />
      );

    if (isLoading) return <LoadingInpa />;

    if (data?.data?.length === 0)
      return <AlertInpa text="Nenhum cupom encontrado" />;

    const coupons = orderBy(data?.data, ["created_at"], ["desc"]);

    return coupons.map((item: any) => {
      /* console.log(
        "differenceInDays",
        differenceInDays(new Date(), item.date.date)
      ); */
      return (
        <Wrap
          key={item.id}
          borderColor="cinza"
          p={4}
          _hover={{ bg: "bg" }}
          align="center"
          textAlign="center"
          justify="space-between"
          fontSize={12}
          w="full"
          spacing={{ base: 2, md: 2 }}
          borderBottomWidth={1}
          direction={["column", "row"]}
          fontWeight={400}
          color="cinza"
          css={{ p: { width: 110 } }}
          sx={{ span: { color: "amarelo", fontWeight: 600, fontSize: 14 } }}
          // flexGrow={1}
        >
          {/* <p>
            id:{" "}
            <span>
              <br />
              {item.id}
            </span>
          </p> */}
          <p>
            code:{" "}
            <span>
              <br />
              {item.code}
            </span>
          </p>
          <p>
            description:{" "}
            <span>
              <br />
              {item.description}
            </span>
          </p>
          <p>
            discount:{" "}
            <span>
              <br />
              {item.type === "percent"
                ? item.discount * 100 + " %"
                : toReal(+item.discount)}
            </span>
          </p>
          <p>
            type:{" "}
            <span>
              <br />
              {item.type}
            </span>
          </p>
          {/* <p>limit: <span><br/>{item.limit}</p></span> */}
          <p>
            quantity:{" "}
            <span>
              <br />
              {item.quantity}
            </span>
          </p>
          {/* <p>expires_date: <span><br/>{item.expires_date}</p></span> */}
          {/* <p>user_id: <span><br/>{item.user_id}</p></span> */}
          <p>
            status:{" "}
            <span>
              <br />
              {item.status}
            </span>
          </p>
          {/* <p>orders: <span><br/>{item.orders}</p></span> */}
          <p>
            created_at:{" "}
            <span>
              <br />
              {toBrFullDate(item.created_at)}
            </span>
          </p>
          <p>
            updated_at:{" "}
            <span>
              <br />
              {toBrFullDate(item.updated_at)}
            </span>
          </p>
          <Flex p={2} flex={1} gap={2} justifyContent={["center", "end"]}>
            <IconButton
              boxSize={4}
              variant="ghost"
              aria-label="editar"
              as={EditIcon}
              _hover={{ cursor: "pointer", color: "azul" }}
              onClick={() => push({ query: { action: "edit", id: item.id } })}
            />
            <IconButton
              boxSize={4}
              variant="ghost"
              aria-label="delete"
              as={BsTrash}
              _hover={{ cursor: "pointer", color: "vermelho" }}
              onClick={() =>
                push({ query: { action: "delete", id: item.code } })
              }
            />
          </Flex>
        </Wrap>
      );
    });
  }

  const { push } = useRouter();
  const onSuccess = () => {
    mutate();
    push({ query: null });
  };

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
        p={{ base: "1rem", md: "2rem" }}
        bg="white"
        borderTopRadius={20}
        borderWidth={1}
        borderColor="cinza"
        align="start"
        maxW={1100}
        w="full"
        justify="space-between"
        gap={6}
        mt={4}
      >
        <Heading fontSize={28}>Cupons</Heading> {isValidating && <Spinner />}
        <Link href={{ query: { action: "new" } }} passHref>
          <Button
            fontSize={14}
            lineHeight={1}
            px={8}
            borderRadius={6}
            color="amarelo"
            textColor="white"
            colorScheme="none"
            title="Novo cupom"
          />
        </Link>
      </Flex>
      <VStack
        bg="white"
        maxW={1100}
        w="full"
        align="start"
        spacing={0}
        borderX="1px"
        borderColor="cinza"
      >
        {Coupons()}
      </VStack>
      <CuponsModal
        onClose={() => push({ query: null })}
        coupons={data}
        onSuccess={onSuccess}
      />
      <DeleteCuponsModal
        onClose={() => push({ query: null })}
        coupons={data}
        onSuccess={onSuccess}
      />
    </Flex>
  );
}

const CuponsModal = ({ onClose, coupons, onSuccess }: any) => {
  const { query } = useRouter();
  const { action, id } = query;

  const selectedCoupon = coupons?.data?.find(
    (coupon: any) => coupon.id === Number(id)
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const type = watch("type");
  const isPercent = type === "percent";
  const discount = watch("discount");

  useEffect(() => {
    if (selectedCoupon)
      reset({
        ...selectedCoupon,
        discount:
          +selectedCoupon.discount *
          (selectedCoupon.type === "percent" ? 100 : 1),
      });
    else reset({});
  }, [action]);

  const onSubmit = async (data: any) => {
    const formatedData = {
      discount: isPercent ? +discount / 100 : +discount,
      code: data.code,
      type: data.type,
      description: data.description,
      quantity: data.quantity,
    };
    if (selectedCoupon) return await handlePut(formatedData);
    await handlePost(formatedData);
  };

  const [handlePost, data, error, isPosting] = usePost(
    `/v1/coupons/`,
    onSuccess
  );
  const [handlePut, dataPut, errorPut, isPuting] = usePut(
    `/v1/coupons/${selectedCoupon?.code}`,
    onSuccess
  );

  // console.log("data response", data);

  return (
    <Modal
      isOpen={action?.includes("new") || action?.includes("edit")}
      onClose={onClose}
      title={selectedCoupon ? "Editar Cupom" : "Novo cupom"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDir="column" gap={4}>
          <Input
            errors={errors}
            labelColor="cinza"
            title="Código"
            register={register("code", { required: "Código" })}
          />
          <Select
            titleColor="cinza"
            // maxW={300}
            values={["percent", "value"]}
            title="Tipo"
            register={register("type", { required: "Tipo" })}
          />
          <Input
            errors={errors}
            labelColor="cinza"
            title="Desconto"
            register={register("discount", { required: "Desconto" })}
            type="number"
            // step={0.01}
            step={isPercent ? 1 : 0.01}
          />
          <Input
            errors={errors}
            labelColor="cinza"
            title="Descrição"
            register={register("description", { required: "Descrição" })}
          />

          <Input
            errors={errors}
            labelColor="cinza"
            title="Quantidade"
            register={register("quantity", { required: "Quantidade" })}
            type="number"
          />
          <AlertInpaCall
            maxW={440}
            variant="warning"
            error={{
              validate: error || errorPut,
              text: error?.response?.data?.raw?.detail,
            }}
          />
          {Object.keys(errors).length > 0 && (
            <Alert mt={2} status="warning">
              <AlertIcon />
              <Text fontWeight="bold">Campos obrigatórios</Text>
              <Wrap>
                {Object.values(errors)?.map((err: any) => {
                  return (
                    <Tag
                      color="red.300"
                      bg="white"
                      mx={2}
                      key={err}
                      fontWeight={400}
                      lineHeight={1}
                    >
                      {err?.message}
                    </Tag>
                  );
                })}
              </Wrap>
            </Alert>
          )}

          <Button
            isLoading={isPosting || isPuting}
            mt={4}
            type="submit"
            title={
              (selectedCoupon ? "Editar cupom de: " : "Criar cupom de: ") +
              (isPercent ? `${discount} %` : `${toReal(+discount)}`)
            }
          />
        </Flex>
      </form>
    </Modal>
  );
};
const DeleteCuponsModal = ({ onClose, coupons, onSuccess }: any) => {
  const { query } = useRouter();
  const { action, id } = query;

  const selectedCoupon = coupons?.data?.find(
    (coupon: any) => coupon.code === id
  );

  const [handleDelete, dataDelete, errorDelete, isDeleting] = useDel(
    `/v1/coupons/${selectedCoupon?.code}`,
    onSuccess
  );

  if (!selectedCoupon) return null;

  return (
    <Modal isOpen={action === "delete"} onClose={onClose} title="Deletar cupom">
      <Center flexDir="column" gap={4}>
        <AlertInpaCall
          maxW={440}
          variant="warning"
          error={{
            validate: errorDelete,
            text: errorDelete?.response?.data?.raw?.detail,
          }}
        />
        Confirmar exclusão do cupom:
        <p>id: {selectedCoupon.id}</p>
        <p>code: {selectedCoupon.code}</p>
        <p>description: {selectedCoupon.description}</p>
        <p>discount: {selectedCoupon.discount}</p>
        <p>type: {selectedCoupon.type}</p>
        <Button
          leftIcon={<BsTrash />}
          isLoading={isDeleting}
          mt={4}
          onClick={handleDelete}
          title="Apagar cupom"
        />
      </Center>
    </Modal>
  );
};
