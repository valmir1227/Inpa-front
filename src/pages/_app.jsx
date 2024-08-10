import "../styles/globals.css";
import { theme } from "../styles/theme";
import { ContextProvider } from "../contexts/Context";
import "react-datepicker/dist/react-datepicker.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../components/openvidu/components/chat/ChatComponent.css";
import { ChakraProvider, Text } from "@chakra-ui/react";
import { AppProps } from "next/app";
import useSWR, { SWRConfig } from "swr";
import 'react-quill/dist/quill.snow.css'
import "react-phone-number-input/style.css";
import "../components/openvidu/components/dialog-extension/DialogExtension.css";
import "../components/openvidu/components/toolbar/ToolbarComponent.css";
import "../components/openvidu/components/stream/StreamComponent.css";
import "../components/openvidu/index.css";
import "../components/openvidu/components/VideoRoomComponent.css";
import { api } from "utils/api";
import ErrorBoundary from "../components/global/ErrorBoundary";
import * as Sentry from "@sentry/react";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ContextProvider>
        <SWRConfig>
          <Sentry.ErrorBoundary fallback={ErrorBoundary}>
            <Component {...pageProps} />
          </Sentry.ErrorBoundary>
        </SWRConfig>
        <Text color="cinza" fontSize={10} textAlign="center">
          v0.21B
        </Text>
      </ContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;