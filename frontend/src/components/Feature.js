import React from "react";
import { useDispatch } from "react-redux";
import { updateQty, removeItem } from "../features/cartSlice";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Stack,
  Text,
  Box,
  Divider,
  Image,
  Select,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Feature = ({ item }) => {
  const { product, qty } = item;
  const dispatch = useDispatch();

  return (
    <>
      <Stack direction={["column", "row"]} alignItems="center">
        <Box p={[1, 2]} w={["100%", "20%"]}>
          <Image src={product.image} />
        </Box>
        <Box p={[1, 2]} w={["100%", "30%"]}>
          <Link to={`/products/${product._id}`}>
            <Text fontWeight="bold" mt={5} fontSize={["sm", "lg"]}>
              {product.name}
            </Text>
          </Link>
        </Box>
        <Box p={[1, 2]} w={["100%", "20%"]}>
          $ {product.price}
        </Box>
        <Box w={["100%", "25%"]}>
          {product.countInStock > 0 && (
            <Select
              placeholder={qty}
              maxW={["100%", "60%"]}
              onChange={(e) =>
                dispatch(
                  updateQty({
                    id: product._id,
                    changes: {
                      subtotal: Number(product.price * e.target.value),
                      qty: e.target.value,
                    },
                  })
                )
              }
            >
              {[...Array(product.countInStock).keys()].map((count) => (
                <option value={count + 1} key={count + 1}>
                  {count + 1}
                </option>
              ))}
            </Select>
          )}
        </Box>
        <Box p={[1, 2]} w={["100%", "10%"]}>
          <Button onClick={() => dispatch(removeItem(product._id))}>
            <DeleteIcon color="red.600" w={6} h={6} />
          </Button>
        </Box>
      </Stack>
      <Divider />
    </>
  );
};

export default Feature;
