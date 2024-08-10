//export a component using react memo
import { Center } from "@chakra-ui/react";
import React from "react";
import VideoRoomComponent from "../components/openvidu/components/VideoRoomComponent";

export const MyComponent = React.memo(function MyComponent(props: any) {
  return (
    <Center pos="relative" h={500}>
      <VideoRoomComponent />
    </Center>
  );
});
