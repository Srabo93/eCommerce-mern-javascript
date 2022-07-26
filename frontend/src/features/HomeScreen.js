import React from "react";
import { useSelector } from "react-redux";
import { selectAllProducts, useGetProductsQuery } from "./productsSlice";
import { Heading, SimpleGrid } from "@chakra-ui/react";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";

const HomeScreen = () => {
  const { isLoading, isSuccess, isError, error } = useGetProductsQuery();

  const products = useSelector(selectAllProducts);
  let content;

  if (isLoading) {
    content = <Loader />;
  } else if (isSuccess) {
    content = products.map((product, i) => (
      <Product key={i} product={product} />
    ));
  } else if (isError) {
    content = <Message error={error} />;
  }
  return (
    <>
      <Heading as="h1">Latest Products</Heading>
      <SimpleGrid columns={[2, null, 3]} spacing={2}>
        {content}
      </SimpleGrid>
    </>
  );
};

export default HomeScreen;
