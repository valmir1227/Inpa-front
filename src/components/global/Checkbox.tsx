import {
  Checkbox,
  CheckboxGroup,
  CheckboxGroupProps,
  Skeleton,
  Stack,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import { LoadingInpa } from "./Loading";

interface CheckboxInpaProps extends CheckboxGroupProps {
  values: string[];
  setGrupo?: any;
  direction?: any;
  setState?: any;
  checked?: boolean;
  experts?: string[];
  defaultValues?: string[];
  disabled?: boolean;
  loading?: boolean;
}

export function CheckboxInpa({
  values,
  direction = "row",
  setState = null,
  defaultValues = [],
  disabled = false,
  loading = false,
  // checked = true,
  ...rest
}: CheckboxInpaProps) {
  // if (loading) return <LoadingInpa />;
  return (
    <CheckboxGroup
      onChange={setState}
      defaultValue={defaultValues}
      colorScheme="green"
      {...rest}
    >
      <Wrap p={1} direction={direction} spacing={4}>
        {loading && <LoadingInpa />}
        {values.map((item) => (
          <Checkbox
            isDisabled={disabled && !defaultValues.includes(item)}
            key={item}
            _checked={{
              _hover: {
                ".chakra-checkbox__control": {
                  borderColor: "azul",
                  backgroundColor: "azul",
                },
              },
              ".chakra-checkbox__control": {
                borderColor: "azul",
                backgroundColor: "azul",
              },
            }}
            value={item}
          >
            <Text fontSize={14}>{item}</Text>
          </Checkbox>
        ))}
      </Wrap>
    </CheckboxGroup>
  );
}
export function SingleCheckboxInpa({ title, ...rest }: any) {
  // if (loading) return <LoadingInpa />;
  return (
    <Checkbox
      // display="inline"
      maxW={300}
      w="full"
      _checked={{
        _hover: {
          ".chakra-checkbox__control": {
            borderColor: "azul",
            backgroundColor: "azul",
          },
        },
        ".chakra-checkbox__control": {
          borderColor: "azul",
          backgroundColor: "azul",
        },
      }}
      value={title}
      {...rest}
    >
      <Text fontSize={14}>{title}</Text>
    </Checkbox>
  );
}

export function CheckboxTagInpa({
  values,
  setGrupo,
  experts,
  ...rest
}: CheckboxInpaProps) {
  return (
    <CheckboxGroup
      onChange={(data) => setGrupo(data)}
      defaultValue={experts}
      {...rest}
    >
      <Wrap w="full" justify="space-between">
        {values.map((item) => (
          <Checkbox
            key={item}
            _checked={{
              _hover: {
                span: { borderColor: "azul", backgroundColor: "azul" },
              },
              span: { borderColor: "azul", backgroundColor: "azul" },
            }}
            _hover={{
              span: {
                borderColor: darken("azul", 10),
              },
            }}
            value={item}
            color="cinza"
            sx={{
              ".chakra-checkbox__control": { display: "none" },
              span: {
                borderRadius: 10,
                p: "6px 12px",
                bg: "white",
                color: "azul",
                borderWidth: 1,
                borderColor: "azul",
              },
              _checked: {
                span: { bg: "azul", color: "white" },
              },
            }}
          >
            {item}
          </Checkbox>
        ))}
      </Wrap>
    </CheckboxGroup>
  );
}
