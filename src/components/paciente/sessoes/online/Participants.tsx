import React from "react";
import {
  Box,
  HStack,
  Text,
  VStack,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react";
export function Participants({ data }: any) {
  const participants = [
    { name: data?.patient.name, relationship: "Titular" },
    ...(data?.participant_id || []),
  ];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "participants",
    defaultValue: data?.patient.name,
    onChange: console.log,
  });

  const group = getRootProps();

  return (
    <VStack align="start" {...group}>
      {participants.map((value) => {
        const radio = getRadioProps({ value: value.name });
        return (
          <HStack key={value.name}>
            <RadioCard {...radio}>{value.name}</RadioCard>
            <Text color={radio.isChecked ? "amarelo" : "inherit"} fontSize={12}>
              {value.relationship}
            </Text>
          </HStack>
        );
      })}
    </VStack>
  );
}

function RadioCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        bg="cinzaclaro"
        _checked={{
          bg: "amarelo",
          color: "white",
          // borderColor: "teal.600",
        }}
        px={2}
        py={1}
        borderRadius={6}
        fontWeight={500}
        fontSize={14}
        p={3}
        lineHeight={1}
        w="max-content"
      >
        {props.children}
      </Box>
    </Box>
  );
}
