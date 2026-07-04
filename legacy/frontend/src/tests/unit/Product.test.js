import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import "@testing-library/jest-dom";
import Product from "../../components/Product";

describe("Product Component", () => {
  it("Product component renders correctly", () => {
    const product = {
      _id: "123",
      name: "Sample Product",
      image: "sample.jpg",
      rating: 4,
      price: 19.99,
    };

    render(
      <Router>
        <ChakraProvider>
          <Product product={product} />
        </ChakraProvider>
      </Router>
    );

    const productName = screen.getByText("Sample Product");
    expect(productName).toBeInTheDocument();

    const productPrice = screen.getByText("$19.99");
    expect(productPrice).toBeInTheDocument();

    const productImage = screen.getByAltText("sample.jpg");
    expect(productImage).toBeInTheDocument();

    const starIcons = screen.getAllByRole("review");
    expect(starIcons.length).toBe(5);

    let reviewStars = screen.getAllByRole("review");
    let countedStars = 0;

    reviewStars.forEach((star) => {
      if (star.getAttribute("data-filled") === "true") {
        countedStars++;
      }
    });
    expect(countedStars).toBe(product.rating);
  });
});
