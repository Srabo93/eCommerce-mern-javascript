import React from "react";
import {
  IconButton,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

const Pagination = ({ products, onPaginationHandler }) => {
  return (
    <Box display="flex" mt={3} justifyContent="center" alignContent="center">
      {products?.hasPrevPage && (
        <IconButton
          size="sm"
          mx={2}
          icon={<ArrowLeftIcon />}
          onClick={() => onPaginationHandler(products?.prevPage)}
        />
      )}
      <Breadcrumb separator="">
        {[...Array(products?.totalPages).keys()].map((page) => (
          <BreadcrumbItem key={page} px={2}>
            <BreadcrumbLink
              color={page + 1 === products?.page ? "teal" : "teal.400"}
              onClick={() => onPaginationHandler(page + 1)}
              fontSize="xl"
            >
              {page + 1}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      {products?.hasNextPage && (
        <IconButton
          size="sm"
          mx={2}
          icon={<ArrowRightIcon />}
          onClick={() => onPaginationHandler(products?.nextPage)}
        />
      )}
    </Box>
  );
};

export default Pagination;
