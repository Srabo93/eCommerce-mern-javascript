import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./features/HomeScreen";
import ProductScreen from "./features/ProductScreen";
import CartScreen from "./features/CartScreen";
import LoginScreen from "./features/LoginScreen";
import RegisterScreen from "./features/RegisterScreen";
import ProfileScreen from "./features/ProfileScreen";
import ShippingScreen from "./features/ShippingScreen";
import { Container } from "@chakra-ui/react";

const App = () => {
  return (
    <>
      <Header />
      <Container
        maxW={["90vw", "100vw", "90vw"]}
        as="main"
        py={3}
        centerContent
      >
        <Routes>
          <Route path="/" element={<HomeScreen />} index />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/products/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />}>
            <Route path="/cart/:id" element={<CartScreen />} />
          </Route>
        </Routes>
      </Container>
      <Footer />
    </>
  );
};

export default App;
