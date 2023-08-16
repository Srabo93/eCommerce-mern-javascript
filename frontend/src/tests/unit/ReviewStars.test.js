import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReviewStars from "../../components/ReviewStars";

describe("ReviewStars Component", () => {
  let sampleRating = 3;
  let maximalRating = 5;

  it("ensure all 5 stars are rendered", () => {
    render(<ReviewStars />);

    let totalReviewStars = screen.getAllByRole("review");

    expect(totalReviewStars.length).toBe(maximalRating);
  });

  it("renders the filled stars provided by rating", () => {
    render(<ReviewStars rating={sampleRating} />);

    let totalReviewStars = screen.getAllByRole("review");
    let filledReviewStars = 0;

    totalReviewStars.forEach((star, index) => {
      if (star.getAttribute("data-filled") === "true") {
        filledReviewStars++;
      }
      const expectedColor = index < sampleRating ? "teal.500" : "gray.300";
      expect(star).toHaveStyle(`color: ${expectedColor}`);
    });
    expect(sampleRating).toBe(filledReviewStars);
  });
});
