import React from "react";
import { Text, Divider, Box } from "@chakra-ui/react";

const OrderSummary = ({ order }) => {
  return (
    <>
      <Box w="full" display="flex" flexDir="row" justifyContent="space-between">
        <Text>Items: </Text>
        <Text>${order.totalPrice - order.taxPrice}</Text>
      </Box>
      <Divider />

      <Box w="full" display="flex" flexDir="row" justifyContent="space-between">
        <Text>Shipping: </Text>
        <Text>${order.shippingPrice}</Text>
      </Box>
      <Divider />

      <Box w="full" display="flex" flexDir="row" justifyContent="space-between">
        <Text>Tax: </Text>
        <Text>${order.taxPrice}</Text>
      </Box>
      <Divider />
      <Box w="full" display="flex" flexDir="row" justifyContent="space-between">
        <Text>Total: </Text>
        <Text>${order.totalPrice}</Text>
      </Box>
    </>
  );
};

export default OrderSummary;
