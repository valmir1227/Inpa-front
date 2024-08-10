import { DownloadIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Center,
  Heading,
  HStack,
  Input,
  Spinner,
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { AlertInpa, AlertInpaCall } from "components/global/Alert";
import { expertCityState } from "components/global/expertCityState";
import { LoadingInpa } from "components/global/Loading";
import { useMyContext } from "contexts/Context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { RiHealthBookLine } from "react-icons/ri";
import useSWR from "swr";
import { fetcher } from "utils/api";
import { BASE_URL } from "utils/CONFIG";
import { toBrDate } from "utils/toBrDate";
import { toReal } from "utils/toReal";
import { colorStatus, translateStatus } from "utils/translateStatus";
import { Button, ButtonLink } from "../../global/Button";
import { Modal } from "../../global/Modal";
import { Timeline } from "../../psicologo/TimeLine";
import { usePatch } from "hooks/usePatch";
import { useForm } from "react-hook-form";
import { Select } from "components/global/Select";
import { STATUS_OBJ, STATUS_VALUE } from "utils/STATUS";

export function ModalComprovanteDetalhesPagamento({
  isOpen,
  onClose,
  selectedAppointment,
  type,
  admin = false,
  records = false,
  getAppointment = null,
}: any) {
  const { user } = useMyContext();

  const isExpert = type === "expert";

  const userPhotoExpert =
    selectedAppointment?.expert?.avatar && selectedAppointment.expert?.avatar;

  const userPhotoPatient = selectedAppointment?.patient?.avatar;

  const userPhoto = isExpert ? userPhotoPatient : userPhotoExpert;

  const subTotal = selectedAppointment?.service_value || 0;
  const tax = subTotal * (user?.tax / 100);
  const total = subTotal - tax;
  const showRecords = records && isExpert;

  if (!selectedAppointment) return null;

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <Wrap
        align="center"
        justify="space-between"
        spacing={{ base: 8, sm: 12 }}
        w="full"
      >
        <VStack spacing={5}>
          <Heading fontSize={20}>
            {isExpert ? "Paciente" : "Profissional"}
          </Heading>
          <HStack>
            <Avatar src={userPhoto} w={46} />
            {isExpert ? (
              <VStack align="start" w="fit-content" lineHeight={1} spacing={0}>
                <Text>
                  {selectedAppointment.patient.social_name ||
                    selectedAppointment.patient.name}
                </Text>
                {selectedAppointment.patient.social_name && (
                  <Text fontWeight={400} fontSize={11}>
                    ({selectedAppointment.patient.name})
                  </Text>
                )}
              </VStack>
            ) : (
              <VStack spacing={1} align="start">
                <Text>{selectedAppointment.expert.name}</Text>
                {selectedAppointment?.expert.councils?.map((council: any) => (
                  <Text key={council.id} fontSize={12}>
                    {council?.council} - {council?.number}
                  </Text>
                ))}
                <Text fontSize={12}>
                  {expertCityState(selectedAppointment.expert)}
                </Text>
              </VStack>
            )}
          </HStack>
        </VStack>

        <VStack spacing={5}>
          <Heading fontSize={20}>Status</Heading>
          <Tag
            borderRadius="full"
            px={4}
            color="white"
            bg={colorStatus(selectedAppointment.status)}
          >
            <Text fontSize={12}>
              {translateStatus(selectedAppointment.status)}
            </Text>
          </Tag>
        </VStack>
        <VStack spacing={5}>
          <Heading fontSize={20}>Data</Heading>
          <VStack fontSize={12} spacing={0}>
            <Text textTransform="capitalize">
              {format(new Date(selectedAppointment.hour), "eeeeee", {
                locale: ptBR,
              })}
            </Text>
            <Text>{format(new Date(selectedAppointment.hour), "dd/MM")}</Text>
          </VStack>
        </VStack>
        <VStack spacing={5}>
          <Heading fontSize={20}>Horário</Heading>
          <Tag px={4} color="white" bg="amarelo">
            <Text fontSize={12}>
              {format(new Date(selectedAppointment.hour), "HH:mm")}
            </Text>
          </Tag>
        </VStack>

        <VStack fontSize={12} spacing={5}>
          <Heading fontSize={20}>Modalidade</Heading>
          <Text textAlign="end" sx={{ b: { fontWeight: 500, color: "azul" } }}>
            {selectedAppointment.service_name} <br />{" "}
            <b>{selectedAppointment.location}</b>
          </Text>
        </VStack>
        <VStack fontSize={12} spacing={5}>
          <Heading fontSize={20}>Pagamento</Heading>
          <Text textAlign="end" sx={{ b: { fontWeight: 500 } }}>
            {translateStatus(
              selectedAppointment.order?.transaction_data?.status ||
                selectedAppointment.billing_type
            )}
          </Text>
        </VStack>
        {!isExpert &&
          selectedAppointment.order?.transaction_data?.created_at && (
            <VStack fontSize={12} spacing={5}>
              <Heading fontSize={20}>Data do pagamento</Heading>
              <Text>
                {format(
                  new Date(
                    selectedAppointment.order?.transaction_data?.created_at
                  ),
                  "dd/MM"
                )}
              </Text>
            </VStack>
          )}
        <VStack fontSize={12} spacing={5}>
          <Heading fontSize={20}>Subtotal</Heading>
          <Text>{toReal(subTotal, user)}</Text>
        </VStack>
        {isExpert && (
          <>
            <VStack fontSize={12} spacing={5}>
              <Heading fontSize={20}>Taxa</Heading>
              <Text>- {toReal(tax)}</Text>
            </VStack>
            <VStack fontSize={12} spacing={5}>
              <Heading fontSize={20}>Total</Heading>
              <Text>{toReal(total)}</Text>
            </VStack>
          </>
        )}
      </Wrap>
      {admin && (
        <UpdateAppointmentStatus
          selectedAppointment={selectedAppointment}
          getAppointment={getAppointment}
        />
      )}
    </Modal>
  );
}

const UpdateAppointmentStatus = ({
  selectedAppointment,
  getAppointment,
}: any) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
  } = useForm({
    defaultValues: {
      status: selectedAppointment.status?.replace("(auto)", ""),
    },
  }) as any;

  const [handlePatchAppointment, data, error, isLoading] = usePatch(
    `/v1/appointments/${selectedAppointment.id}`
  );

  const onSubmit = async (data: any) => {
    handlePatchAppointment(data);
  };

  useEffect(() => {
    if (data?.statusText === "OK") {
      getAppointment();
    }
    getAppointment();
  }, [data]);

  if (!selectedAppointment) return null;

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      align="center"
      spacing={2}
      mt={4}
    >
      <HStack align="end" spacing={0}>
        <Select
          register={{
            ...register("status", {
              required: "Informe um status",
            }),
          }}
          maxW={220}
          title="Alterar status da sessão:"
          titleColor="textosecundario"
          values={STATUS_VALUE}
          defaultValue={selectedAppointment.status?.replace("(auto)", "")}
          bg="white"
          borderColor="cinza"
          borderEndRadius={0}
          borderWidth={1}
          borderRightWidth={0}
          variant="outline"
          placeholder="Escolha o status desejado"
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
          title="Atualizar status"
          isLoading={isLoading}
        />
      </HStack>
      <Center>
        <AlertInpaCall
          error={{
            validate: error,
            text: "Erro ao atualizar status",
          }}
          success={{
            validate: data.statusText === "OK",
            text: "Status atualizado com sucesso",
          }}
        />
      </Center>
      {errors.status && (
        <AlertInpa text={errors.status.message || "Status inválido"} />
      )}
    </VStack>
  );
};
