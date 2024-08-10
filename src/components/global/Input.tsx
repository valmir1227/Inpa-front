import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  VStack,
  HStack,
  Center,
  Button,
  Wrap,
  Input as ChakraInput,
  Checkbox,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";

export function Input({
  password = false,
  placeholder,
  icon,
  id,
  errors = false,
  required = false,
  register = false,
  maxW,
  ...rest
}: any) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup mt={8} maxW={maxW}>
      <ChakraInput
        type={password ? (show ? "text" : "password") : "text"}
        fontSize={18}
        variant="flushed"
        _placeholder={{ color: "cinza" }}
        placeholder={placeholder}
        // borderColor="cinzaescuro"
        borderBottomWidth={2}
        isInvalid={errors[id]}
        {...register}
        {...rest}
      />

      {password && (
        <InputRightElement>
          <Button
            justifySelf="center"
            variant="ghost"
            size="sm"
            onClick={handleClick}
          >
            {show ? (
              <AiOutlineEye color="#777" />
            ) : (
              <AiOutlineEyeInvisible color="#777" />
            )}
          </Button>
        </InputRightElement>
      )}
      {icon && <InputRightElement>{icon}</InputRightElement>}
    </InputGroup>
  );
}
