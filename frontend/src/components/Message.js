import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const Message = ({ error }) => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Something went wrong:</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default Message;
