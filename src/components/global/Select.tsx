import {
  VStack,
  Select as ChakraSelect,
  Text,
  FormControl,
  FormLabel,
  Input as ChakraInput,
  InputRightElement,
  InputGroup,
  SelectProps as ChakraSelectProps,
} from "@chakra-ui/react";

interface SelectProps extends ChakraSelectProps {
  title?: string;
  values: string[];
  maxW?: number;
  register?: any;
  placeholder?: string;
  titleColor?: string;
}

export function Select({
  title,
  values,
  maxW,
  placeholder,
  titleColor = "white",
  variant = "filled",
  size = "md",
  register = false,
  ...rest
}: SelectProps) {
  return (
    <FormControl maxW={{ base: "full", sm: maxW || "full" }} w="full" pt={2}>
      {title && (
        <FormLabel
          fontWeight={400}
          color={titleColor}
          alignSelf="start"
          fontSize={14}
        >
          {title}
        </FormLabel>
      )}
      <ChakraSelect
        {...register}
        borderRadius={6}
        placeholder={placeholder || undefined}
        color="cinza"
        variant={variant}
        size={size}
        _focus={{ bg: "white" }}
        fontSize={14}
        {...rest}
      >
        {values.map((item: any) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </ChakraSelect>
    </FormControl>
  );
}

export function Input({
  title,
  placeholder,
  maxW,
  id,
  icon,
  labelColor = "white",
  errors = false,
  required = false,
  register = false,
  ...rest
}: any) {
  return (
    <FormControl zIndex={5} maxW={{ base: "full", sm: maxW }} w="full" pt={2}>
      <FormLabel
        fontWeight={400}
        color={labelColor}
        alignSelf="start"
        fontSize={14}
        htmlFor={id}
      >
        {title}
      </FormLabel>
      <InputGroup>
        <ChakraInput
          id={id}
          // fontSize={14}
          borderRadius={6}
          variant="filled"
          _focus={{ bg: "white" }}
          _placeholder={{ color: "cinza" }}
          placeholder={placeholder}
          isInvalid={errors[id]}
          {...register}
          {...rest}
        />
        {icon && <InputRightElement>{icon}</InputRightElement>}
      </InputGroup>
    </FormControl>
  );
}
