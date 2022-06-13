import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import { Container } from "@chakra-ui/react";
const App = () => {
  return (
    <>
      <Header />
      <Container maxW="70vw" as="main" py={3}>
        <HomeScreen />
      </Container>
      <Footer />
    </>
  );
};

export default App;
