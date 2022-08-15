import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "./api/shopSlice";
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
const RegisterScreen = () => {
  const navigate = useNavigate();
  const [register, { isLoading, isError, error }] = useRegisterMutation();
  const [userCredentials, setUserCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  let status;
  if (isLoading) {
    status = <Loader />;
  } else if (isError) {
    status = <Message m={3} error={error.data.message} />;
  }

  const validInputs = [
    userCredentials.name,
    userCredentials.email,
    userCredentials.password,
    userCredentials.confirmPassword,
  ].every(String);

  const submitHandler = async () => {
    if (validInputs) {
      try {
        await register(userCredentials).unwrap();
        navigate("/");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

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
          Register
        </Heading>
        <FormLabel id="name">Name</FormLabel>
        <Input
          id="name"
          mb={2}
          type="text"
          placeholder="Enter Name"
          value={userCredentials.name}
          onChange={(e) =>
            setUserCredentials({ ...userCredentials, name: e.target.value })
          }
        />
        {isError ? (
          <FormHelperText pb={3}>Field cant be empty!</FormHelperText>
        ) : (
          ""
        )}
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
        {isError ? (
          <FormHelperText pb={3}>Field cant be empty!</FormHelperText>
        ) : (
          ""
        )}
        <Button w="full" mb={3} type="submit" onClick={submitHandler}>
          Register
        </Button>
      </FormControl>
      <Text fontWeight="semi-bold" decoration="underline">
        <Link to="/login">Already Registered? Sign In!</Link>
      </Text>
    </Box>
  );
};

export default RegisterScreen;
