import React, {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectAuthenticatedUser} from "./features/auth/authSlice";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {Container} from "@chakra-ui/react";
import Loader from "./components/Loader";

const HomeScreen = lazy(() => import("./pages/HomeScreen"));
const ProductScreen = lazy(() => import("./pages/ProductScreen"));
const UserListScreen = lazy(() => import("./pages/admin/UserListScreen"));
const UserEditScreen = lazy(() => import("./pages/admin/UserEditScreen"));
const ProductListScreen = lazy(() => import("./pages/admin/ProductListScreen"));
const ProductEditScreen = lazy(() => import("./pages/admin/ProductEditScreen"));
const OrdersListScreen = lazy(() => import("./pages/OrdersListScreen"));

const OrderScreen = lazy(() => import("./pages/order/OrderScreen"));
const PlaceOrderScreen = lazy(() =>
    import("./pages/order/PlaceOrderScreen")
);
const PaymentScreen = lazy(() => import("./pages/order/PaymentScreen"));
const ShippingScreen = lazy(() => import("./pages/order/ShippingScreen"));

const ProfileScreen = lazy(() => import("./pages/user/ProfileScreen"));
const RegisterScreen = lazy(() => import("./pages/user/RegisterScreen"));
const LoginScreen = lazy(() => import("./pages/user/LoginScreen"));

const CartScreen = lazy(() => import("./features/cart/CartScreen"));

const App = () => {
    const {isAuthenticated, isAdmin} = useSelector(selectAuthenticatedUser);

    return (
        <>
            <Header/>
            <Container
                maxW={["90vw", "100vw", "70vw"]}
                as="main"
                py={3}
                centerContent
            >
                <Suspense fallback={<Loader/>}>
                    <Routes>
                        <Route path="/" element={<HomeScreen/>} index/>
                        <Route path="/search/:keyword" element={<HomeScreen/>}/>
                        <Route path="/login" element={<LoginScreen/>}/>
                        <Route path="/register" element={<RegisterScreen/>}/>
                        <Route path="/orders/:id" element={<OrderScreen/>}/>
                        <Route path="/products/:id" element={<ProductScreen/>}/>
                        <Route path="/cart" element={<CartScreen/>}>
                            <Route path="/cart/:id" element={<CartScreen/>}/>
                        </Route>
                        <Route element={<ProtectedRoute isAllowed={!!isAuthenticated}/>}>
                            <Route path="/profile" element={<ProfileScreen/>}/>
                            <Route path="/shipping" element={<ShippingScreen/>}/>
                            <Route path="/payment" element={<PaymentScreen/>}/>
                            <Route path="/placeorder" element={<PlaceOrderScreen/>}/>
                        </Route>
                        <Route
                            element={
                                <ProtectedRoute isAllowed={!!isAuthenticated && !!isAdmin}/>
                            }
                        >
                            <Route path="/admin/userlist" element={<UserListScreen/>}/>
                            <Route path="/admin/user/:id/edit" element={<UserEditScreen/>}/>
                            <Route
                                path="/admin/productlist"
                                element={<ProductListScreen/>}
                            />
                            <Route
                                path="admin/product/:id/edit"
                                element={<ProductEditScreen/>}
                            />
                            <Route path="/admin/orderlist" element={<OrdersListScreen/>}/>
                        </Route>
                        <Route path="*" element={<HomeScreen/>}/>
                    </Routes>
                </Suspense>
            </Container>
            <Footer/>
        </>
    );
};

export default App;
