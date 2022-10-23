import React from "react";
import { Text, Divider, Image, Box } from "@chakra-ui/react";

const OrderedItemsList = ({ order }) => {
  return (
    <>
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
              {product.qty} X ${product.price} = $
              {parseFloat(product.qty * product.price).toFixed(2)}
            </Text>
          </Box>
          <Divider />
        </Box>
      ))}
    </>
  );
};

export default OrderedItemsList;
