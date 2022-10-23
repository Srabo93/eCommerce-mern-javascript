import React from "react";
import { Text, Alert, AlertIcon } from "@chakra-ui/react";

const ShippingDetails = ({ order }) => {
  return (
    <>
      <Text mb={3}>Name: {order.user.name}</Text>
      <Text mb={3}>Email: {order.user.email}</Text>
      <Text mb={3}>
        Address: {order.shippingAddress.address} {order.shippingAddress.city}{" "}
        {order.shippingAddress.postalCode} {order.shippingAddress.country}
      </Text>
      {order.isDelivered ? (
        <Alert status="success">
          {" "}
          <AlertIcon />
          Deliverd on {order.deliveredAt.substring(0, 10)}
        </Alert>
      ) : (
        <Alert status="error">
          <AlertIcon />
          Not Delivered
        </Alert>
      )}
    </>
  );
};

export default ShippingDetails;
