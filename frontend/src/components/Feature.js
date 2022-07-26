import React from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Stack, Text, Box, Divider, Image, Select } from "@chakra-ui/react";

const Feature = ({ item }) => {
  const { product, qty } = item;
  return (
    <>
      <Stack direction={["column", "row"]} alignItems="center">
        <Box p={[1, 2]} w={["100%", "20%"]}>
          <Image src={product.image} />
        </Box>
        <Box p={[1, 2]} w={["100%", "30%"]}>
          <Text fontWeight="bold" mt={5}>
            {product.name}
          </Text>
        </Box>
        <Box p={[1, 2]} w={["100%", "20%"]}>
          $ {product.price}
        </Box>
        <Box w={["100%", "25%"]}>
          {product.countInStock > 0 && (
            <Select placeholder={qty} maxW={["100%", "60%"]}>
              {[...Array(product.countInStock).keys()].map((count) => (
                <option value={count + 1} key={count + 1}>
                  {count + 1}
                </option>
              ))}
            </Select>
          )}
        </Box>
        <Box p={[1, 2]} w={["100%", "10%"]}>
          <DeleteIcon color="red.600" w={6} h={6} />
        </Box>
      </Stack>
      <Divider />
    </>
  );
};

export default Feature;
