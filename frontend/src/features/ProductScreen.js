import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectProductById } from "../features/services/products";
import { addItem } from "./cart/cartSlice";
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
  Select,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  let params = useParams();
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const product = useSelector((state) => selectProductById(state, params.id));

  const addToCartHandler = (product) => {
    let subtotal = Number(product.price * qty);
    dispatch(addItem({ product, qty, subtotal }));
    navigate(`/cart/${params.id}`);
  };

  return (
    <Container maxW="full">
      <Link to="/">
        <Button variant="ghost" color="teal">
          Go Back
        </Button>
      </Link>
      <SimpleGrid mt={5} columns={{ base: 1, lg: 3 }} spacing={[2, 5, 10]}>
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
          {product.countInStock > 0 && (
            <Select onChange={(e) => setQty(e.target.value)}>
              {[...Array(product.countInStock).keys()].map((count) => (
                <option value={count + 1} key={count + 1}>
                  {count + 1}
                </option>
              ))}
            </Select>
          )}
          <Divider />
          <Button
            w="full"
            mt={3}
            disabled={product.countInStock === 0}
            onClick={() => addToCartHandler(product)}
          >
            Add To Cart
          </Button>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default ProductScreen;
