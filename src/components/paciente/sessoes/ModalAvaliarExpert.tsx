import {
  Modal as ModalChakra,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Modal,
  Box,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import { Header } from "components/Header";
import { AlertInpa } from "components/global/Alert";
import { usePost } from "hooks/usePost";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineFrown, AiOutlineMeh, AiOutlineSmile } from "react-icons/ai";
import { FaRegGrinStars, FaRegSadTear } from "react-icons/fa";
import useSWR from "swr";
import { fetcher } from "utils/api";

function ModalAvaliarExpert({ isOpen, onClose }: any) {
  const router = useRouter();
  const [rate, setRate] = useState(null);
  const [rateComment, setRateComment] = useState("");
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const { data } = useSWR(
    router.query.id ? `v1/appointments/${router.query.id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const appointmentId = data?.id;

  const handleRating = (value: any) => {
    setRate(value);
  };

  const handleFeedbackChange = (event: any) => {
    setRateComment(event.target.value);
  };

  const [handlePost, postData, postError, isFetching] = usePost(
    `/v1/appointments/${appointmentId}/rate`,
    () => {
      setErrorAlert(null);
      router.push("/paciente/sessoes");
      onClose();
    }
  );

  const handleSubmit = () => {
    const postData = {
      rate,
      rateComment,
    };

    handlePost(postData);

    if (postError) {
      setErrorAlert("Erro ao enviar avaliação.");
    }
  };

  return (
    <>
      <Header type="paciente" />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="100%" mx={4} maxW="600px" bg={"bg"} p={4}>
          <ModalHeader fontSize={18} color={"amarelo"}>
            Deixe sua avaliação
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {errorAlert && (
              <AlertInpa text={errorAlert} status="warning" mb={4} />
            )}
            <Text mb={4} fontSize="medium" color={"cinzaescuro"}>
              Deixe sua avaliação sobre esta sessão.
            </Text>
            <Box mb={4}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={4}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <Box
                    key={value}
                    as="button"
                    onClick={() => handleRating(value)}
                    p={2}
                    border="1px solid #DCDCDC"
                    m={1}
                    textAlign="center"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    w="100px"
                    _hover={{ boxShadow: "outline" }}
                    borderRadius={4}
                    bg={rate === value ? "gray.200" : "white"}
                  >
                    {value === 1 && <FaRegSadTear size={32} color={"cinza"} />}
                    {value === 2 && (
                      <AiOutlineFrown size={34} color={"cinza"} />
                    )}
                    {value === 3 && <AiOutlineMeh size={34} color={"cinza"} />}
                    {value === 4 && (
                      <AiOutlineSmile size={34} color={"cinza"} />
                    )}
                    {value === 5 && (
                      <FaRegGrinStars size={32} color={"cinza"} />
                    )}
                    <Text mt={1} fontSize="x-small">
                      {value === 1 && "Péssimo"}
                      {value === 2 && "Ruim"}
                      {value === 3 && "Neutro"}
                      {value === 4 && "Bom"}
                      {value === 5 && "Excelente"}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>

            <Text mb={4} fontSize="medium" color={"cinzaescuro"}>
              Qual foi o motivo da sua avaliação?
            </Text>
            <Textarea
              placeholder="Digite sua avaliação aqui..."
              value={rateComment}
              onChange={handleFeedbackChange}
              size="sm"
              minHeight="150px"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              bg={"amarelo"}
              _hover={{ bg: darken("amarelo", 5) }}
              color={"bg"}
              onClick={handleSubmit}
              isLoading={isFetching}
            >
              Enviar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalAvaliarExpert;
