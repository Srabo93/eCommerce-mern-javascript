import React from "react";
import { useSelector } from "react-redux";
import { selectAllItems } from "../features/cartSlice";
import { Container, Heading, Grid, GridItem } from "@chakra-ui/react";
import Feature from "../components/Feature";
import CartStats from "../components/CartStats";

const CartScreen = () => {
  const cartItems = useSelector(selectAllItems);
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
            <Feature item={cartItem} key={cartItem.itemId} />
          ))}
        </GridItem>
        <GridItem rowSpan={2} colSpan={2}>
          <CartStats cartItems={cartItems} />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default CartScreen;
