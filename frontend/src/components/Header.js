import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthenticatedUser } from "../features/auth/authSlice";
import { logout } from "../features/auth/authSlice";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const Header = () => {
  const { isAuthenticated, user } = useSelector(selectAuthenticatedUser);
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(logout());
  };

  let userAction;

  if (isAuthenticated) {
    userAction = (
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          colorScheme="black"
        >
          <Text
            fontWeight="normal"
            fontSize="sm"
            fontStyle="inherit"
            casing="uppercase"
          >
            {user}
          </Text>
        </MenuButton>
        <MenuList bgColor="gray.200">
          <MenuItem color="black">
            <Link to="/profile">Profile</Link>
          </MenuItem>
          <MenuItem color="black" onClick={logOut}>
            Log Out
          </MenuItem>
        </MenuList>
      </Menu>
    );
  } else {
    userAction = (
      <BreadcrumbItem>
        <i className="fas fa-user"></i>
        <BreadcrumbLink as={Link} to="/login" fontSize="sm" px={1}>
          <Text>SIGN IN</Text>
        </BreadcrumbLink>
      </BreadcrumbItem>
    );
  }

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
          <BreadcrumbItem>{userAction}</BreadcrumbItem>
        </Breadcrumb>
      </Flex>
    </Container>
  );
};

export default Header;
