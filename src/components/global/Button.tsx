import React from "react";
import {
  Text,
  Button as ChakraButton,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import Link from "next/link";

export function Button({
  color = "amarelo",
  title,
  textColor = "white",
  ...rest
}: any) {
  return (
    <ChakraButton
      bgColor={color}
      _hover={{ bg: darken(color, 5) }}
      _active={{ bg: darken(color, 10) }}
      color={textColor}
      borderRadius="full"
      isDisabled={rest.disabled || rest.isDisabled}
      {...rest}
    >
      <Text color={textColor}>{title}</Text>
    </ChakraButton>
  );
}

export function ButtonLink({
  href,
  disabled,
  isDisabled = false,
  target,
  alignSelf = "center",
  ...rest
}: any) {
  if (disabled)
    return (
      <Button
        isDisabled={disabled || isDisabled}
        disabled={disabled || isDisabled}
        {...rest}
      />
    );
  return (
    <Link href={href} passHref>
      <ChakraLink alignSelf={alignSelf} target={target}>
        <Button {...rest} />
      </ChakraLink>
    </Link>
  );
}
