import { Badge, Box, Flex, HStack, Heading, Text } from "@chakra-ui/react";
import { Header } from "components/Header";
import Head from "next/head";
import React from "react";
import { Button } from "./Button";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import * as Sentry from "@sentry/react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    console.log(error);
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // Sentry.showReportDialog();
      // You can render any custom fallback UI

      return (
        <>
          {/* <Header /> */}
          <Box w="full" align="center">
            <Flex
              p="5rem 1rem"
              align="center"
              maxW={1200}
              w="full"
              justify="space-between"
              flexDir="column"
              gap={2}
            >
              <Heading>Erro !</Heading>
              <Text>
                Desculpe o ocorrido, nossos programadores foram notificados
                sobre este problema.
              </Text>

              <Player
                autoplay
                loop
                src="/errorAnimation.json"
                style={{ height: "500px" }}
              />
              <Button title="Voltar" as="a" href="/" />
              <Button
                title="Tentar novamente"
                onClick={() => this.setState({ hasError: false })}
              />
            </Flex>
          </Box>
        </>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
