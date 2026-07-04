import React from "react";
import { Container, CircularProgress } from "@chakra-ui/react";

const Loader = () => {
  return (
    <Container maxW="full" centerContent>
      <CircularProgress isIndeterminate color="blue.300" />
      <span>Loading...</span>
    </Container>
  );
};

export default Loader;
