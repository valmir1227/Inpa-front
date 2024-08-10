import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  VStack,
  HStack,
  Center,
  Button,
  Wrap,
  Checkbox,
  InputGroup,
  InputRightElement,
  Select,
  Tooltip,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  InputLeftElement,
  Spinner,
  useBoolean,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import Image from "next/image";
import { BsCalendar } from "react-icons/bs";
import Link from "next/link";
import { Input } from "./global/Input";
import DatePicker from "react-datepicker";
import InputMask from "react-input-mask";
import ptBR from "date-fns/locale/pt-BR";
import { GENEROS } from "../utils/GENEROS";
import { useForm } from "react-hook-form";
import { usePost } from "../hooks/usePost";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { ButtonLink } from "./global/Button";
import { useMyContext } from "contexts/Context";
import PhoneInput, {
  formatPhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import { TermosDeUso } from "./TermosDeUso";
import { TermosDeUsoIframe } from "./TermosDeUsoIframe";
import {
  RiCheckboxBlankFill,
  RiCheckboxBlankLine,
  RiCheckboxFill,
  RiCheckboxLine,
} from "react-icons/ri";
import { darken } from "@chakra-ui/theme-tools";
import { AlertInpa, AlertInpaCall } from "./global/Alert";
import useSWR from "swr";
import { fetcher } from "utils/api";
import { CheckIcon, WarningIcon } from "@chakra-ui/icons";
import { MdWarning } from "react-icons/md";

export function Cadastro() {
  const { user } = useMyContext();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [handlePost, data, error, creatingAccount] =
    usePost("/v1/users/create");

  const onSubmit = async (data: any) => {
    const [country_code, area_code, phone, phoneLastDigits] =
      data.phone?.split(" ");
    delete data.password2;
    // console.log("submit", {
    handlePost({
      ...data,
      expert: !patient,
      countryCode: country_code.replace("+", ""),
      areaCode: area_code,
      phone: phone + phoneLastDigits,
    });
  };

  useEffect(() => {
    if (data.status === 200) reset();
  }, [data]);

  const [patient, setPatient] = useState(null);
  const loginType = patient ? "paciente" : "psicologo";
  const handlePatient = (type: any) => setPatient(type);

  const [termos, setTermos] = useState<any>(null);
  const handleTermos = () => setTermos(!termos);
  // const [value, setValue] = useState("");

  const checkPass = () => {
    if (getValues("password2")?.length < 6) {
      setError("password2", {
        type: "custom",
        message: "A senha deve ter no mínimo 6 caracteres",
      });
      return false;
    } else if (getValues("password") !== getValues("password2")) {
      setError("password2", {
        type: "custom",
        message: "Senhas não conferem",
      });
      return false;
    } else {
      clearErrors("password2");
      return true;
    }
  };

  const validateDoc = watch("doc")?.length === 14;
  const cpf = watch("doc");

  const {
    data: dataCpf,
    error: errorCpf,
    isLoading: isLoadingCpf,
    isValidating: isValidatingCpf,
    mutate: mutateCpf,
  } = useSWR(
    validateDoc ? "/v1/users/checkifexist?doc=" + cpf.replace(/\D/g, "") : null,
    fetcher
  );

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
        <Link href="/" passHref>
          <a>
            <Image src="/logo.png" alt="Logo Inpa" width={220} height={120} />
          </a>
        </Link>
        <Link href="/login" passHref>
          <Heading
            as="a"
            mt={8}
            fontSize={20}
            color="cinzaescuro"
            sx={{ b: { color: "amarelo" } }}
            textAlign="center"
          >
            Já possui uma conta? <b> Entrar</b>
          </Heading>
        </Link>

        <Button
          fontWeight={500}
          mt={6}
          variant="outline"
          borderColor={!patient ? "amarelo" : "azul"}
          bg={!patient ? "white" : "azul"}
          color={!patient ? "cinza" : "white"}
          onClick={() => handlePatient(true)}
          colorScheme="none"
          leftIcon={!patient ? <RiCheckboxBlankLine /> : <RiCheckboxFill />}
        >
          Sou paciente
        </Button>
        <Button
          fontWeight={500}
          mt={6}
          variant="outline"
          borderColor={patient !== false ? "amarelo" : "azul"}
          bg={patient !== false ? "white" : "azul"}
          color={patient !== false ? "cinza" : "white"}
          onClick={() => handlePatient(false)}
          colorScheme="none"
          leftIcon={
            patient !== false ? <RiCheckboxBlankLine /> : <RiCheckboxFill />
          }
        >
          Sou profissional
        </Button>
        {patient !== null && (
          <>
            <Text
              maxW={920}
              textAlign="center"
              pt={5}
              fontSize={12}
              sx={{ b: { color: patient ? "amarelo" : "azul" } }}
              color="cinzaescuro"
              dangerouslySetInnerHTML={{
                __html: patient
                  ? "<b>Opção selecionada:</b>  Agora, você esta criando uma conta como <b>paciente</b> para ser atendido por meio da nossa plataforma."
                  : "<b>Opção selecionada:</b>  Agora, você esta criando uma conta como <b>profissional</b>  para atender seus pacientes por meio da nossa plataforma.",
              }}
            />

            <Wrap
              justify="space-between"
              align="center"
              my={8}
              w="full"
              maxW={920}
              spacing={8}
            >
              <Input
                id="name"
                register={{
                  ...register("name", { required: "Informe seu nome" }),
                }}
                errors={errors}
                maxW={440}
                placeholder="Nome completo"
              />
              <Input
                id="social_name"
                register={{ ...register("socialName") }}
                errors={errors}
                maxW={440}
                placeholder="Nome a ser exibido na plataforma"
              />
              {/* <Input
            as={InputMask}
            mask={"(99) 99999-9999"}
            maskChar={null}
            id="phone"
            register={{
              ...register("phone", {
                required: "Informe seu número de celular",
                setValueAs: (v) => {
                  return v.replace(/\s+/g, "");
                },
              }),
            }}
            errors={errors}
            maxW={440}
            placeholder="Celular"
          /> */}
              <Input
                as={PhoneInput}
                defaultCountry="BR"
                countryCallingCodeEditable={false}
                id="phone"
                register={{
                  ...register("phone", {
                    validate: (value) => {
                      return isValidPhoneNumber(value) || "Telefone inválido";
                    },
                    /* setValueAs: (v) => {
                  return v.replace(/\s+/g, "");
                }, */
                  }),
                }}
                errors={errors}
                maxW={410}
                placeholder="Celular"
                international
                // value={watch("phone")}
                onChange={(value: any) => setValue("phone", value)}
              />

              <Input
                id="email"
                register={{
                  ...register("email", { required: "Informe seu e-mail" }),
                }}
                errors={errors}
                maxW={440}
                placeholder="Email"
                type="email"
              />
              <Wrap w="full" maxW={440} spacing={0}>
                <Input
                  id="doc"
                  register={{
                    ...register("doc", { required: "Informe seu CPF" }),
                  }}
                  errors={errors}
                  as={InputMask}
                  mask={"999.999.999-99"}
                  maskChar={null}
                  maxW={440}
                  placeholder="CPF"
                  // onChange={onDocChange}
                  icon={
                    isValidatingCpf || isLoadingCpf ? (
                      <Spinner color="azul" />
                    ) : errorCpf ? (
                      <Icon as={MdWarning} color="amarelo" />
                    ) : (
                      dataCpf && <CheckIcon color="azul" />
                    )
                  }
                />
                <AlertInpaCall
                  maxW={440}
                  variant="warning"
                  error={{
                    validate: errorCpf,
                    text: errorCpf?.response?.data?.messages?.["pt-BR"],
                  }}
                />
              </Wrap>
              <Input
                as={InputMask}
                mask="99/99/9999"
                maskChar={null}
                id="birthday"
                register={{
                  ...register("birthday", {
                    setValueAs: (v) => {
                      if (!v) return false;
                      const ymd = v?.split("/");
                      const formatted = `${ymd[2]}-${ymd[1]}-${ymd[0]}`;
                      return formatted || "";
                    },
                    required: "Informe sua data de nascimento",
                    minLength: {
                      value: 10,
                      message: "Data inválida, digite no formato dd/mm/aaaa",
                    },
                  }),
                }}
                errors={errors}
                placeholder="Data de nascimento"
                // as={DatePicker}
                // selected={dataDeNascimento}
                // onChange={(date: any) => setDataDeNascimento(date)}
                // locale={ptBR}
                // dateFormat="dd/MM/yyyy"
                icon={<BsCalendar color="#777" />}
                maxW={440}
              />
              <Input
                id="password"
                register={{
                  ...register("password", {
                    minLength: {
                      value: 6,
                      message: "A senha deve ter no mínimo 6 caracteres",
                    },
                  }),
                }}
                errors={errors}
                password
                maxW={440}
                placeholder="Senha"
              />
              <Input
                id="password2"
                register={{
                  ...register("password2", {
                    validate: (value: any) =>
                      checkPass() || "Senhas não conferem",
                  }),
                }}
                errors={errors}
                password
                // onBlur={checkPass}
                maxW={440}
                placeholder="Confirme sua senha"
              />

              <VStack maxW={440} w="full" pt={2}>
                <Text alignSelf="start">Gênero</Text>
                <Select
                  borderRadius={14}
                  borderColor="cinzaescuro"
                  placeholder="Selecione uma opção"
                  {...register("gender", { required: "Selecione seu gênero" })}
                  isInvalid={!!errors.gender}
                >
                  {GENEROS.map((item: any) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </VStack>

              <VStack maxW={440} w="full" pt={2}>
                <Text alignSelf="start">Onde nos encontrou?</Text>
                <Select
                  borderRadius={14}
                  borderColor="cinzaescuro"
                  placeholder="Selecione uma opção"
                  {...register("from")}
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Google">Google</option>
                  <option value="Amigos">Amigos</option>
                  <option value="Outro">Outro</option>
                </Select>
              </VStack>
            </Wrap>
            <Box
              border="1px solid #ddd"
              my={4}
              fontSize={12}
              color="cinza"
              maxW={900}
              h={350}
              flex={1}
              sx={{ iframe: { w: [350, 500, 900], h: 300 } }}
            >
              <TermosDeUsoIframe patient={patient} />
            </Box>
            <Flex align="center" flexDir="column">
              <HStack alignSelf="start">
                <Checkbox
                  colorScheme="yellow"
                  _checked={{
                    span: { borderColor: "azul", backgroundColor: "azul" },
                  }}
                  onChange={handleTermos}
                >
                  <Text bg="white" fontSize={14} color="cinza">
                    Sim, declaro que li e concordo com os{" "}
                    <b>Termos de Serviços</b>, incluindo a{" "}
                    <b>Política de Privacidade</b>.
                  </Text>
                </Checkbox>
              </HStack>
              <HStack mt={4} alignSelf="start">
                <Checkbox
                  {...register("newsletterAccepted")}
                  colorScheme="yellow"
                  _checked={{
                    span: { borderColor: "azul", backgroundColor: "azul" },
                  }}
                >
                  <Text bg="white" fontSize={14} color="cinza">
                    Desejo receber novidades no meu e-mail e/ou celular
                  </Text>
                </Checkbox>
              </HStack>

              {data.status === 200 && (
                <Alert
                  flexDir="column"
                  gap={4}
                  justifyContent="space-between"
                  mt={4}
                  status="success"
                  p={6}
                >
                  <AlertIcon color="azul" boxSize={10} />
                  Conta criada com sucesso
                  <ButtonLink
                    color="azul"
                    href="/login"
                    size="sm"
                    ml="auto"
                    title="Entrar"
                  />
                </Alert>
              )}

              <Tooltip
                shouldWrapChildren
                hasArrow
                label="Aceite os termos"
                bg="red.600"
                isDisabled={termos}
              >
                <Button
                  type="submit"
                  disabled={!termos}
                  bg="azul"
                  _hover={{
                    bg: darken("azul", 2),
                  }}
                  fontWeight={400}
                  borderRadius="full"
                  // bg="amarelo"
                  w="fit-content"
                  color="white"
                  py={5}
                  px={10}
                  mt={10}
                  isLoading={creatingAccount}
                >
                  Cadastrar como {patient ? "paciente" : "profissional"}
                </Button>
              </Tooltip>

              {error && (
                <Alert mt={2} status="warning">
                  <AlertIcon />
                  {error.response.data?.message || "Erro"}
                </Alert>
              )}

              {Object.keys(errors).map((err) => (
                <Alert mt={2} key={err} status="warning">
                  <AlertIcon />
                  {errors[err]?.message}
                </Alert>
              ))}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}
