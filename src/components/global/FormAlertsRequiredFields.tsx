import { Alert, AlertIcon, Wrap, Tag, Text } from "@chakra-ui/react";

export const FormAlertsRequiredFields = ({ errors, ...rest }: any) => {
  if (!Object.keys(errors).length) return null;
  return (
    <Alert w="fit-content" mt={2} status="warning" {...rest}>
      <AlertIcon />
      {Object.keys(errors).length === 1 ? (
        <Text fontWeight="bold" mr={2}>
          Informe o campo:
        </Text>
      ) : (
        <Text fontWeight="bold" mr={2}>
          Informe os campos:
        </Text>
      )}
      <Wrap overflow="visible">
        {Object.values(errors)?.map((err: any) => {
          return (
            <Tag
              color="cinza"
              shadow="sm"
              bg="white"
              mx={2}
              key={err}
              fontWeight={400}
              lineHeight={1}
            >
              {err?.message}
            </Tag>
          );
        })}
      </Wrap>
    </Alert>
  );
};
