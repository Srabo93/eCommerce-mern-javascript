import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllItems } from "./cartSlice";
import { useCreateOrderMutation } from "./api/shopSlice";
import CheckOutSteps from "../components/CheckOutSteps";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  Heading,
  Text,
  Grid,
  GridItem,
  Divider,
  UnorderedList,
  ListItem,
  VStack,
  Box,
  Button,
} from "@chakra-ui/react";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const [create, { isLoading, data, isSuccess, isError, error }] =
    useCreateOrderMutation();
  const cart = useSelector((state) => state.cart);
  const products = useSelector(selectAllItems);
  const itemsTotal = products.reduce(
    (acc, product) => acc + product.subtotal,
    0
  );
  const shipping = itemsTotal < 50 ? 20 : 0;
  const tax = parseFloat((itemsTotal / 100) * 19).toFixed(2);
  const total = Number(
    itemsTotal + parseFloat((itemsTotal / 100) * 19)
  ).toFixed(2);

  const placeOrderHandler = async () => {
    try {
      await create({
        unorderedItems: products,
        shippingAddress: cart.shipping,
        paymentMethod: cart.paymentMethod,
        itemsPrice: itemsTotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(`/orders/${data._id}`);
    }
    //TODO: maybe delete the cartInformation in here hence its sucessfull

    return () => {};
  }, [isSuccess, data, navigate]);

  let status;
  if (isLoading) {
    status = <Loader />;
  } else if (isError) {
    status = <Message m={3} error={error.data.message} />;
  }

  return (
    <>
      <CheckOutSteps step1 step2 step3 step4 />
      {status}
      <Grid
        mt={6}
        w={["90vw", "100vw", "70vw"]}
        minH="50vh"
        templateRows={["repeat(2, 1fr)", "repeat(2,1fr)", "repeat(1,1fr)"]}
        templateColumns="repeat(6, 1fr)"
        gap={4}
      >
        <GridItem
          colSpan={{ base: 6, sm: 6, md: 6, lg: 4 }}
          rowSpan={{ base: 2, sm: 2, md: 2, lg: 1 }}
          p={3}
        >
          <Heading as="h2" size="lg" mb={3}>
            Shipping
          </Heading>
          <Text mb={3} as="u">
            Address:
          </Text>
          <UnorderedList listStyleType="none" pb={3}>
            <ListItem pl={3}>{cart.shipping.address}</ListItem>
            <ListItem pl={3}>{cart.shipping.city}</ListItem>
            <ListItem pl={3}>{cart.shipping.postalCode}</ListItem>
            <ListItem pl={3}>{cart.shipping.country}</ListItem>
          </UnorderedList>
          <Divider />
          <Heading as="h2" size="lg" my={3}>
            Payment Method
          </Heading>
          <Text mb={3}>Method: {cart.paymentMethod}</Text>
          <Divider />
          <Heading as="h2" size="lg" my={3}>
            Order Items
          </Heading>
          <VStack>
            {products.map((product) => (
              <Box
                w="full"
                key={product.product._id}
                display="flex"
                flexDir="column"
                alignItems="start"
              >
                <Text>{product.product.name}</Text>
                <Text ml={{ base: "0", lg: "auto" }}>
                  {product.qty} X {product.product.price} = $
                  {parseFloat(product.subtotal).toFixed(2)}
                </Text>
                <Divider />
              </Box>
            ))}
          </VStack>
        </GridItem>
        <GridItem
          colSpan={{ base: 6, sm: 6, md: 6, lg: 2 }}
          rowSpan={{ base: 2, sm: 2, md: 2, lg: 1 }}
          py={3}
        >
          <VStack alignItems="start">
            <Heading as="h2" size="lg" my={3}>
              Order Summary
            </Heading>
            <Divider />
            <Box
              w="full"
              display="flex"
              flexDir="row"
              justifyContent="space-between"
            >
              <Text>Items: </Text>
              <Text>${itemsTotal}</Text>
            </Box>
            <Divider />

            <Box
              w="full"
              display="flex"
              flexDir="row"
              justifyContent="space-between"
            >
              <Text>Shipping: $</Text>
              <Text>${shipping}</Text>
            </Box>
            <Divider />

            <Box
              w="full"
              display="flex"
              flexDir="row"
              justifyContent="space-between"
            >
              <Text>Tax: $</Text>
              <Text>${tax}</Text>
            </Box>
            <Divider />

            <Box
              w="full"
              display="flex"
              flexDir="row"
              justifyContent="space-between"
            >
              <Text>Total: $</Text>
              <Text>${total}</Text>
            </Box>
            <Divider />
          </VStack>
          <Button my={3} w="full" onClick={placeOrderHandler}>
            Place Order
          </Button>
        </GridItem>
      </Grid>
    </>
  );
};

export default PlaceOrderScreen;
