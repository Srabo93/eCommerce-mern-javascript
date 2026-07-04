import React from "react";
import { useSelector } from "react-redux";
import { selectAllItems } from "./cartSlice";
import { useNavigate } from "react-router-dom";
import { selectAuthenticatedUser } from "../auth/authSlice";
import { Container, Heading, Grid, GridItem, Button } from "@chakra-ui/react";
import Feature from "../../components/Feature";
import CartStats from "../../components/CartStats";

const CartScreen = () => {
  const cartItems = useSelector(selectAllItems);
  const { isAuthenticated } = useSelector(selectAuthenticatedUser);
  const navigate = useNavigate();

  const checkOutHandler = () => {
    isAuthenticated ? navigate("/shipping") : navigate("/login");
  };

  return (
    <Container maxW={["90%", "100%", "90%"]}>
      <Heading as="h1">Shopping Cart</Heading>
      <Grid
        templateRows="repeat(1, 1fr)"
        templateColumns="repeat(4,1fr)"
        gap={6}
      >
        <GridItem colSpan={4}>
          {cartItems.map((cartItem) => (
            <Feature item={cartItem} key={cartItem.product._id} />
          ))}
        </GridItem>
        <GridItem rowSpan={2} colSpan={2}>
          <CartStats cartItems={cartItems} />
        </GridItem>
      </Grid>
      <Button
        mt={3}
        disabled={cartItems.length === 0}
        onClick={checkOutHandler}
      >
        Proceed To Checkout
      </Button>
    </Container>
  );
};

export default CartScreen;
