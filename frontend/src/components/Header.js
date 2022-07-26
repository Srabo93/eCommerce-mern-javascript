import React from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Flex,
  Text,
} from "@chakra-ui/react";
const Header = () => {
  return (
    <Container maxW="full" as="header" p={5} bg="blackAlpha.800" color="white">
      <Flex justifyContent="space-between" alignItems="center">
        <Breadcrumb separator="">
          <BreadcrumbItem fontWeight="semibold" fontSize={["lg", "xl", "2xl"]}>
            <BreadcrumbLink as={Link} to="/">
              <Text>PROSHOP</Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Breadcrumb separator="">
          <BreadcrumbItem>
            <i className="fas fa-shopping-cart"></i>
            <BreadcrumbLink as={Link} to="/cart" fontSize="sm" px={1}>
              <Text>CART</Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <i className="fas fa-user"></i>
            <BreadcrumbLink as={Link} to="/login" fontSize="sm" px={1}>
              <Text>SIGN IN</Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
    </Container>
  );
};

export default Header;
