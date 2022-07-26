import React from "react";
import { useSelector } from "react-redux";
import { selectAllItems } from "../features/cartSlice";
import { Container, Stack, Heading } from "@chakra-ui/react";
import Feature from "../components/Feature";

const CartScreen = () => {
  const cartItems = useSelector(selectAllItems);
  return (
    // <Container maxW={["90%", "100%", "80%"]}>
    <Container maxW={["90%", "100%", "90%"]}>
      <Heading as="h1">Shopping Cart</Heading>
      <Stack spacing={8} mt={5}>
        {cartItems.map((cartItem) => (
          <Feature item={cartItem} key={cartItem.itemId} />
        ))}
      </Stack>
    </Container>
  );
};

export default CartScreen;
