import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import { Container } from "@chakra-ui/react";
const App = () => {
  return (
    <>
      <Header />
      <Container maxW="70vw" as="main" py={3}>
        <Routes>
          <Route path="/" element={<HomeScreen />} index />
          <Route path="/product/:id" element={<ProductScreen />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
};

export default App;
