import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Heading,
  Image,
  SimpleGrid,
  VStack,
  Text,
  HStack,
  Flex,
  Divider,
  Box,
  Container,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import products from "../products";
const ProductScreen = () => {
  let params = useParams();
  const product = products.find((product) => product._id === params.id);
  return (
    <Container maxW="full">
      <Link to="/">
        <Button variant="ghost" color="teal">
          Go Back
        </Button>
      </Link>
      <SimpleGrid mt={5} columns={[1, null, 3]} spacing={[2, 5, 10]}>
        <Image src={product.image} alt={product.image} />
        <VStack alignItems="flex-start">
          <Heading as="h3" fontSize={["md", "xl", "2xl"]}>
            {product.name}
          </Heading>
          <Box
            direction={["column", "column"]}
            alignItems="flex-end"
            justifyContent="center"
          >
            {Array(5)
              .fill("")
              .map((_, i) => (
                <StarIcon
                  as="div"
                  key={i}
                  boxSize={[3, 4, 5]}
                  color={i < product.rating ? "teal.500" : "gray.300"}
                />
              ))}
            <Text noOfLines={1} as="p" fontSize={["sm", "md", "lg"]}>
              {product.numReviews} reviews
            </Text>
          </Box>
          <Divider />
          <Flex flexDir="column">
            <Text fontWeight="bold" pb={7}>
              Price: ${product.price}
            </Text>
            <Text>{product.description}</Text>
          </Flex>
        </VStack>
        <Box textAlign="center">
          <Divider mt={[8, 2]} />
          <HStack justifyContent="space-between" p={2} my={3}>
            <Text as="p">Price:</Text>
            <Text as="p">${product.price}</Text>
          </HStack>
          <Divider />
          <HStack justifyContent="space-between" p={2} my={3}>
            <Text as="p">Status:</Text>
            <Text as="p">
              {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
            </Text>
          </HStack>
          <Divider />
          <Button w="full" mt={3} disabled={product.countInStock === 0}>
            Add To Cart
          </Button>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default ProductScreen;
