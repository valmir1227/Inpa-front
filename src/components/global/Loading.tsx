import { Box, Center, Spinner } from "@chakra-ui/react";
import Rive from "@rive-app/react-canvas";

export const LoadingInpa = () => {
  return (
    <Center flexDir="column" alignItems="center" p={4} w="full">
      {/* <Spinner emptyColor="azul" color="amarelo" /> */}
      <Box w={50} h={50}>
        <Rive src="/inpa_loading.riv" />
      </Box>
    </Center>
  );
};
