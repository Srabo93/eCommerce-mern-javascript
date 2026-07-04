import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "../../components/Footer.js";

describe("Footer", () => {
  it("renders Footer component with copyright text", () => {
    render(<Footer />);
    const copyrightText = screen.getByText(/Copyright © Proshop/i);
    expect(copyrightText).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
