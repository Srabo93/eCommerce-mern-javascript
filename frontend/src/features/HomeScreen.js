import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useListProductsQuery,
  useSearchProductQuery,
} from "./services/products";
import { Heading, SimpleGrid, Button, Box } from "@chakra-ui/react";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import Meta from "../components/Meta";

const HomeScreen = () => {
  let { keyword } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const { data: searchedProduct } = useSearchProductQuery(keyword);

  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useListProductsQuery(currentPage);

  const paginationHandler = (page) => {
    setCurrentPage(page);
  };

  let content;

  if (isLoading) {
    content = <Loader />;
  }
  if (isSuccess) {
    content = products.docs.map((product, i) => (
      <Product key={i} product={product} />
    ));
  }
  if (isError) {
    content = <Message status="error" message={error} />;
  }
  if (keyword !== undefined) {
    content = searchedProduct?.map((product, i) => (
      <Product key={i} product={product} />
    ));
  }

  return (
    <>
      <Meta />
      <Heading as="h1">Latest Products</Heading>
      {keyword && (
        <Box textAlign="left" w="full">
          <Link to="/">
            <Button variant="ghost" color="teal">
              Go Back
            </Button>
          </Link>
        </Box>
      )}
      <SimpleGrid columns={[2, null, 3]} spacing={2}>
        {content}
      </SimpleGrid>
      <Pagination onPaginationHandler={paginationHandler} products={products} />
    </>
  );
};

export default HomeScreen;
