import { CheckIcon, NotAllowedIcon } from "@chakra-ui/icons";
import {
  Heading,
  Avatar,
  Wrap,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  Text,
  Center,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  IconButton,
  Flex,
  Checkbox,
  FormLabel,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import { AlertInpaCall } from "components/global/Alert";
import { Button, ButtonLink } from "components/global/Button";
import { CheckboxInpa } from "components/global/Checkbox";
import { Modal } from "components/global/Modal";
import { Input } from "components/global/Select";
import { useMyContext } from "contexts/Context";
import { differenceInYears } from "date-fns";
import { isArray, isObject } from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsWhatsapp } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import {
  toBrDate,
  toBrDate0GMT,
  toBrFullDate,
  toBrFullDate0GMT,
} from "utils/toBrDate";
import { translateStatus } from "utils/translateStatus";
import { translateUser } from "../../utils/translateStatus";
import Link from "next/link";

export function ModalUserFullInfo({
  selectedUsers,

  isOpenUsersDetails,
  onCloseUsersDetails,

  handleApproveUsers,
  handleReproveUsers,

  handlePatchUsers,
  isPatchingUsers,
  errorPatchUsers,
  dataPatchUsers,
}: any) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [enterprise, setEnterprise] = useState([]);

  useEffect(() => {
    reset();
  }, [selectedUsers]);

  const onSubmit = async (data: any) => {
    handlePatchUsers({ ...data, enterprise: !!enterprise?.length });
  };

  if (!isOpenUsersDetails) return null;
  const fullPhone = `${selectedUsers.country_code} (${selectedUsers.area_code}) ${selectedUsers.phone}`;

  const Repeater = ({ title, value }: any) => {
    if (!value) return null;
    return (
      <Wrap w="full" spacing={0} borderWidth={1} borderRadius={6}>
        <Text bg="#eee" px={2}>
          {title}
        </Text>
        <Text fontWeight={500} bg="white" px={2}>
          {value}
        </Text>
      </Wrap>
    );
  };

  const Card = () => (
    <Wrap w="full" justify="center" align="center" spacing={4}>
      <VStack align="center" spacing={2}>
        <Avatar h={150} w={150} src={selectedUsers?.avatar} />
        {selectedUsers.permissions.expert && (
          <ButtonLink
            leftIcon={<FaUser />}
            size="sm"
            title="Perfil"
            href={`/psicologos/${selectedUsers.slug}`}
          />
        )}
        <Heading maxW={200} fontSize={20}>
          {selectedUsers.social_name
            ? selectedUsers.social_name
            : selectedUsers.name}
        </Heading>
      </VStack>

      <VStack spacing={0} align="start" justify="center" fontSize={14}>
        {selectedUsers.social_name && <Text>{selectedUsers.name}</Text>}
        <HStack>
          <Text>{`+${fullPhone}`}</Text>
          <a
            rel="noreferrer"
            target="_blank"
            href={"https://wa.me/" + fullPhone.replace(/[^0-9\.]+/g, "")}
          >
            <IconButton
              color="green"
              aria-label="Whatsapp"
              as={BsWhatsapp}
              size="xs"
            />
          </a>
        </HStack>
        <Text as="a" target="_blank" href={`mailto:${selectedUsers.email}`}>
          {selectedUsers.email}
        </Text>
        <Text>
          {`${selectedUsers.gender} ${differenceInYears(
            new Date(),
            new Date(selectedUsers.birthday)
          )}
          anos (${toBrDate0GMT(selectedUsers?.birthday)})`}
        </Text>

        <VStack pt={2} align="start">
          <Repeater title={"Estado Civil"} value={selectedUsers.civil_status} />
          <Repeater title={"Doc"} value={selectedUsers.doc} />
          <Repeater title={"Cor"} value={selectedUsers.ethnicity} />
          <Repeater
            title={"Status"}
            value={translateStatus(selectedUsers.status)}
          />
          <Repeater
            title={"Último login"}
            value={toBrDate0GMT(selectedUsers.last_login)}
          />
        </VStack>
      </VStack>
    </Wrap>
  );

  return (
    <Modal
      title="Detalhes do usuário"
      isOpen={isOpenUsersDetails}
      onClose={onCloseUsersDetails}
      size="xl"
      isCentered={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs colorScheme="teal" variant="enclosed">
          <TabList>
            <Tab>Detalhes</Tab>
            <Tab>Ficha completa</Tab>
            <Link href={`/admin/usuario/${selectedUsers.id}`} passHref>
              <Tab as="a">Editar Usuário</Tab>
            </Link>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Card />
            </TabPanel>
            <TabPanel>
              {Object.entries(selectedUsers).map(([key, value]) => {
                if (isArray(value)) {
                  if (key === "addresses") {
                    return (
                      <Accordion w="full" allowToggle>
                        <AccordionItem border={0}>
                          <AccordionButton p={2} w="fit-content">
                            <AccordionIcon />
                            <Box as="span" flex="1" textAlign="left">
                              Endereços
                            </Box>
                          </AccordionButton>
                          <AccordionPanel textAlign="start" pb={4}>
                            {value.map((item) => {
                              return Object.entries(item).map(
                                ([key, value]) => {
                                  const regex =
                                    /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/;
                                  if (!value) return null;
                                  const isDate =
                                    typeof value === "string" &&
                                    value.match(regex);
                                  if (isDate) {
                                    return (
                                      <Text pl={4} key={key}>
                                        {translateUser(key)}:{" "}
                                        {toBrFullDate0GMT(value)}
                                      </Text>
                                    );
                                  }
                                  return (
                                    <Text pl={4} key={key}>
                                      {translateUser(key)}: {value}
                                    </Text>
                                  );
                                }
                              );
                            })}
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    );
                  } else if (key === "languages") {
                    return <Text>Idiomas: {value.join(", ")}</Text>;
                  }
                }
                if (key === "permissions") {
                  if (!isObject(value)) return null;
                  return (
                    <Text>
                      Permissoes:{" "}
                      {Object.keys(value)
                        .map((status) => translateStatus(status))
                        .join(", ")}
                      {/* Permissoes:{" "}
                      {Object.entries(value).map(([key, value]) => {
                        if (!value) return null;
                        return key;
                      })} */}
                    </Text>
                  );
                }
                if (
                  typeof value !== "string" &&
                  typeof value !== "number" &&
                  typeof value !== "boolean"
                )
                  return;
                if (key === "about") return;
                if (typeof value === "boolean")
                  return (
                    <Text key={key}>
                      {translateUser(key)}: {value ? "Sim" : "Não"}
                    </Text>
                  );
                if (key === "avatar" && value)
                  return <Avatar h={200} w={200} src={String(value)} />;
                const regex =
                  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/;
                const isDate = typeof value === "string" && value.match(regex);
                if (isDate) {
                  return (
                    <Text key={key}>
                      {translateUser(key)}: {toBrFullDate0GMT(value)}
                    </Text>
                  );
                }
                return (
                  <Text key={key}>
                    {translateUser(key)}: {value}
                  </Text>
                );
              })}
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Wrap py={4} justify="center" align="center">
          {selectedUsers.permissions.expert && (
            <Center
              flexWrap="wrap"
              gap={10}
              w="full"
              bg="white"
              p={2}
              borderRadius={8}
            >
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
                labelColor="textosecundario"
                title="Taxa"
                disabled={selectedUsers.id === 999999}
                errors={errors}
                mask={"999.999.999-99"}
                maskChar={null}
                placeholder="%"
                defaultValue={selectedUsers?.tax}
                type="number"
                maxW={70}
              />
              <CheckboxInpa
                setState={setEnterprise}
                values={["Profissional Enterprise"]}
                defaultValues={
                  selectedUsers?.enterprise ? ["Profissional Enterprise"] : [""]
                }
              />

              <Button
                // w="full"
                title="Salvar"
                type="submit"
                isLoading={isPatchingUsers}
              />
            </Center>
          )}
          {selectedUsers.status === "Disabled" ? (
            <Button
              leftIcon={<CheckIcon />}
              title="Desbloquear usuário"
              size="sm"
              aria-label="Aprovar"
              color="whatsapp.300"
              onClick={handleApproveUsers}
            />
          ) : (
            <Button
              leftIcon={<NotAllowedIcon />}
              title="Bloquear usuário"
              size="sm"
              aria-label="Bloquear usuário"
              color="vermelho"
              onClick={handleReproveUsers}
            />
          )}
        </Wrap>
        <AlertInpaCall
          error={{ validate: errorPatchUsers, text: "Erro ao salvar" }}
          success={{
            validate: dataPatchUsers.status === 200,
            text: "Atualizado",
          }}
        />
        {Object.keys(errors).map((err) => (
          <Alert mt={2} key={err} status="warning">
            <AlertIcon />
            {errors[err]?.message}
          </Alert>
        ))}
      </form>
    </Modal>
  );
}
