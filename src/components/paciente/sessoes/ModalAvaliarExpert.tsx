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
import { FaStar } from "react-icons/fa";
import useSWR from "swr";
import { fetcher } from "utils/api";

interface ModalAvaliarExpertProps {
  isOpen: boolean;
  onClose: () => void;
}

function ModalAvaliarExpert({ isOpen, onClose }: ModalAvaliarExpertProps) {
  const router = useRouter();
  const [rate, setRate] = useState<number | null>(null);
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

  const [handlePost, postError, isFetching] = usePost(
    `/v1/appointments/${appointmentId}/rate`,
    () => {
      setErrorAlert(null);
      localStorage.setItem(`avaliacao_${appointmentId}`, "true");
      router.push("/paciente/sessoes");
      onClose();
    }
  );
  const handleSubmit = async () => {
    try {
      const postData = { rate, rateComment };
      await handlePost(postData);
      if (postError) {
        setErrorAlert("Erro ao enviar avaliação.");
      }
    } catch (error) {
      setErrorAlert("Erro ao enviar avaliação.");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="100%" mx={4} maxW="400px" bg={"bg"} p={4}>
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
              <Box display="flex" mb={4}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Box
                    key={value}
                    as="button"
                    aria-label={`Avaliação ${value} estrelas`}
                    onClick={() => handleRating(value)}
                    mr={2}
                    display="flex"
                    flexDirection="column"
                    w="40px"
                    _hover={{
                      transform: "scale(1.1)",
                    }}
                    transition="transform 0.2s ease"
                  >
                    <FaStar
                      size={32}
                      color={value <= (rate || 0) ? "#FFA61A" : "#9E9E9E"}
                    />
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
              isDisabled={isFetching || !rate}
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
