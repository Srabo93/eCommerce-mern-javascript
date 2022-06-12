import { extendTheme, theme as base } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `Montserrat,${base.fonts?.heading}`,
    body: `Inter,${base.fonts?.body}`,
  },
});

export default theme;
