import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  Badge,
} from "@chakra-ui/react";
import Head from "next/head";
import { Header } from "../components/Header";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState } from "react";

// import AgoraUIKit from "agora-react-uikit";

const AgoraUIKit = dynamic(() => import("agora-react-uikit") as any, {
  ssr: false,
}) as any;

const Agora = () => {
  const [videoCall, setVideoCall] = useState(true);
  const rtcProps = {
    appId: "bcdb62b1c62e44449d5d81fa411cb801",
    channel: "test", // your agora channel
    token: null, // use null or skip if using app in testing mode
  };
  const callbacks = {
    EndCall: () => setVideoCall(false),
  };
  return videoCall ? (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
    </div>
  ) : (
    <h3 onClick={() => setVideoCall(true)}>Start Call</h3>
  );
};

export default function Teste() {
  const router = useRouter();

  return (
    <Flex bg="white">
      <Agora />
    </Flex>
  );
}
