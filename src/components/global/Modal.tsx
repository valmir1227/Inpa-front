import {
  Modal as ModalChakra,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

export function Modal({
  title,
  children,
  cancelButton,
  confirmButton,
  isOpen,
  onClose,
  size,
  bg = "bg",
  isCentered = true,
}: any) {
  return (
    <ModalChakra
      size={size}
      isCentered={isCentered}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
      <ModalContent bg={bg} borderRadius={14} mx={4} p={0}>
        <ModalHeader textAlign="center" fontWeight={800} fontSize={18}>
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody px={[2, 6]}>{children}</ModalBody>

        <ModalFooter
          gap={5}
          alignSelf="center"
          flexDir={{ base: "column-reverse", md: "row" }}
          justifyContent="space-between"
          w="fit-content"
        >
          {cancelButton}
          {confirmButton}
        </ModalFooter>
      </ModalContent>
    </ModalChakra>
  );
}
