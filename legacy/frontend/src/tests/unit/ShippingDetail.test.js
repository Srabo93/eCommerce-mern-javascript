import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // Import this to extend Jest DOM matchers
import ShippingDetails from "../../components/ShippingDetails";

describe("ShippingDetails component", () => {
  const sampleOrder = {
    user: {
      name: "John Doe",
      email: "johndoe@example.com",
    },
    shippingAddress: {
      address: "123 Main St",
      city: "Cityville",
      postalCode: "12345",
      country: "Countryland",
    },
    isDelivered: true,
    deliveredAt: "2023-08-15T12:34:56.789Z",
  };

  it("renders shipping details correctly for delivered order", () => {
    render(<ShippingDetails order={sampleOrder} />);

    const nameElement = screen.getByText(`Name: ${sampleOrder.user.name}`);
    const emailElement = screen.getByText(`Email: ${sampleOrder.user.email}`);
    const addressElement = screen.getByText(
      `Address: ${sampleOrder.shippingAddress.address} ${sampleOrder.shippingAddress.city} ${sampleOrder.shippingAddress.postalCode} ${sampleOrder.shippingAddress.country}`
    );
    const successAlert = screen.getByRole("alert", { status: "success" });
    const deliveredAtElement = screen.getByText(
      `Deliverd on ${sampleOrder.deliveredAt.substring(0, 10)}`
    );

    expect(nameElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(addressElement).toBeInTheDocument();
    expect(successAlert).toBeInTheDocument();
    expect(deliveredAtElement).toBeInTheDocument();
  });

  it("renders shipping details correctly for undelivered order", () => {
    const undeliveredOrder = { ...sampleOrder, isDelivered: false };
    render(<ShippingDetails order={undeliveredOrder} />);

    const errorAlert = screen.getByRole("alert", { status: "error" });
    const notDeliveredElement = screen.getByText("Not Delivered");

    expect(errorAlert).toBeInTheDocument();
    expect(notDeliveredElement).toBeInTheDocument();
  });
});
