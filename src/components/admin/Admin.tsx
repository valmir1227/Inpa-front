import React from "react";
import {
  Alert,
  AlertIcon,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { usePost } from "hooks/usePost";
import { useMyContext } from "contexts/Context";
import { Input } from "components/global/Select";
import { Button } from "components/global/Button";
import { usePatch } from "hooks/usePatch";
import { AlertInpa, AlertInpaCall } from "components/global/Alert";

export function Admin() {
  const { user } = useMyContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { tax: user?.tax } } as any);

  const [handlePatch, data, error, isLoading] = usePatch(`/v1/users/999999`);

  const onSubmit = async (data: any) => {
    handlePatch(data);
  };

  if (!user?.id) return null;
  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      justify="center"
      align="center"
      w="100%"
    >
      <Flex
        p="5rem 1rem"
        align="center"
        maxW={1200}
        w="full"
        justify="space-between"
        flexDir="column"
      >
        <Text>Taxa de comissão para os próximos cadastros</Text>
        <VStack w={170}>
          <Input
            id="tax"
            register={{
              ...register("tax", {
                required: "Informe um valor",
                max: {
                  value: 100,
                  message: "Não pode ser maior que 100",
                },
                min: {
                  value: 0,
                  message: "Não pode ser menor que 0",
                },
                valueAsNumber: true,
              }),
            }}
            errors={errors}
            mask={"999.999.999-99"}
            maskChar={null}
            placeholder="%"
            defaultValue={user?.tax}
            type="number"
          />
          <Button title="Salvar" type="submit" isLoading={isLoading} />
          <AlertInpaCall
            error={{ validate: error, text: "Erro ao salvar" }}
            success={{ validate: data.status === 200, text: "Atualizado" }}
          />
          {Object.keys(errors).map((err) => (
            <Alert mt={2} key={err} status="warning">
              <AlertIcon />
              {errors[err]?.message}
            </Alert>
          ))}
        </VStack>
      </Flex>
    </Flex>
  );
}
