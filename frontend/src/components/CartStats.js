import React from "react";
import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";

const CartStats = ({ cartItems }) => {
  return (
    <Stat>
      <StatLabel textTransform="uppercase">
        Subtotal {cartItems.length} Items
      </StatLabel>
      <StatNumber>
        ${" "}
        {cartItems
          .reduce(
            (acc, item) => acc + Number(item.qty) * Number(item.product.price),
            0
          )
          .toFixed(2)}
      </StatNumber>
    </Stat>
  );
};

export default CartStats;
