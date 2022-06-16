import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heading, SimpleGrid } from "@chakra-ui/react";
import Product from "../components/Product";

const HomeScreen = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const { data } = await axios.get("/api/products");
    setProducts(data);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

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
