import React, { useState } from "react";
import { useUpdateUserCredentialsMutation } from "../services/user";
import { useGetAllOrdersQuery } from "../services/orders";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import TableComponent from "../../components/TableComponent";
import {
  FormControl,
  FormLabel,
  Input,
  Heading,
  Button,
  Box,
  StackDivider,
  Stack,
} from "@chakra-ui/react";

const ProfileScreen = () => {
  const [update, { isLoading, isError, error }] =
    useUpdateUserCredentialsMutation();

  const {
    data: orders,
    isSuccess,
    isLoading: ordersLoading,
    isError: loadingError,
    error: ordersError,
  } = useGetAllOrdersQuery();

  const [userCredentials, setUserCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState("");

  let status;

  if (isLoading) {
    status = <Loader />;
  }
  if (isError) {
    status = <Message m={3} status="error" message={error.data.message} />;
  }

  const invalidInputs = [
    userCredentials.name,
    userCredentials.email,
    userCredentials.password,
    userCredentials.confirmPassword,
  ].every((value) => value === "");

  const submitHandler = async () => {
    if (invalidInputs) {
      setFormErrors(
        <Message
          m={3}
          status="info"
          message="Empty Inputfields are not valid"
        />
      );
      return;
    }
    if (userCredentials.password !== userCredentials.confirmPassword) {
      setFormErrors(
        <Message m={3} status="info" message="Passwords do not match" />
      );
    }
    try {
      await update(userCredentials).unwrap();
    } catch (error) {
      console.log(error.message);
    }
    setFormErrors(null);
    setUserCredentials({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <Stack
      divider={<StackDivider />}
      direction={["column", "column", "column", "row"]}
    >
      <Box>
        {status}
        {formErrors}
        <FormControl>
          <Heading mb={3} as="h2">
            Update Profile
          </Heading>
          <FormLabel id="name">Name</FormLabel>
          <Input
            id="name"
            mb={2}
            type="text"
            placeholder="Update Name"
            value={userCredentials.name}
            onChange={(e) =>
              setUserCredentials({
                ...userCredentials,
                name: e.target.value,
              })
            }
          />
          <FormLabel id="email">Email address</FormLabel>
          <Input
            id="email"
            mb={2}
            type="email"
            placeholder="Update Email"
            value={userCredentials.email}
            onChange={(e) =>
              setUserCredentials({
                ...userCredentials,
                email: e.target.value,
              })
            }
          />
          <FormLabel id="password">Password</FormLabel>
          <Input
            id="password"
            mb={3}
            type="password"
            placeholder="Update Password"
            value={userCredentials.password}
            onChange={(e) =>
              setUserCredentials({
                ...userCredentials,
                password: e.target.value,
              })
            }
          />
          <FormLabel id="repeatPassword">Repeat Password</FormLabel>
          <Input
            id="repeatPassword"
            mb={3}
            type="password"
            placeholder="Confirm Password"
            value={userCredentials.confirmPassword}
            onChange={(e) =>
              setUserCredentials({
                ...userCredentials,
                confirmPassword: e.target.value,
              })
            }
          />
          <Button w="full" mb={3} type="submit" onClick={submitHandler}>
            Update!
          </Button>
        </FormControl>
      </Box>
      <Box style={{ marginBottom: "auto" }} px={3}>
        <Heading mb={3} as="h2">
          My Orders
        </Heading>
        <TableComponent
          data={{ orders, ordersError, loadingError, ordersLoading, isSuccess }}
        />
      </Box>
    </Stack>
  );
};

export default ProfileScreen;
