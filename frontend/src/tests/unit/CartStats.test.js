import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CartStats from "../../components/CartStats";

describe("CartStats Component", () => {
  let items = [
    { product: { price: 1 }, qty: 1 },
    { product: { price: 2 }, qty: 2 },
    { product: { price: 3 }, qty: 3 },
  ];
  let caluclatedAmount = items
    .reduce(
      (acc, item) => acc + Number(item.qty) * Number(item.product.price),
      0
    )
    .toFixed(2);

  it("renders the correct subtotal and item count", () => {
    render(<CartStats cartItems={items} />);

    let subtotalText = screen.getByText(`Subtotal ${items.length} Items`);
    let amount = screen.getByText(`$${caluclatedAmount}`);

    expect(subtotalText).toBeInTheDocument();
    expect(amount).toBeInTheDocument();
  });
});
