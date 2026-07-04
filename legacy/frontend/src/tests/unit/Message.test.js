import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Message from "../../components/Message";

describe("Message Component", () => {
  it("renders component with status and text", () => {
    let status = "success";
    let message = "Succesfull Message";

    render(<Message status={status} message={message} />);

    let alert = screen.getByRole("alert");
    let alertTitle = screen.getByText(/Message:/i);
    let alertDescription = screen.getByText(message);

    expect(alert).toBeInTheDocument();
    expect(alertTitle).toBeInTheDocument();
    expect(alertDescription).toBeInTheDocument();
  });
});
