import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthenticatedUser } from "../features/auth/authSlice";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

const CheckOutSteps = ({ step1, step2, step3, step4 }) => {
  const { isAuthenticated } = useSelector(selectAuthenticatedUser);

  return (
    <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} pb={3}>
      <BreadcrumbItem>
        {step1 && !isAuthenticated ? (
          <BreadcrumbLink as={Link} to="/login">
            Sign In
          </BreadcrumbLink>
        ) : (
          <BreadcrumbLink
            color="gray"
            style={{ textDecoration: "none" }}
            _hover={{ cursor: "default" }}
          >
            Sign In
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
      <BreadcrumbItem>
        {step2 ? (
          <BreadcrumbLink as={Link} to="/shipping">
            Shipping
          </BreadcrumbLink>
        ) : (
          <BreadcrumbLink
            color="gray"
            style={{ textDecoration: "none" }}
            _hover={{ cursor: "default" }}
          >
            Shipping
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
      <BreadcrumbItem>
        {step3 ? (
          <BreadcrumbLink as={Link} to="/payment">
            Payment
          </BreadcrumbLink>
        ) : (
          <BreadcrumbLink
            color="gray"
            style={{ textDecoration: "none" }}
            _hover={{ cursor: "default" }}
          >
            Payment
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
      <BreadcrumbItem>
        {step4 ? (
          <BreadcrumbLink as={Link} to="/placeorder">
            Place Order
          </BreadcrumbLink>
        ) : (
          <BreadcrumbLink
            color="gray"
            style={{ textDecoration: "none" }}
            _hover={{ cursor: "default" }}
          >
            Place Order
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

export default CheckOutSteps;
