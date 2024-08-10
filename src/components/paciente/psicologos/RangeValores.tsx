/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useState } from "react";
import {
  HStack,
  Input as ChakraInput,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import { toReal } from "../../../utils/toReal";
import { useMyContext } from "contexts/Context";

export function RangeValores({
  setValue,
  register,
  valorInicial,
  valorFinal,
}: any) {
  const { user } = useMyContext();
  if (user?.from_id) return null;
  function handleRangeValores(value: any) {
    setValue("initialPrice", value[0]);
    setValue("finalPrice", value[1]);
  }
  return (
    <HStack alignSelf="flex-end" w="full" maxW={550}>
      <ChakraInput
        size="xs"
        w={100}
        textAlign="center"
        value={toReal(+valorInicial, user)}
        variant="unstyled"
        bg="white"
        py={1}
        borderRadius={6}
        color="cinza"
        readOnly
      />

      <RangeSlider
        min={20}
        max={1500}
        defaultValue={[20, 1000]}
        step={10}
        h={50}
        w="full"
        // maxW={400}
        aria-label={["min", "max"]}
        onChange={(value) => handleRangeValores(value)}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack bg="amarelo" />
        </RangeSliderTrack>
        <RangeSliderThumb boxSize={5} bg="amarelo" index={0} />
        <RangeSliderThumb boxSize={5} bg="amarelo" index={1} />
      </RangeSlider>
      <ChakraInput
        size="xs"
        w={100}
        textAlign="center"
        value={toReal(+valorFinal, user)}
        variant="unstyled"
        bg="white"
        py={1}
        borderRadius={6}
        color="cinza"
        readOnly
      />
    </HStack>
  );
}
