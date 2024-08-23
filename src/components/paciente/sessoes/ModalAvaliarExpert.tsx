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
import { useTheme } from "@emotion/react";
import { Header } from "components/Header";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineFrown, AiOutlineMeh, AiOutlineSmile } from "react-icons/ai";
import { FaRegGrinStars, FaRegSadTear } from "react-icons/fa";

function ModalAvaliarExpert({ isOpen, onClose, data, dataAppointment }: any) {
  const theme = useTheme();
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const router = useRouter();

  const handleRating = (value: any) => {
    setRating(value);
  };

  const handleFeedbackChange = (event: any) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = () => {
    // Função para enviar a avaliação
    console.log({
      rating,
      feedback,
      appointmentId: dataAppointment?.id,
      expertId: data?.id,
    });
    router.push("/paciente/sessoes");
    onClose(); // Fecha o modal após o envio
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
            <Text mb={4} fontSize="medium" color={"cinzaescuro"}>
              Nos conte qual foi o grau de satisfação que você teve com esse
              profissional.
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
                    bg={rating === value ? "gray.200" : "white"}
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
                      {value === 3 && "Razoável"}
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
              value={feedback}
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
