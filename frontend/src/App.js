import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthenticatedUser } from "./features/auth/authSlice";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "@chakra-ui/react";
import Loader from "./components/Loader";

const HomeScreen = lazy(() => import("./features/HomeScreen"));
const ProductScreen = lazy(() => import("./features/ProductScreen"));
const UserListScreen = lazy(() => import("./features/UserListScreen"));
const UserEditScreen = lazy(() => import("./features/UserEditScreen"));
const ProductListScreen = lazy(() => import("./features/ProductListScreen"));
const ProductEditScreen = lazy(() => import("./features/ProductEditScreen"));
const OrdersListScreen = lazy(() => import("./features/OrdersListScreen"));

const OrderScreen = lazy(() => import("./features/order/OrderScreen"));
const PlaceOrderScreen = lazy(() =>
  import("./features/order/PlaceOrderScreen")
);
const PaymentScreen = lazy(() => import("./features/order/PaymentScreen"));
const ShippingScreen = lazy(() => import("./features/order/ShippingScreen"));

const ProfileScreen = lazy(() => import("./features/auth/ProfileScreen"));
const RegisterScreen = lazy(() => import("./features/auth/RegisterScreen"));
const LoginScreen = lazy(() => import("./features/auth/LoginScreen"));

const CartScreen = lazy(() => import("./features/cart/CartScreen"));

const App = () => {
  const { isAuthenticated, isAdmin } = useSelector(selectAuthenticatedUser);

  return (
    <>
      <Header />
      <Container
        maxW={["90vw", "100vw", "70vw"]}
        as="main"
        py={3}
        centerContent
      >
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomeScreen />} index />
            <Route path="/search/:keyword" element={<HomeScreen />} />
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
              <Route
                path="/admin/productlist"
                element={<ProductListScreen />}
              />
              <Route
                path="admin/product/:id/edit"
                element={<ProductEditScreen />}
              />
              <Route path="/admin/orderlist" element={<OrdersListScreen />} />
            </Route>
            <Route path="*" element={<HomeScreen />} />
          </Routes>
        </Suspense>
      </Container>
      <Footer />
    </>
  );
};

export default App;
