import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLoginMutation } from "./api/shopSlice";

import Loader from "../components/Loader";
import Message from "../components/Message";

import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Heading,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";

/**
 * TODO: navigate away after success log
 */
const LoginScreen = () => {
  const [login, { isLoading, isError, error }] = useLoginMutation();

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  let status;

  const submitHandler = async () => {
    try {
      await login(userCredentials).unwrap();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (isLoading) {
    status = <Loader />;
  } else if (isError) {
    status = <Message m={3} error={error.data.message} />;
  }

  return (
    <Box
      maxW="lg"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {status}
      <FormControl isRequired>
        <Heading mb={3} as="h2">
          Sign In
        </Heading>
        <FormLabel id="email">Email address</FormLabel>
        <Input
          id="email"
          mb={2}
          type="email"
          placeholder="Enter Email"
          value={userCredentials.email}
          onChange={(e) =>
            setUserCredentials({ ...userCredentials, email: e.target.value })
          }
        />
        {isError ? (
          <FormHelperText pb={3}>Field cant be empty!</FormHelperText>
        ) : (
          ""
        )}
        <FormLabel id="password">Password</FormLabel>
        <Input
          id="password"
          mb={3}
          type="password"
          placeholder="Enter Password"
          value={userCredentials.password}
          onChange={(e) =>
            setUserCredentials({ ...userCredentials, password: e.target.value })
          }
        />
        {isError ? (
          <FormHelperText pb={3}>Field cant be empty!</FormHelperText>
        ) : (
          ""
        )}
        <Button w="full" mb={3} type="submit" onClick={submitHandler}>
          Sign In
        </Button>
      </FormControl>
      <Text fontWeight="semi-bold">
        <Link to="/register">New Customer? Register</Link>
      </Text>
    </Box>
  );
};

export default LoginScreen;
