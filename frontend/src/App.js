import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./features/HomeScreen";
import ProductScreen from "./features/ProductScreen";
import { Container } from "@chakra-ui/react";
const App = () => {
  return (
    <>
      <Header />
      <Container maxW="70vw" as="main" py={3}>
        <Routes>
          <Route path="/" element={<HomeScreen />} index />
          <Route path="/products/:id" element={<ProductScreen />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
};

export default App;
