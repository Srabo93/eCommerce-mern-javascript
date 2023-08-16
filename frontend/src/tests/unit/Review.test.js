import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Review from "../../components/Review";

describe("Review Component", () => {
  let sampleReview = {
    name: "John Doe",
    rating: 3,
    createdAt: "2023-08-15T12:34:56.789Z",
    comment: "Test Comment for Product",
  };

  it("renders review correct twith data provided", () => {
    render(<Review review={sampleReview} />);

    let reviewName = screen.getByText(sampleReview.name);
    let reviewRating = screen.getAllByRole("review");
    let reviewCreatedAt = screen.getByText(
      sampleReview.createdAt.substring(0, 10)
    );
    let reviewComment = screen.getByText(sampleReview.comment);
    let separator = screen.getByRole("separator");

    expect(reviewName).toBeInTheDocument();
    expect(reviewRating.length).toBe(5);
    expect(reviewCreatedAt).toBeInTheDocument();
    expect(reviewComment).toBeInTheDocument();
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("renders the correct amount of filled stars", () => {
    render(<Review review={sampleReview} />);

    let reviewStars = screen.getAllByRole("review");
    let countedStars = 0;

    reviewStars.forEach((star) => {
      if (star.getAttribute("data-filled") === "true") {
        countedStars++;
      }
    });
    expect(countedStars).toBe(sampleReview.rating);
  });
});
