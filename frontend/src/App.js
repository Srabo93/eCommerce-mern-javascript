import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container, Heading } from "@chakra-ui/react";
const App = () => {
  return (
    <>
      <Header />
      <Container as="main" py={3}>
        <Container>
          <Heading as="h1">Welcome To Proshop</Heading>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default App;
