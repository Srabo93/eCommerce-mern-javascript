import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthenticatedUser } from "./features/auth/authSlice";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./features/HomeScreen";
import ProductScreen from "./features/ProductScreen";
import CartScreen from "./features/cart/CartScreen";
import LoginScreen from "./features/auth/LoginScreen";
import RegisterScreen from "./features/auth/RegisterScreen";
import ProfileScreen from "./features/auth/ProfileScreen";
import ShippingScreen from "./features/order/ShippingScreen";
import PaymentScreen from "./features/order/PaymentScreen";
import PlaceOrderScreen from "./features/order/PlaceOrderScreen";
import OrderScreen from "./features/order/OrderScreen";
import UserListScreen from "./features/UserListScreen";
import UserEditScreen from "./features/UserEditScreen";
import { Container } from "@chakra-ui/react";

const App = () => {
  const { isAuthenticated, isAdmin } = useSelector(selectAuthenticatedUser);

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
          <Route path="/orders/:id" element={<OrderScreen />} />
          <Route path="/products/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />}>
            <Route path="/cart/:id" element={<CartScreen />} />
          </Route>
          <Route element={<ProtectedRoute isAllowed={!!isAuthenticated} />}>
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
          </Route>
          <Route
            element={
              <ProtectedRoute isAllowed={!!isAuthenticated && !!isAdmin} />
            }
          >
            <Route path="/admin/userlist" element={<UserListScreen />} />
            <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
          </Route>
          <Route path="*" element={<HomeScreen />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
};

export default App;
