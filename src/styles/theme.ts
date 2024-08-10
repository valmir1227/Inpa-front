import { extendTheme } from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";

const variantOutlined = () => ({
  field: {
    _focus: {
      borderColor: "amarelo",
      boxShadow: "0 0 0 1px amarelo",
    },
  },
});

const variantFilled = () => ({
  field: {
    _focus: {
      borderColor: "amarelo",
      boxShadow: "0 0 0 1px amarelo",
    },
  },
});

const variantFlushed = () => ({
  field: {
    _focus: {
      borderColor: "amarelo",
      boxShadow: "0 1px 0 0 amarelo",
    },
  },
});

export const theme = extendTheme({
  initialColorMode: "light",
  // useSystemColorMode: false,
  fonts: {
    heading: "Roboto",
    body: "Roboto",
  },
  colors: {
    amarelo: "#FFA61A",
    azul: "#00B5B8",
    cinzaescuro: "#626262",
    cinza: "#9E9E9E",
    cinzaclaro: "#DCDCDC",
    amarelogradient1: "#FFC971",
    amarelogradient2: "#FFA61A",
    azulgradient1: "#00B5B8",
    azulgradient2: "#008CB8",
    bg: "#FAFAFA",
    vermelho: "#EB5757",
  },
  shadows: {
    outline: "0 0 0 1px #FFA61A",
  },
  components: {
    Button: {
      variants: {
        secondary: {
          bg: "red.500",
          color: "white",
          _hover: { bg: darken("primary", 4) },
        },
      },
      baseStyle: {
        _hover: {
          // textDecoration: "underline",
        },
        // _focus: { outlineColor: "amarelo", borderColor: "amarelo" },
      },
    },

    Link: {
      baseStyle: {
        _hover: {
          textDecoration: "none",
        },
        // _focus: { outlineColor: "amarelo", borderColor: "amarelo" },
      },
    },
    Input: {
      variants: {
        outline: variantOutlined,
        filled: variantFilled,
        flushed: variantFlushed,
      },
    },
    Select: {
      variants: {
        outline: variantOutlined,
        filled: variantFilled,
        flushed: variantFlushed,
      },
    },
  },
  styles: {
    global: {
      // textarea: {
      //   _focus: { borderColor: "red", boxShadow: "0 1px 0 0 amarelo" },
      // },
      // svg: {
      //   display: "inline",
      //   lineHeight: "1",
      // },
      a: {
        _hover: {
          //textDecoration: "underline",
        },
      },
      body: {
        bg: "#f5f5f5",
        color: "cinzaescuro",
        // lineHeight: "inherit",
      },
      button: {
        // _focus: { outlineColor: "#00000011" },
      },
    },
  },
});
