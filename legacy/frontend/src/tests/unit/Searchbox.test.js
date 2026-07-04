import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";
import Searchbox from "../../components/Searchbox";

// Mocking the useNavigate hook
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("Searchbox component", () => {
  it("renders input and search button", () => {
    render(<Searchbox />);

    expect(screen.getByPlaceholderText("Search Product")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("updates keyword state on input change", () => {
    render(<Searchbox />);

    const input = screen.getByPlaceholderText("Search Product");
    fireEvent.change(input, { target: { value: "shoes" } });

    expect(input.value).toBe("shoes");
  });

  it("navigates to search results on search button click", () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(<Searchbox />);

    const input = screen.getByPlaceholderText("Search Product");
    const searchButton = screen.getByText("Search");

    fireEvent.change(input, { target: { value: "shoes" } });
    fireEvent.click(searchButton);

    expect(navigate).toHaveBeenCalledWith("/search/shoes");
  });

  it("does not navigate if keyword is empty", () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(<Searchbox />);

    const searchButton = screen.getByText("Search");

    fireEvent.click(searchButton);

    expect(navigate).not.toHaveBeenCalled();
  });
});
