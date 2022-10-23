import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthenticatedUser } from "../features/auth/authSlice";
import { logout } from "../features/auth/authSlice";
import Searchbox from "./Searchbox";
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
  const { isAuthenticated, user, isAdmin } = useSelector(
    selectAuthenticatedUser
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = () => {
    dispatch(logout());
    navigate("/");
    window.location.reload();
  };

  let userAction;

  if (isAuthenticated) {
    userAction = (
      <BreadcrumbItem>
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
            {user && !isAdmin && (
              <BreadcrumbLink as={Link} to="/profile">
                <MenuItem color="black">Profile</MenuItem>
              </BreadcrumbLink>
            )}
            {isAdmin && user && (
              <>
                <BreadcrumbLink as={Link} to="/admin/userlist">
                  <MenuItem color="black">Users</MenuItem>
                </BreadcrumbLink>
                <BreadcrumbLink as={Link} to="/admin/productlist">
                  <MenuItem color="black">Products</MenuItem>
                </BreadcrumbLink>
                <BreadcrumbLink as={Link} to="/admin/orderlist">
                  <MenuItem color="black">Orders</MenuItem>
                </BreadcrumbLink>
              </>
            )}
            <MenuItem color="black" onClick={logOut}>
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>
      </BreadcrumbItem>
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
      <Flex
        display="flex"
        flexDir={["column", "row"]}
        justifyContent="space-between"
        alignItems="center"
      >
        <Breadcrumb separator="">
          <BreadcrumbItem fontWeight="semibold" fontSize={["lg", "xl", "2xl"]}>
            <BreadcrumbLink as={Link} to="/">
              <Text>PROSHOP</Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <Searchbox />
        </Breadcrumb>
        <Breadcrumb separator="">
          <BreadcrumbItem>
            <i className="fas fa-shopping-cart"></i>
            <BreadcrumbLink as={Link} to="/cart" fontSize="sm" px={1}>
              <Text>CART</Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {userAction}
        </Breadcrumb>
      </Flex>
    </Container>
  );
};

export default Header;
