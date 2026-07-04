import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const Message = ({ status, message }) => {
  return (
    <Alert status={status}>
      <AlertIcon />
      <AlertTitle>Message:</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default Message;
