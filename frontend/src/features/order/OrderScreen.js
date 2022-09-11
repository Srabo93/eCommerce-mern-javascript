import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeCart } from "../cart/cartSlice";
import { useGetOrderQuery, usePayOrderMutation } from "../services/orders";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  Heading,
  Text,
  Grid,
  GridItem,
  Divider,
  Image,
  VStack,
  Box,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const OrderScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    data: order,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetOrderQuery(id);

  const [payOrder, { isError: updateFailed, error: updateError }] =
    usePayOrderMutation();

  let status;
  if (isLoading) {
    status = <Loader />;
  }
  if (isError) {
    status = <Message m={3} error={error} />;
  }
  if (updateFailed) {
    status = <Message m={3} error={updateError} />;
  }

  return (
    <>
      {isSuccess ? (
        <Grid
          mt={6}
          w={["90vw", "100vw", "70vw"]}
          minH="50vh"
          templateRows={["repeat(2, 1fr)", "repeat(2,1fr)", "repeat(1,1fr)"]}
          templateColumns="repeat(6, 1fr)"
          gap={4}
        >
          {status}
          <GridItem
            colSpan={{ base: 6, sm: 6, md: 6, lg: 4 }}
            rowSpan={{ base: 2, sm: 2, md: 2, lg: 1 }}
            p={3}
          >
            <Heading as="h2" size="lg" mb={3}>
              ORDER {order._id}
            </Heading>
            <Divider />
            <Heading as="h2" size="lg" my={3}>
              Shipping
            </Heading>
            <Text mb={3}>Name: {order.user.name}</Text>
            <Text mb={3}>Email: {order.user.email}</Text>
            <Text mb={3}>
              Address: {order.shippingAddress.address}{" "}
              {order.shippingAddress.city} {order.shippingAddress.postalCode}{" "}
              {order.shippingAddress.country}
            </Text>
            {order.isShipped ? (
              <Alert status="success">
                {" "}
                <AlertIcon />
                Paid on {order.shippedAt}
              </Alert>
            ) : (
              <Alert status="error">
                <AlertIcon />
                Not Delivered
              </Alert>
            )}
            <Divider />
            <Heading as="h2" size="lg" my={3}>
              Payment Method
            </Heading>
            <Text mb={3}>Method: {order.paymentMethod}</Text>
            {order.isPaid ? (
              <Alert status="success">
                {" "}
                <AlertIcon />
                Paid on {order.paidAt.substring(0, 10)}
              </Alert>
            ) : (
              <Alert status="error">
                <AlertIcon />
                Not Paid
              </Alert>
            )}
            <Divider />
            <Heading as="h2" size="lg" my={3}>
              Ordered Items
            </Heading>
            <VStack>
              {order.orderItems.map((product) => (
                <Box
                  w="full"
                  key={product._id}
                  display="flex"
                  flexDir="column"
                  alignItems="start"
                >
                  <Box display="flex" alignItems="center" my={3}>
                    <Image
                      boxSize="50px"
                      objectFit="cover"
                      src={product.image}
                      px={2}
                    />
                    <Text px={2}>{product.name}</Text>
                    <Text px={2}>
                      {product.qty} X {product.price} = $
                      {parseFloat(product.qty * product.price).toFixed(2)}
                    </Text>
                  </Box>
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
                <Text>${order.totalPrice - order.taxPrice}</Text>
              </Box>
              <Divider />

              <Box
                w="full"
                display="flex"
                flexDir="row"
                justifyContent="space-between"
              >
                <Text>Shipping: $</Text>
                <Text>${order.shippingPrice}</Text>
              </Box>
              <Divider />

              <Box
                w="full"
                display="flex"
                flexDir="row"
                justifyContent="space-between"
              >
                <Text>Tax: $</Text>
                <Text>${order.taxPrice}</Text>
              </Box>
              <Divider />

              <Box
                w="full"
                display="flex"
                flexDir="row"
                justifyContent="space-between"
              >
                <Text>Total: $</Text>
                <Text>${order.totalPrice}</Text>
              </Box>
              <Divider />
            </VStack>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: order.totalPrice,
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                  details.orderId = id;
                  payOrder(details);
                  dispatch(removeCart());
                });
              }}
            />
          </GridItem>
        </Grid>
      ) : (
        ""
      )}
    </>
  );
};

export default OrderScreen;
