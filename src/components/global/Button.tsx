import React, { forwardRef } from "react";
import {
  Text,
  Button as ChakraButton,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import Link from "next/link";

const Button = forwardRef<HTMLButtonElement, any>(
  ({ color = "amarelo", title, textColor = "white", ...rest }, ref) => {
    return (
      <ChakraButton
        ref={ref}
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
);

Button.displayName = "Button";

const ButtonLink = forwardRef<HTMLAnchorElement, any>(
  (
    {
      href,
      disabled,
      isDisabled = false,
      target,
      alignSelf = "center",
      ...rest
    }: any,
    ref
  ) => {
    if (disabled) {
      return (
        <Button
          isDisabled={disabled || isDisabled}
          disabled={disabled || isDisabled}
          {...rest}
        />
      );
    }

    return (
      <Link href={href} passHref>
        <ChakraLink alignSelf={alignSelf} target={target} ref={ref}>
          <Button {...rest} />
        </ChakraLink>
      </Link>
    );
  }
);

ButtonLink.displayName = "ButtonLink";

export { Button, ButtonLink };
