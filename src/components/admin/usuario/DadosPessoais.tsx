import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Wrap,
  VStack,
  FormLabel,
  Text,
  Select,
  Alert,
  AlertIcon,
  Select as ChakraSelect,
  Card,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { Input } from "../../global/Select";
import { CheckboxInpa } from "../../global/Checkbox";
import { useMyContext } from "contexts/Context";
import { useForm } from "react-hook-form";
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

export function DadosPessoais({
  handlePatchUser,
  dataPatchUser,
  errorPatchUser,
  isPatchingUser,
  error,
  isLoading,
  user,
}: any) {
  const [userr, setUser] = useState({} as any);

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
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      socialName: user?.social_name,
      doc: user?.doc,
      email: user?.email,
      phone: `(${user?.area_code}) ${user?.phone}`,
      phone2: user?.phone2,
      gender: user?.gender,
      birthday: toBrDate0GMT(user?.birthday),
      ethnicity: user?.ethnicity,
      civilStatus: user?.civil_status,
      schoolLevel: user?.school_level,
      IE: user?.ie,
      companyName: user?.company_name,
      companyCNPJ: user?.company_cnpj || "", //string vazia necessaria para evitar erro do inputmask,
      companyAddress: user?.company_address,
      companyAddressNumber: user?.company_address_number,
      companyEmail: user?.company_email,
      companyIE: user?.company_ie,
      companyNeighborhood: user?.company_neighborhood,
      companyState: user?.company_state,
      companyZIP: user?.company_zip || "", //string vazia necessaria para evitar erro do inputmask,
      companyCity: user?.company_city,
      companyComplement: user?.company_complement,
      companyPhone: `(${user?.company_area_code}) ${user?.company_phone}`,
      isCompany: pj,
    } as any,
  });

  const onSubmit = async (data: any) => {
    const [area_code, phone] = data.phone?.split(")");
    const [companyAreaCode, companyPhone] = data?.companyPhone?.split(")");

    const clearNulled = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== null)
    ) as any;

    await handlePatchUser({
      ...clearNulled,
      areaCode: area_code.replace("(", ""),
      phone: phone?.replace("-", ""),
      companyAreaCode,
      companyPhone,
      isCompany: pj,
    });
    // setUser({ ...user, ...data.data });
  };

  // const { mutate: mutateUser } = useFetchUser();

  // useEffect(() => {
  //   if (data?.status === 200) {
  //     // setUser(data.data);
  //     // mutateUser();
  //   }
  // }, [data]);

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
          id="name"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Nome Completo"
          variant="outline"
          maxW={550}
          errors={errors}
          register={{
            ...register("name", { required: "Informe um nome" }),
          }}
        />
        <Input
          id="social_name"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Nome a ser exibido na plataforma"
          variant="outline"
          maxW={550}
          errors={errors}
          register={{
            ...register("socialName"),
          }}
        />
        <Input
          id="doc"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="CPF"
          as={InputMask}
          mask="999.999.999-99"
          maskChar={null}
          variant="outline"
          maxW={250}
          errors={errors}
          register={{
            ...register("doc", {
              required: "Informe um CPF",
              minLength: { value: 11, message: "CPF inválido" },
              setValueAs: (v) => {
                return v.match(/\d/g)?.join("");
              },
            }),
          }}
          defaultValue={user?.doc}
        />
        {/* <Input
            id="doc"
            borderRadius={14}
            labelColor="cinzaescuro"
            title={pessoaJuridica.length ? "CNPJ" : "CPF"}
            as={InputMask}
            mask={
              pessoaJuridica.length ? "99.999.999/9999-99" : "999.999.999-99"
            }
            maskChar={null}
            variant="outline"
            maxW={250}
            errors={errors}
            register={{
              ...register("doc", {
                required: "Informe um CPF",
                setValueAs: (v) => {
                  return v.replace(/[^0-9\.]+/g, "");
                },
              }),
            }}
            defaultValue={user?.doc}
          /> */}
        <Input
          id="email"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Email"
          variant="outline"
          maxW={250}
          errors={errors}
          register={{
            ...register("email", { required: "Informe um e-mail" }),
          }}
        />
        <Input
          as={InputMask}
          mask={"(99) 99999-9999"}
          maskChar={null}
          id="phone"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Celular"
          variant="outline"
          maxW={250}
          errors={errors}
          register={{
            ...register("phone", {
              required: "Informe um número de celular",
              minLength: { value: 9, message: "Celular inválido" },
              setValueAs: (v) => {
                return v.replace(/\s+/g, "");
              },
            }),
          }}
          defaultValue={`(${user?.area_code}) ${user?.phone}`}
        />
        <Input
          id="phone2"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Telefone"
          variant="outline"
          maxW={250}
          errors={errors}
          register={{
            ...register("phone2"),
          }}
        />
        <VStack maxW={250} w="full" pt={2}>
          <Text fontSize={14} alignSelf="start">
            Gênero
          </Text>
          <Select
            {...register("gender", {
              required: "Selecione seu gênero",
            })}
            id="gender"
            borderRadius={14}
            maxW={250}
            borderColor="cinzaclaro"
            placeholder={"Selecione uma opção"}
            // defaultValue={user?.gender}
            isInvalid={!!errors.gender}
          >
            {GENEROS.map((item: any) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </VStack>
        <Input
          id="birthday"
          as={InputMask}
          mask={user?.birthday && "99/99/9999"}
          register={{
            ...register("birthday", {
              setValueAs: (v) => {
                const ymd = v?.split("/");
                return `${ymd[2]}-${ymd[1]}-${ymd[0]}`;
              },
              required: "Informe uma data de nascimento",
              minLength: {
                value: 10,
                message: "Data inválida, digite no formato dd/mm/aaaa",
              },
            }),
          }}
          errors={errors}
          // as={DatePicker}
          // selected={dataDeNascimento}
          // onChange={(date: any) => setDataDeNascimento(date)}
          // locale={ptBR}
          // dateFormat="dd/MM/yyyy"
          maskChar={null}
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Data de nascimento"
          variant="outline"
          maxW={250}
          defaultValue={toBrDate0GMT(user?.birthday)}
        />
        <Input
          id="ethnicity"
          errors={errors}
          register={{
            ...register("ethnicity"),
          }}
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Raça/cor"
          variant="outline"
          maxW={250}
        />
        <Input
          id="civil_status"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Estado civil"
          variant="outline"
          maxW={250}
          errors={errors}
          register={{
            ...register("civilStatus"),
          }}
        />
        {/*   <Input
            id="school_level"
            borderRadius={14}
            labelColor="cinzaescuro"
            title="Especialização"
            variant="outline"
            maxW={250}
            errors={errors}
            register={{
              ...register("school_level"),
            }}
            // defaultValue={user?.school_level}
          /> */}
      </Wrap>
      <CheckboxInpa
        setState={setPessoaJuridica}
        values={["Pessoa Jurídica ?"]}
        // checked={!!user?.ie}
        defaultValues={[user?.is_company ? "Pessoa Jurídica ?" : ""]}
      />
      <Wrap display={pj ? "inline" : "none"} w="full" justify="space-between">
        {/*   <Input
            id="doc"
            borderRadius={14}
            labelColor="cinzaescuro"
            title={"CNPJ"}
            as={InputMask}
            mask={"99.999.999/9999-99"}
            maskChar={null}
            variant="outline"
            maxW={250}
            errors={errors}
            register={{
              ...register("doc", {
                setValueAs: (v) => {
                  return v.replace(/[^0-9\.]+/g, "");
                },
              }),
            }}
          /> */}
        <Input
          id="company_name"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Razão Social"
          variant="outline"
          maxW={350}
          errors={errors}
          register={{
            ...register("companyName"),
          }}
        />
        <Input
          id="companyCNPJ"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="CNPJ"
          as={InputMask}
          mask="99.999.999/9999-99"
          maskChar={null}
          variant="outline"
          maxW={350}
          errors={errors}
          register={{
            ...register("companyCNPJ", {
              required: pj && "Informe um CNPJ",
              setValueAs: (v) => {
                return v?.match(/\d/g)?.join("");
              },
            }),
          }}
          defaultValue={user?.company_cnpj}
        />

        <Input
          id="company_IE"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Inscrição Estadual"
          variant="outline"
          maxW={350}
          errors={errors}
          register={{
            ...register("companyIE"),
          }}
        />
        <Input
          id="companyZIP"
          errors={errors}
          register={{
            ...register("companyZIP"),
          }}
          as={ReactInputMask}
          mask="99.999-999"
          maskChar="_"
          borderRadius={14}
          labelColor="cinzaescuro"
          maxW={200}
          borderColor="cinzaclaro"
          borderWidth={1}
          bg="white"
          title="CEP"
          defaultValue={user?.company_zip}
        />
        <Input
          id="companyAddress"
          errors={errors}
          register={{
            ...register("companyAddress"),
          }}
          borderRadius={14}
          labelColor="cinzaescuro"
          borderColor="cinzaclaro"
          maxW={900}
          borderWidth={1}
          bg="white"
          title="Endereço"
        />
        <Input
          id="companyAddressNumber"
          errors={errors}
          register={{
            ...register("companyAddressNumber"),
          }}
          borderRadius={14}
          labelColor="cinzaescuro"
          borderColor="cinzaclaro"
          borderWidth={1}
          maxW="210"
          bg="white"
          title="Número"
        />

        <Input
          id="companyComplement"
          errors={errors}
          register={{
            ...register("companyComplement"),
          }}
          borderRadius={14}
          labelColor="cinzaescuro"
          maxW={210}
          borderColor="cinzaclaro"
          borderWidth={1}
          bg="white"
          title="Complemento"
        />

        <Input
          id="companyNeighborhood"
          errors={errors}
          register={{
            ...register("companyNeighborhood"),
          }}
          borderRadius={14}
          labelColor="cinzaescuro"
          maxW={210}
          borderColor="cinzaclaro"
          borderWidth={1}
          bg="white"
          title="Bairro"
        />
        <Input
          id="companyCity"
          errors={errors}
          register={{
            ...register("companyCity"),
          }}
          borderRadius={14}
          labelColor="cinzaescuro"
          maxW={210}
          borderColor="cinzaclaro"
          borderWidth={1}
          bg="white"
          title="Cidade"
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
            id="companyState"
            isInvalid={!!errors.companyState}
            {...register("companyState")}
            borderRadius={14}
            placeholder="UF"
            color="cinza"
            variant="filled"
            _focus={{ bg: "white" }}
            fontSize={14}
            borderWidth={1}
            borderColor="cinzaclaro"
            bg="white"
          >
            {ESTADOS_SIGLA.map((item: any) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </ChakraSelect>
        </VStack>
        <Input
          id="companyEmail"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Email PJ"
          variant="outline"
          maxW={250}
          errors={errors}
          register={{
            ...register("companyEmail"),
          }}
        />
        <Input
          id="companyPhone"
          borderRadius={14}
          labelColor="cinzaescuro"
          title="Telefone PJ"
          as={InputMask}
          mask="(99) 99999-9999"
          maskChar={null}
          variant="outline"
          maxW={250}
          errors={errors}
          register={{
            ...register("companyPhone", {
              setValueAs: (v) => {
                return v.replace(/\s+/g, "").replace("(", "").replace("-", "");
              },
            }),
          }}
          defaultValue={`(${user?.company_area_code}) ${user?.company_phone}`}
        />
      </Wrap>

      <Button
        isLoading={isPatchingUser || isLoading}
        ml="auto"
        title={"Salvar dados pessoais"}
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
      {error && (
        <Alert w="fit-content" ml="auto" mt={2} status="warning">
          <AlertIcon />
          {error?.response.data.message || "Erro"}
        </Alert>
      )}
      {/* {data?.status == 200 && (
        <Alert w="fit-content" ml="auto" mt={2} status="success">
          <AlertIcon />
          Dados pessoais atualizados
        </Alert>
      )} */}
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
