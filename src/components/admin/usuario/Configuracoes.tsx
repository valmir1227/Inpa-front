import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Wrap,
  VStack,
  FormLabel,
  Text,
  Alert,
  AlertIcon,
  Card,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  FormControl,
} from "@chakra-ui/react";

import { Input } from "../../global/Select";
import { CheckboxInpa, SingleCheckboxInpa } from "../../global/Checkbox";
import { useMyContext } from "contexts/Context";
import { Controller, useForm } from "react-hook-form";
import { toBrDate0GMT } from "utils/toBrDate";
import { GENEROS } from "utils/GENEROS";
import InputMask from "react-input-mask";
import { Button } from "components/global/Button";
import { ESTADOS_SIGLA } from "utils/ESTADOS";
import ReactInputMask from "react-input-mask";
import { useUsers } from "stores/useUser";
import { useRouter } from "next/router";
import { useFetchUser } from "hooks/useFetchUser";
import { AlertInpa, AlertInpaCall } from "components/global/Alert";
import Select from "react-select";
import { IDIOMAS_OBJ } from "utils/IDIOMAS";
import { PERMISSOES_OBJ } from "utils/PERMISSOES";
import useSwr from "swr";
import { fetcher } from "utils/api";

export function Configuracoes({
  handlePatchUser,
  dataPatchUser,
  errorPatchUser,
  isPatchingUser,
  user,
  dataUsers,
}: any) {
  // const {
  //   data: user,
  //   mutate: getUser,
  //   isValidating: isValidatingUser,
  // } = useSWR("/v1/users/me", fetcher) as any;

  const [pessoaJuridica, setPessoaJuridica] = useState(
    user?.is_company ? ["Pessoa Jurídica ?"] : [""]
  );
  //filter para remover strings vazias e nao confundir a condicao de exibicao, ja que o checkbox mantem uma string vazia no toggle do checkbox
  const pj = pessoaJuridica.filter((item) => item.length).length > 0;

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isDirty, dirtyFields, touchedFields },
  } = useForm({
    defaultValues: {
      ...user,
    } as any,
  });

  const onSubmit = async (data: any) => {
    const clearNulled = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== null)
    ) as any;
    /* return console.log({
      dirtyFields,
      touchedFields,
      get: getValues(touchedFields),
    }); */
    const dirtyData = {} as any;
    Object.keys(dirtyFields).forEach((fieldName) => {
      dirtyData[fieldName] = data[fieldName];
    });

    // Faça algo com os dados dirty
    console.log({ dirtyData });

    await handlePatchUser({
      ...dirtyData,
    });
    // setUser({ ...user, ...data.data });
  };

  /* useEffect(() => {
    if (data?.status === 200) {
      setUser(data.data);
      mutateUser();
    }
  }, [data]); */

  // useEffect(() => {
  //   if (data.status === 200) setUser({ ...user, ...data.data });
  // }, [data]);

  return (
    <Flex
      p={{ base: "1rem", md: "2rem" }}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
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
      <Wrap overflow="visible" w="full" justify="space-between">
        <Input
          id="id"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Identificador (id)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("id"),
          }}
          disabled
        />
        <Input
          id="from"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Indicação (from)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("from"),
          }}
        />

        <Input
          id="status"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Situação (status)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("status"),
          }}
        />
        <Input
          id="birthday"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Data de nascimento (birthday)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("birthday"),
          }}
        />
        <Input
          id="terms_accepted_at"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Aceitou termos dia (terms_accepted_at)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("terms_accepted_at"),
          }}
          disabled
        />
        <Input
          id="created_at"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Registrou dia (created_at)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("created_at"),
          }}
          disabled
        />
        <Input
          id="updated_at"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Atualizou a conta dia (updated_at)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("updated_at"),
          }}
          disabled
        />
        <Input
          id="slug"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="URL personalizada (slug)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("slug"),
          }}
        />
        <Input
          id="pagarme_id"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Identificador no PagarMe (pagarme_id)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("pagarme_id"),
          }}
          disabled
        />
        <Input
          id="country_code"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Código telefônico do país (country_code)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("country_code"),
          }}
        />
        <Input
          id="tax"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Taxa de serviço (tax)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("tax"),
          }}
        />
        <Input
          id="last_login"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Último login (last_login)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("last_login"),
          }}
          disabled
        />
        <Input
          id="profile_updated_at"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Atualizou o perfil dia (profile_updated_at)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("profile_updated_at"),
          }}
          disabled
        />
        <Input
          id="availableCredits"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Créditos disponíveis (availableCredits)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("availableCredits"),
          }}
          disabled
        />
        <Input
          id="usedCredits"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Créditos usados (usedCredits)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("usedCredits"),
          }}
          disabled
        />
        <Input
          id="appointmentsCount"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Total de agendamentos (appointmentsCount)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("appointmentsCount"),
          }}
          disabled
        />
        <Input
          id="lostCredits"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Créditos perdidos (lostCredits)"
          variant="outline"
          maxW={330}
          errors={errors}
          register={{
            ...register("lostCredits"),
          }}
          disabled
        />
        {/* <Input
          id="name"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Nome Completo"
          variant="outline"
          maxW={550}
          errors={errors}
          register={{
            ...register("name", { required: "Informe seu nome" }),
          }}
        /> */}
        <FormControl maxW={330} pt={2}>
          <FormLabel fontWeight={400} alignSelf="start" fontSize={14}>
            Idiomas
          </FormLabel>
          <Controller
            name="language"
            control={control}
            render={() => (
              <Select
                isMulti
                noOptionsMessage={() => "Não encontrado"}
                placeholder="Selecione"
                options={IDIOMAS_OBJ}
                /* onChange={(val: any) => {
                  setValue("bank", val?.value);
                  setValue("bank_name", val?.value?.split("-")[1].trim());
                  setValue("bank_code", val?.value?.split("-")[0].trim());
                }} */
                isClearable
                styles={{
                  control: (baseStyles: any, state: any) => ({
                    ...baseStyles,
                    borderRadius: 10,
                    borderColor: "#EEE",
                    width: 300,
                    fontSize: 14,
                  }),
                }}
                /* defaultValue={
                  firstBankAccount?.bank_code && {
                    value: `${firstBankAccount?.bank_code} - ${defaultBankFullName}`,
                    label: `${firstBankAccount?.bank_code} - ${defaultBankFullName}`,
                  }
                } */
              />
            )}
            // rules={{ required: "Banco" }}
          />
        </FormControl>
        <FormControl maxW={330} pt={2}>
          <FormLabel fontWeight={400} alignSelf="start" fontSize={14}>
            Colaborador de
          </FormLabel>
          <Controller
            name="from_id"
            control={control}
            render={() => (
              <Select
                noOptionsMessage={() => "Não encontrado"}
                placeholder="Selecione o enterprise"
                options={dataUsers.data.map((user: any) => ({
                  value: user.id,
                  label: `${user.name} - ${user.email}`,
                }))}
                onChange={(val: any) => {
                  setValue("from_id", val?.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                isClearable
                styles={{
                  control: (baseStyles: any, state: any) => ({
                    ...baseStyles,
                    borderRadius: 10,
                    borderColor: "#EEE",
                    width: 300,
                    fontSize: 14,
                    zIndex: 50,
                  }),
                }}
                defaultValue={() => {
                  const found = dataUsers?.data?.find(
                    (item: any) => item.id === user.from_id
                  );
                  if (!found) return;
                  return {
                    value: found?.from_id,
                    label: `${found.name} - ${found.email}`,
                  };
                }}
              />
            )}
            // rules={{ required: "Banco" }}
          />
        </FormControl>
      </Wrap>
      <SingleCheckboxInpa
        defaultChecked={user?.show_gender}
        register={{
          ...register("show_gender"),
        }}
        title="Exibir gênero"
      />
      <SingleCheckboxInpa
        defaultChecked={user?.show_age}
        register={{
          ...register("show_age"),
        }}
        title="Exibir idade"
      />
      <SingleCheckboxInpa
        defaultChecked={user?.newsletter_accepted}
        register={{
          ...register("newsletter_accepted"),
        }}
        title="Aceita receber comunicados"
      />
      {/* <SingleCheckboxInpa
        defaultChecked={user?.is_company}
        register={{
          ...register("is_company"),
        }}
        title="É empresa"
      /> */}
      {/* <FormControl w="fit-content" pt={2}>
        <FormLabel fontWeight={400} alignSelf="start" fontSize={14}>
          Permissões
        </FormLabel>
        <Controller
          name="bank"
          control={control}
          render={() => (
            <Select
              isDisabled
              isMulti
              noOptionsMessage={() => "Não encontrado"}
              placeholder="Selecione"
              options={PERMISSOES_OBJ}
              onChange={(val: any) => {
                setValue("bank", val?.value);
                setValue("bank_name", val?.value?.split("-")[1].trim());
                setValue("bank_code", val?.value?.split("-")[0].trim());
              }}
              isClearable
              styles={{
                control: (baseStyles: any, state: any) => ({
                  ...baseStyles,
                  borderRadius: 10,
                  borderColor: "#EEE",
                  width: 300,
                  fontSize: 14,
                }),
              }}
              defaultValue={
                firstBankAccount?.bank_code && {
                  value: `${firstBankAccount?.bank_code} - ${defaultBankFullName}`,
                  label: `${firstBankAccount?.bank_code} - ${defaultBankFullName}`,
                }
              }
            />
          )}
          rules={{ required: "Banco" }}
        />
      </FormControl> */}

      {/* {isDirty && (
        <Button
          ml="auto"
          title={"Restaurar alterações"}
          color="cinza"
          onClick={() =>
            reset(user, {
              keepDefaultValues: true,
            })
          }
        />
      )} */}
      <Button
        isLoading={isPatchingUser}
        ml="auto"
        title={"Salvar configurações"}
        type="submit"
      />
      <AlertInpaCall
        success={{
          validate: dataPatchUser.status === 200,
          text: "Usuário Atualizado",
        }}
        error={{
          validate: errorPatchUser,
          text: errorPatchUser?.response?.data?.message || "Erro",
        }}
      />

      {Object.keys(errors).map((err) => {
        return (
          <Alert mt={2} key={err} status="warning">
            <AlertIcon />
            {errors[err]?.message}
          </Alert>
        );
      })}
    </Flex>
  );
}
