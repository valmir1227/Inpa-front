import {
  Alert,
  AlertIcon,
  AlertProps,
  Center,
  Spinner,
} from "@chakra-ui/react";

interface Props extends AlertProps {
  text: string;
}

export const AlertInpa = ({
  text,
  status = "warning",
  children,
  ...rest
}: Props) => {
  return (
    <Center
      alignSelf="center"
      flexDir="column"
      alignItems="center"
      p={2}
      {...rest}
    >
      <Alert w="fit-content" status={status}>
        <AlertIcon />
        {text}
        {children}
      </Alert>
    </Center>
  );
};

export const AlertInpaCall = (props: any, { ...rest }) => {
  const isError = props.error?.validate;
  const isSuccess = props.success?.validate;
  const status = isError ? "warning" : "success";
  const defaultText = isError ? "Erro" : "OK";
  const text = isError ? props.error?.text : props.success?.text || defaultText;

  if (!isSuccess && !isError) return null;

  return (
    <Alert status={status} {...rest}>
      <AlertIcon />
      {text || "Erro"}
    </Alert>
  );
};
