/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useEffect } from "react";
import { Flex, Text, VStack, useClipboard } from "@chakra-ui/react";
import { Button } from "components/global/Button";

import { CopyIcon } from "@chakra-ui/icons";
import { useFetch } from "hooks/useFetch";
import { AlertInpa } from "components/global/Alert";

import { useRouter } from "next/router";
import { FaUserPlus } from "react-icons/fa";
import queryString from "query-string";

export const InviteUsersJitsi = () => {
  const router = useRouter();
  const [dataJitsiToken, errorJitsiToken, isFetchingJitsiToken, getJitsiToken] =
    useFetch(
      `/v2/appointments/${router.query.id}/createSession?participants=true`
    );

  const VIDEO_URL = process.env.NEXT_PUBLIC_VIDEO_URL;
  // const openViduBaseUrl = "https://inpa.kanel.com.br/v/";

  //"wss://openvidu.inpa.online?sessionId=expert-fulano-nelio-alcantara-azevedo-appointmentId182&token=tok_AuZrH7CwJiwepMbs"

  const JitsiLink = (params: any) => {
    console.log(params);
    const publicUrlParams = queryString.stringify(params?.join, {
      skipNull: true,
      skipEmptyString: true,
    });
    console.log(publicUrlParams);
    if (params?.join) {
      const zoomUrl = process.env.NEXT_PUBLIC_ZOOM_VIDEO_URL || "";
      return zoomUrl + router.query.id + "/?" + publicUrlParams + "&public";
    }
    if (dataJitsiToken?.length > 0 && VIDEO_URL && router.query.id) {
      return VIDEO_URL + router.query.id + "/?t=" + params + "&public";
    } else {
      return "";
    }
  };

  //http://localhost:3000/v/283/?t=undefined&public

  const { onCopy, value, setValue, hasCopied } = useClipboard("");

  /* useEffect(() => {
    if (JitsiLink) {
      setValue(JitsiLink);
    }
  }, [dataJitsiToken]); */

  useEffect(() => {
    if (value) {
      onCopy();
    }
  }, [value]);

  // const JitsiLink = data?.openvidu_session_id
  //   ? dataOpenvidu || openViduBaseUrl + data?.openvidu_session_id
  //   : false;

  // if (!isFetchingJitsiToken && dataJitsiToken?.length < 1) return null;

  return (
    <VStack borderRadius={20} bg="white">
      <Button
        leftIcon={<FaUserPlus size={22} />}
        onClick={getJitsiToken}
        title={hasCopied ? "Copiado" : "Convidar participante"}
        isLoading={isFetchingJitsiToken}
      />
      {!isFetchingJitsiToken && dataJitsiToken?.length < 1 ? (
        <AlertInpa text="Nenhum participante adicionado nessa reunião, volte uma tela para adicionar" />
      ) : (
        dataJitsiToken?.map((token: any) => (
          <Flex gap={2} p={2} key={token.token}>
            <Text>{token?.name || token?.join.userName}</Text>
            <Button
              size="xs"
              leftIcon={<CopyIcon />}
              onClick={() => setValue(JitsiLink(token?.jitsiToken || token))}
              // onClick={onCopy}
              title="Copiar link de convite"
              isLoading={isFetchingJitsiToken}
              color="azul"
            />
          </Flex>
        ))
      )}
      {/* <AlertInpaCall
        error={{ validate: errorJitsiToken, text: "Erro ao gerar convites" }}
        success={{
          validate: dataJitsiToken[0]?.token,
          text: "Link gerado e copiado",
        }}
      />
      {dataJitsiToken && <Text p={2}>{JitsiLink}</Text>} */}
    </VStack>
  );
};
