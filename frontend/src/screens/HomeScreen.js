import { Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import Product from "../components/Product";
import products from "../products";

const HomeScreen = () => {
  return (
    <>
      <Heading as="h1">Latest Products</Heading>
      <SimpleGrid columns={[2, null, 3]} spacing={2}>
        {products.map((product, i) => (
          <Product key={i} product={product} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default HomeScreen;
