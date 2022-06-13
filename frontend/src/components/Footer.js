import { Container, Text } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  return (
    <Container as="footer" role="contentinfo" mt={5} centerContent>
      <Text>Copyright &copy; Proshop</Text>
    </Container>
  );
};

export default Footer;
