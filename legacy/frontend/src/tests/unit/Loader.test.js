import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Loader from "../../components/Loader";

describe("Loader Component", () => {
  it("should render the loading state", () => {
    render(<Loader />);

    let text = screen.getByText(/Loading.../i);
    let circularProgress = screen.getByRole("progressbar");

    expect(text).toBeInTheDocument();
    expect(circularProgress).toBeInTheDocument();
    expect(circularProgress).toHaveStyle("color: blue.300");
  });
});
