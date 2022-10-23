import React from "react";
import { useSelector } from "react-redux";
import {
  selectAllProducts,
  useGetProductsQuery,
  useSearchProductQuery,
} from "./services/products";
import { Heading, SimpleGrid } from "@chakra-ui/react";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";

const HomeScreen = () => {
  let { keyword } = useParams();

  const { data: queriedProduct } = useSearchProductQuery(keyword);

  const { isLoading, isSuccess, isError, error } = useGetProductsQuery();

  const products = useSelector(selectAllProducts);

  let content;

  if (isLoading) {
    content = <Loader />;
  }
  if (isSuccess) {
    content = products.map((product, i) => (
      <Product key={i} product={product} />
    ));
  }
  if (isError) {
    content = <Message status="error" message={error} />;
  }
  if (keyword !== undefined) {
    content = queriedProduct?.map((product, i) => (
      <Product key={i} product={product} />
    ));
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
