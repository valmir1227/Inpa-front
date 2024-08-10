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

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor) as any,
  { ssr: false }
) as any;

export default function Teste() {
  const router = useRouter();

  const Prontuario = () => {
    const [notes, setNotes] = useState();

    return (
      <Flex h={200}>
        <Editor
          editorState={notes}
          onEditorStateChange={setNotes}
          // toolbarOnFocus
          localization={{
            locale: "pt",
          }}
        />
      </Flex>
    );
  };
  return (
    <Flex bg="white">
      <Prontuario />
    </Flex>
  );
}
