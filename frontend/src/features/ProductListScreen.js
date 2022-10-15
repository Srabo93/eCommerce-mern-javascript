import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectAllProducts,
  useDeleteProductMutation,
  useCreateProductMutation,
} from "./services/products";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Container,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import Loader from "../components/Loader";

const ProductListScreen = () => {
  const navigate = useNavigate();
  const products = useSelector(selectAllProducts);
  const [deleteProduct] = useDeleteProductMutation();
  const [createProduct, { isLoading, data }] = useCreateProductMutation();

  useEffect(() => {
    if (data !== undefined) {
      navigate(`/admin/product/${data?._id}/edit`);
    }

    return () => {};
  }, [data]);

  const deleteHandler = async (id) => {
    await deleteProduct(id);
  };

  const createProductHandler = async () => {
    await createProduct();
  };

  let tBody;

  tBody = products.map((product) => (
    <Tr key={product._id}>
      <Td p={2}>{product._id}</Td>
      <Td p={2}>{product.name}</Td>
      <Td p={2}>$ {product.price}</Td>
      <Td p={2}>{product.category}</Td>
      <Td p={2}>{product.brand}</Td>
      <Td p={2}>
        <Link to={`/admin/product/${product._id}/edit`}>
          <Button m={1}>
            <EditIcon />
          </Button>
        </Link>
        <Button color="red" m={1} onClick={() => deleteHandler(product._id)}>
          <DeleteIcon />
        </Button>
      </Td>
    </Tr>
  ));

  return (
    <Container maxW="full">
      <Heading py={3} as="h2" mr="auto">
        PRODUCTS
      </Heading>
      {isLoading && <Loader />}
      <TableContainer maxW="100vw">
        <Table variant="simple" size="small">
          <TableCaption>All Products</TableCaption>
          <Thead>
            <Tr>
              <Th p={2}>ID</Th>
              <Th p={2}>NAME</Th>
              <Th p={2}>PRICE</Th>
              <Th p={2}>CATEGORY</Th>
              <Th p={2}>BRAND</Th>
              <Th p={2}>
                <Button
                  leftIcon={<AddIcon />}
                  variant="ghost"
                  color="teal"
                  onClick={createProductHandler}
                >
                  New Product
                </Button>
              </Th>
            </Tr>
          </Thead>
          <Tbody>{tBody}</Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ProductListScreen;
