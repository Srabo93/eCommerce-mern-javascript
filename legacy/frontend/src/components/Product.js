import React from "react";
import { Link } from "react-router-dom";
import { Box, Image, VStack } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const Product = ({ product }) => {
  return (
    <Box
      maxW={["90vw", "90vw", "70vw"]}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      mt={3}
    >
      <Link to={`/products/${product._id}`}>
        <Image src={product.image} alt={product.image} />
      </Link>
      <Box p={["2", "6"]}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <VStack>
            <Link to={`/products/${product._id}`}>
              <Box
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                noOfLines={2}
              >
                {product.name}
              </Box>
            </Link>
            <Box>
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    role="review stars"
                    data-filled={i < product.rating ? true : false}
                    color={i < product.rating ? "teal.500" : "gray.300"}
                  />
                ))}
            </Box>
            <Box as="h5" fontWeight="semibold" color="gray.600">
              ${product.price}
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Product;
