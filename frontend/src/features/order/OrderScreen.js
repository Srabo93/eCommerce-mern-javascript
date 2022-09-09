import React from "react";
import { useParams } from "react-router-dom";
import { useGetOrderQuery } from "../services/orders";
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
  const { data, isSuccess, isLoading, isError, error } = useGetOrderQuery(id);

  let status;

  if (isLoading) {
    status = <Loader />;
  }
  if (isError) {
    status = <Message m={3} error={error} />;
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
              ORDER {data._id}
            </Heading>
            <Divider />
            <Heading as="h2" size="lg" my={3}>
              Shipping
            </Heading>
            <Text mb={3}>Name: {data.user.name}</Text>
            <Text mb={3}>Email: {data.user.email}</Text>
            <Text mb={3}>
              Address: {data.shippingAddress.address}{" "}
              {data.shippingAddress.city} {data.shippingAddress.postalCode}{" "}
              {data.shippingAddress.country}
            </Text>
            {data.isShipped ? (
              <Alert status="success">
                {" "}
                <AlertIcon />
                Paid on {data.shippedAt}
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
            <Text mb={3}>Method: {data.paymentMethod}</Text>
            {data.isPayed ? (
              <Alert status="success">
                {" "}
                <AlertIcon />
                Paid on {data.paidAt}
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
              {data.orderItems.map((product) => (
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
                <Text>${data.totalPrice - data.taxPrice}</Text>
              </Box>
              <Divider />

              <Box
                w="full"
                display="flex"
                flexDir="row"
                justifyContent="space-between"
              >
                <Text>Shipping: $</Text>
                <Text>${data.shippingPrice}</Text>
              </Box>
              <Divider />

              <Box
                w="full"
                display="flex"
                flexDir="row"
                justifyContent="space-between"
              >
                <Text>Tax: $</Text>
                <Text>${data.taxPrice}</Text>
              </Box>
              <Divider />

              <Box
                w="full"
                display="flex"
                flexDir="row"
                justifyContent="space-between"
              >
                <Text>Total: $</Text>
                <Text>${data.totalPrice}</Text>
              </Box>
              <Divider />
            </VStack>
          </GridItem>
        </Grid>
      ) : (
        ""
      )}
    </>
  );
};

export default OrderScreen;
