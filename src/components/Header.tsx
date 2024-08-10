import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useColorMode,
  VStack,
  Avatar,
  Menu as ChakraMenu,
  MenuIcon,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  AlertIcon,
  Icon,
  Tooltip,
  Center,
  Stack,
  useToast,
  Alert,
  Tag,
} from "@chakra-ui/react";

import {
  FaHamburger,
  FaMoon,
  FaSun,
  FaThList,
  FaUser,
  FaUserAlt,
} from "react-icons/fa";
import {
  FiHelpCircle,
  FiLogIn,
  FiLogOut,
  FiMessageCircle,
  FiMoon,
  FiRefreshCcw,
  FiSun,
  FiUser,
} from "react-icons/fi";
import React, { useEffect } from "react";
import { LogoSvg } from "../icons";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Button, ButtonLink } from "./global/Button";
import { destroyCookie } from "nookies";
import Cookies from "universal-cookie";
import { useMyContext } from "contexts/Context";
import { useFetch } from "hooks/useFetch";
import { RiProfileFill } from "react-icons/ri";
import { MdSwapCalls, MdWarning } from "react-icons/md";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { BASE_URL } from "utils/CONFIG";
import { AlertInpa } from "./global/Alert";
import { useUsers } from "../stores/useUser";
import * as Sentry from "@sentry/nextjs";
import { userAgent } from "next/server";

export function Header({ type }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const disabled = router.query.online !== undefined;

  const { councils, user } = useUsers();

  Sentry.setUser({
    name: user?.name,
    email: user?.email,
    uid: user?.uid,
    image: user?.avatar,
    phone: `${user?.area_code} ${user?.phone}`,
  });

  const expertMissingPhoto = user?.permissions?.expert && !user?.avatar;

  const expertMissingCouncils =
    user?.permissions?.expert && councils.length === 0;

  // const userProfileNeedsToUpdate = user?.id && !user.profile_updated_at;
  const userProfileNeedsToUpdate = user?.id && user?.profile_updated === false;

  const BackButton = () => {
    const confirmRouterBack = () => {
      if (confirm("Deseja voltar? Você será desconectado da sessão."))
        router.push(`/${type}/sessoes/${router.query.id}`);
    };
    const confirmRefresh = () => {
      if (confirm("Deseja recarregar a página?")) router.reload();
    };

    if (!disabled) return null;
    return (
      <HStack p={2}>
        <Button title={<FiRefreshCcw />} onClick={confirmRefresh} />
        <Button title="Voltar" onClick={confirmRouterBack} />
      </HStack>
    );
  };

  return (
    <>
      <Flex
        direction="column"
        justify="center"
        align="center"
        w="100%"
        bg="white"
        as="header"
      >
        <BackButton />
        <Flex
          hidden={disabled}
          px="1rem"
          w="full"
          align="center"
          maxW={1200}
          justify="space-between"
        >
          <Link href="/" passHref>
            <a>
              <Image
                src="/logo-1-3.png"
                alt="Logo Inpa"
                width={130}
                height={70}
              />
            </a>
          </Link>
          <HStack
            color="cinzaescuro"
            display={{ base: "none", md: "flex" }}
            spacing={6}
          >
            <Menu type={type} />
          </HStack>
          <HStack
            color="cinzaescuro"
            display={{ base: "none", md: "flex" }}
            spacing={10}
          >
            <UserInfo type={type} />
          </HStack>
          <IconButton
            aria-label="Abrir menu de navegação"
            onClick={onOpen}
            display={{ base: "flex", md: "none" }}
            my={6}
            variant="ghost"
          >
            <HamburgerIcon boxSize={6} />
          </IconButton>
        </Flex>

        <Drawer
          autoFocus={false}
          returnFocusOnClose={false}
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton m={3} />

            <DrawerBody>
              <VStack mt={10}>
                <Menu type={type} />
                <UserInfo type={type} />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
      {(expertMissingCouncils || expertMissingPhoto) && (
        <Flex w="full" align="center" justify="center" bg="#f5f5f5">
          <Alert status="warning" justifyContent="center">
            <Flex align="center" direction={{ base: "column", md: "row" }}>
              <AlertIcon />
              <Text>Seu perfil está incompleto, informe os dados:</Text>
              {expertMissingCouncils && (
                <Tag m={2} bg="bg" color="cinzaescuro">
                  Identidade profissional
                </Tag>
              )}
              {expertMissingPhoto && (
                <Tag m={2} bg="bg" color="cinzaescuro">
                  Foto
                </Tag>
              )}
              <ButtonLink href="/psicologo/perfil" title="Gerenciar perfil" />
            </Flex>
          </Alert>
        </Flex>
      )}
      {userProfileNeedsToUpdate && (
        <Flex w="full" align="center" justify="center" bg="#f5f5f5">
          <Alert status="warning" justifyContent="center">
            <Flex
              gap={2}
              align="center"
              direction={{ base: "column", md: "row" }}
            >
              <AlertIcon />
              <Text>Seu perfil está desatualizado</Text>

              <ButtonLink
                href={`/${type}/minha-conta`}
                title="Atualizar dados"
              />
            </Flex>
          </Alert>
        </Flex>
      )}
    </>
  );
}

function Menu({ type }: any) {
  switch (type) {
    case "psicologo":
      return (
        <>
          <MenuLink title="Minhas sessões" href="/psicologo/sessoes" />
          <MenuLink title="Horários" href="/psicologo/horarios" />
          <MenuLink title="Perfil" href="/psicologo/perfil" />
          <MenuLink title="Carteira" href="/psicologo/carteira" />
        </>
      );
    case "paciente":
      return (
        <>
          <MenuLink title="Psicólogos" href="/psicologos" />
          <MenuLink title="Minhas sessões" href="/paciente/sessoes" />
          <MenuLink title="Carteira" href="/paciente/carteira" />
        </>
      );
    case "corporativo":
      return (
        <>
          <MenuLink title="Usuários" href="/corporativo/usuarios" />
          <MenuLink title="Carteira" href="/corporativo/carteira" />
          <MenuLink title="Relatórios" href="/corporativo/relatorios" />
        </>
      );
    case "admin":
      return (
        <>
          <MenuLink title="Especialidades" href="/admin/especialidades" />
          <MenuLink title="Saques" href="/admin/saques" />
          <MenuLink title="IDProf" href="/admin/id-prof" />
          <MenuLink title="Usuários" href="/admin/usuarios" />
          <MenuLink title="Sessões" href="/admin/sessoes" />
          <MenuLink title="Cupons" href="/admin/cupons" />
        </>
      );
    default:
      return (
        <>
          <MenuLink title="Login" href="/" />
          <MenuLink title="Psicólogos" href="/" />
          <MenuLink title="Criar conta" href="/cadastro" />
        </>
      );
  }
}

const MenuLink = ({ href, title }: any) => {
  const router = useRouter();
  const activeTab = router.pathname.includes(href);
  return (
    <Link href={href} passHref>
      <Heading
        fontSize={16}
        as="a"
        color={activeTab ? "azul" : "cinza"}
        _hover={{ color: "azul" }}
        py={{ base: 25, md: 38 }}
        px={4}
        position="relative"
        _before={{
          content: "' '",
          w: "full",
          h: "6px",
          bg: "azul",
          position: "absolute",
          left: 0,
          top: 0,
          borderBottomRadius: 20,
          display: activeTab ? "flex" : "none",
        }}
      >
        {title}
      </Heading>
    </Link>
  );
};

const UserInfo = ({ type }: any) => {
  const { setUserStore, setCouncils, councils, user: userStore } = useUsers();
  const { user, setUser } = useMyContext();
  const token = getCookie("inpatoken");
  const inpa = getCookie("inpa");
  const router = useRouter();
  const toast = useToast();

  const [dataGetMe, errorGetMe, isFetchingGetMe, getMe] =
    useFetch("/v1/users/me");

  const [dataCouncils, errorCouncils, isFetchingCouncils, getCouncils] =
    useFetch("/v1/councils");

  if (dataGetMe?.permissions && token)
    setCookie("inpa", JSON.stringify(dataGetMe?.permissions), {
      path: "/",
      secure: true,
    });

  useEffect(() => {
    if (!user?.name && token) {
      getMe().then(getCouncils());
    }
  }, []);

  useEffect(() => {
    if (dataGetMe?.name) {
      setUser(dataGetMe);
      setUserStore(dataGetMe);
    }
  }, [dataGetMe]);
  useEffect(() => {
    if (dataGetMe?.permissions?.expert) {
      setCouncils(dataCouncils);
    }
  }, [dataCouncils]);

  /* useEffect(() => {
  
  }, [dataGetMe]); */

  const logOut = () => {
    setUser();
    // cookies.remove("inpatoken", { path: "/" });
    deleteCookie("inpa", { path: "/" });
    deleteCookie("inpatoken", { path: "/" });
    window.open("/login", "_self");
  };

  useEffect(() => {
    if (errorGetMe?.response?.status === 401) logOut();
  }, [errorGetMe]);

  const [userName] = user?.name?.split(" ") || ["Visitante"];
  const userPhoto = user?.avatar || "/";

  return (
    <Popover>
      <PopoverTrigger>
        <HStack p={1} _hover={{ bg: "bg", cursor: "pointer" }} borderRadius={6}>
          {!isFetchingGetMe && (
            <Text
              fontWeight={500}
              color="cinzaescuro"
              sx={{ b: { color: "amarelo" } }}
              textAlign="end"
              pr={4}
            >
              Olá, <br />
              <b>{userName}</b>
            </Text>
          )}
          <Avatar
            icon={isFetchingGetMe ? <Spinner /> : <FiUser color="gray" />}
            name={user?.name}
            w="60px"
            h="60px"
            src={userPhoto}
            bg="#ddd"
          />

          <ChevronDownIcon boxSize={6} />
        </HStack>
      </PopoverTrigger>
      <PopoverContent px={4} w="fit-content">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          {user?.name ? (
            <VStack w="full" align="start" spacing={0}>
              {user.permissions?.expert && type !== "admin" && (
                <ButtonLink
                  size="xs"
                  color="white"
                  fontWeight={500}
                  textColor="cinza"
                  href={
                    type === "paciente" ? `/psicologo/sessoes` : `/psicologos`
                  }
                  variant="ghost"
                  leftIcon={<MdSwapCalls />}
                  title={
                    type === "paciente"
                      ? `Alterar para Profissional`
                      : `Alternar para Paciente`
                  }
                />
              )}
              {type !== "admin" && (
                <ButtonLink
                  color="white"
                  fontWeight={500}
                  textColor="cinza"
                  href={
                    type === "paciente"
                      ? `/paciente/minha-conta`
                      : type === "corporativo"
                      ? `/corporativo/minha-conta`
                      : `/psicologo/minha-conta`
                  }
                  variant="ghost"
                  leftIcon={<FiUser />}
                  title="Minha conta"
                />
              )}
            </VStack>
          ) : (
            <VStack w="full" align="start">
              <ButtonLink
                color="white"
                fontWeight={500}
                textColor="cinza"
                href="/login"
                variant="ghost"
                leftIcon={<FiLogIn />}
                title="Login"
              />
              <ButtonLink
                color="white"
                fontWeight={500}
                textColor="cinza"
                href="/cadastro"
                variant="ghost"
                leftIcon={<FiUser />}
                title="Criar conta"
              />
            </VStack>
          )}

          <VStack spacing={0}>
            <ButtonLink
              color="white"
              fontWeight={500}
              textColor="cinza"
              href="https://inpaonline.zendesk.com/"
              target="_blank"
              variant="ghost"
              leftIcon={<FiHelpCircle />}
              title="Tópicos de Ajuda"
            />
            <ButtonLink
              color="white"
              fontWeight={500}
              textColor="cinza"
              href="https://inpaonline.zendesk.com/hc/pt-br/requests/new/"
              target="_blank"
              variant="ghost"
              leftIcon={<FiMessageCircle />}
              title="Fale Conosco"
            />
            <Button
              color="white"
              fontWeight={500}
              textColor="cinza"
              variant="ghost"
              leftIcon={<FiLogOut />}
              title="Desconectar"
              onClick={logOut}
            />
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
